import React, { useState } from 'react';
import './signUp.css';
import Modal from '../Modal/modal';
import ForgotPassword from '../ForgotPassword/forgotPassword';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AVATAR_OPTIONS = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=250&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=250&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=250&auto=format&fit=crop"
];

const SignUp = ({ onSwitchToLogin }) => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [inputField, setInputField] = useState({
        gymName: "",
        email: "",
        userName: "",
        password: "",
        profilePic: AVATAR_OPTIONS[0]
    });
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setForgotPassword(prev => !prev);
    };

    const handleOnchange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        const { gymName, email, userName, password } = inputField;

        if (!gymName.trim() || !email.trim() || !userName.trim() || !password.trim()) {
            toast.warn("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:4000/auth/register', inputField);
            toast.success(res.data.message || "Registration successful! You can now log in.");
            if (onSwitchToLogin) {
                setTimeout(() => onSwitchToLogin(), 1000);
            }
        } catch (err) {
            console.error("Register Error:", err);
            const errMsg = err.response?.data?.error || "Registration failed. Try a different username/email.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full max-w-md mx-auto p-8 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800'>
            <div className='text-center mb-6'>
                <h2 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent'>
                    Register Your Gym
                </h2>
                <p className='text-sm text-gray-400 mt-1'>Create an administrative account for your gym</p>
            </div>

            <form onSubmit={handleRegister} className='space-y-3.5'>
                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1'>
                        Gym / Club Name *
                    </label>
                    <input
                        type='text'
                        value={inputField.gymName}
                        onChange={(e) => handleOnchange(e, "gymName")}
                        className='w-full px-3.5 py-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-indigo-500'
                        placeholder='e.g. Titan Fitness Club'
                    />
                </div>

                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1'>
                        Admin Email *
                    </label>
                    <input
                        type='email'
                        value={inputField.email}
                        onChange={(e) => handleOnchange(e, "email")}
                        className='w-full px-3.5 py-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-indigo-500'
                        placeholder='owner@gym.com'
                    />
                </div>

                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1'>
                        Login Username *
                    </label>
                    <input
                        type='text'
                        value={inputField.userName}
                        onChange={(e) => handleOnchange(e, "userName")}
                        className='w-full px-3.5 py-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-indigo-500'
                        placeholder='titanadmin'
                    />
                </div>

                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1'>
                        Password *
                    </label>
                    <input
                        type='password'
                        value={inputField.password}
                        onChange={(e) => handleOnchange(e, "password")}
                        className='w-full px-3.5 py-2.5 bg-slate-800 text-white rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-indigo-500'
                        placeholder='••••••••'
                    />
                </div>

                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2'>
                        Gym Logo / Profile Picture
                    </label>
                    <div className='flex gap-3 items-center mb-2'>
                        {AVATAR_OPTIONS.map((pic, idx) => (
                            <img
                                key={idx}
                                src={pic}
                                alt={`Option ${idx}`}
                                onClick={() => setInputField({ ...inputField, profilePic: pic })}
                                className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                                    inputField.profilePic === pic ? 'border-indigo-500 ring-2 ring-indigo-400' : 'border-slate-700 opacity-60 hover:opacity-100'
                                }`}
                            />
                        ))}
                    </div>
                    <input
                        type='text'
                        value={inputField.profilePic}
                        onChange={(e) => handleOnchange(e, "profilePic")}
                        placeholder='Or paste image URL'
                        className='w-full px-3 py-1.5 bg-slate-800 text-white rounded-lg border border-slate-700 text-xs'
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition-all disabled:opacity-50'
                >
                    {loading ? "Registering..." : "Create Gym Account"}
                </button>
            </form>

            <div className='mt-5 flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-slate-800'>
                {onSwitchToLogin && (
                    <button
                        onClick={onSwitchToLogin}
                        className='text-indigo-400 font-semibold hover:underline'
                    >
                        Already registered? Login
                    </button>
                )}
                <button
                    onClick={() => handleClose()}
                    className='text-gray-400 hover:text-white hover:underline'
                >
                    Forgot Password?
                </button>
            </div>

            {forgotPassword && (
                <Modal header="Password Recovery" handleClose={handleClose} content={<ForgotPassword handleClose={handleClose} />} />
            )}
            <ToastContainer />
        </div>
    );
};

export default SignUp;
