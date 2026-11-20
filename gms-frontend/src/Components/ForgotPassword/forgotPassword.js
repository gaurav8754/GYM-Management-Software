import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../../config';

const ForgotPassword = ({ handleClose }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [loader, setLoader] = useState(false);
    const [inputField, setInputField] = useState({ email: "", otp: "", newPassword: "" });

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    const sendOtp = async () => {
        if (!inputField.email.trim()) {
            toast.warn("Please enter your registered gym email");
            return;
        }

        setLoader(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/reset-password/sendOtp`, { email: inputField.email });
            toast.success(res.data.message || "OTP generated! Check your email or backend console.");
            setStep(2);
        } catch (err) {
            console.error("OTP send error:", err);
            const msg = err.response?.data?.error || "Failed to generate OTP for this email";
            toast.error(msg);
        } finally {
            setLoader(false);
        }
    };

    const verifyOTP = async () => {
        if (!inputField.otp.trim()) {
            toast.warn("Please enter the 6-digit OTP");
            return;
        }

        setLoader(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/reset-password/checkOtp`, {
                email: inputField.email,
                otp: inputField.otp
            });
            toast.success(res.data.message || "OTP verified!");
            setStep(3);
        } catch (err) {
            console.error("OTP verify error:", err);
            const msg = err.response?.data?.error || "Invalid or expired OTP";
            toast.error(msg);
        } finally {
            setLoader(false);
        }
    };

    const changePassword = async () => {
        if (!inputField.newPassword.trim() || inputField.newPassword.length < 4) {
            toast.warn("Password must be at least 4 characters");
            return;
        }

        setLoader(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                email: inputField.email,
                newPassword: inputField.newPassword
            });
            toast.success(res.data.message || "Password reset successfully! Please login with your new password.");
            if (handleClose) {
                setTimeout(() => handleClose(), 1500);
            }
        } catch (err) {
            console.error("Password reset error:", err);
            const msg = err.response?.data?.error || "Password reset failed";
            toast.error(msg);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className='w-full text-black p-4'>
            <div className='mb-4 text-center'>
                <div className='flex justify-center gap-2 mb-3'>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>1</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>2</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>3</span>
                </div>
                <h4 className='font-bold text-slate-800 text-lg'>
                    {step === 1 && "Enter Registered Email"}
                    {step === 2 && "Enter 6-Digit OTP"}
                    {step === 3 && "Set New Password"}
                </h4>
            </div>

            {step === 1 && (
                <div className='space-y-4'>
                    <input
                        type='email'
                        value={inputField.email}
                        onChange={(e) => handleOnChange(e, "email")}
                        placeholder='Enter gym email address'
                        className='w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <button
                        disabled={loader}
                        onClick={sendOtp}
                        className='w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition shadow disabled:opacity-50'
                    >
                        {loader ? "Sending OTP..." : "Send Verification OTP"}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className='space-y-4'>
                    <input
                        type='text'
                        maxLength='6'
                        value={inputField.otp}
                        onChange={(e) => handleOnChange(e, "otp")}
                        placeholder='Enter 6-digit OTP'
                        className='w-full p-3 border border-slate-300 rounded-lg text-sm text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <div className='flex gap-2'>
                        <button
                            type='button'
                            onClick={() => setStep(1)}
                            className='w-1/3 py-3 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-gray-50'
                        >
                            Back
                        </button>
                        <button
                            disabled={loader}
                            onClick={verifyOTP}
                            className='w-2/3 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow disabled:opacity-50'
                        >
                            {loader ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className='space-y-4'>
                    <input
                        type='password'
                        value={inputField.newPassword}
                        onChange={(e) => handleOnChange(e, "newPassword")}
                        placeholder='Enter your new password'
                        className='w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                    <button
                        disabled={loader}
                        onClick={changePassword}
                        className='w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow disabled:opacity-50'
                    >
                        {loader ? "Updating..." : "Reset Password"}
                    </button>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ForgotPassword;
