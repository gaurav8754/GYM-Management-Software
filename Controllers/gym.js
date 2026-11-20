const Gym = require('../Modals/gym');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true,
    secure: false, // Set to true in HTTPS production
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

exports.register = async (req, res) => {
    try {
        const { userName, password, gymName, profilePic, email } = req.body;

        if (!userName || !password || !gymName || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const isUserExist = await Gym.findOne({ userName });
        if (isUserExist) {
            return res.status(400).json({ error: "Username already taken, please choose another" });
        }

        const isEmailExist = await Gym.findOne({ email });
        if (isEmailExist) {
            return res.status(400).json({ error: "Email already registered with another gym" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultPic = profilePic || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=250&auto=format&fit=crop";

        const newGym = new Gym({
            userName,
            password: hashedPassword,
            gymName,
            profilePic: defaultPic,
            email
        });

        await newGym.save();

        res.status(201).json({
            message: "Gym registered successfully! Please login.",
            gym: {
                id: newGym._id,
                gymName: newGym.gymName,
                userName: newGym.userName,
                email: newGym.email,
                profilePic: newGym.profilePic
            }
        });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Server Error during registration" });
    }
};

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ error: "Please enter username and password" });
        }

        const gym = await Gym.findOne({ userName });
        if (!gym) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, gym.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const secret = process.env.JWT_SecretKey || 'GymManagementSuperSecretKey_2026';
        const token = jwt.sign({ gym_id: gym._id }, secret, { expiresIn: '7d' });

        res.cookie('cookie_token', token, cookieOptions);

        res.status(200).json({
            message: "Logged in successfully",
            gym: {
                id: gym._id,
                gymName: gym.gymName,
                userName: gym.userName,
                email: gym.email,
                profilePic: gym.profilePic
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server Error during login" });
    }
};

const getTransporter = () => {
    if (process.env.SENDER_EMAIL && process.env.EMAIL_PASSWORD) {
        return nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    return null;
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const gym = await Gym.findOne({ email });
        if (!gym) {
            return res.status(404).json({ error: "No gym account found with this email" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        gym.resetPasswordToken = otp;
        gym.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await gym.save();

        console.log(`[OTP Generated] Email: ${email} | Code: ${otp}`);

        const transporter = getTransporter();
        if (transporter) {
            try {
                await transporter.sendMail({
                    from: process.env.SENDER_EMAIL,
                    to: email,
                    subject: 'Gym Management System - Password Reset OTP',
                    text: `Your OTP for password reset is: ${otp}. It will expire in 1 hour.`
                });
            } catch (mailErr) {
                console.warn("Mail sending failed, but OTP logged to server console:", mailErr.message);
            }
        }

        return res.status(200).json({
            message: "OTP sent successfully! (Check server console if test email credentials are not configured)",
            otpInDev: otp
        });

    } catch (err) {
        console.error("Send OTP Error:", err);
        res.status(500).json({ error: "Server Error while sending OTP" });
    }
};

exports.checkOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const gym = await Gym.findOne({
            email,
            resetPasswordToken: otp.toString(),
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!gym) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        res.status(200).json({ message: "OTP is Successfully Verified" });

    } catch (err) {
        console.error("Check OTP Error:", err);
        res.status(500).json({ error: "Server Error verifying OTP" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email and new password are required" });
        }

        const gym = await Gym.findOne({ email });
        if (!gym) {
            return res.status(404).json({ error: "Gym account not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        gym.password = hashedPassword;
        gym.resetPasswordToken = undefined;
        gym.resetPasswordExpires = undefined;

        await gym.save();

        res.status(200).json({ message: "Password Reset Successfully" });

    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ error: "Server Error while resetting password" });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('cookie_token', cookieOptions).json({ message: 'Logged out successfully' });
};
