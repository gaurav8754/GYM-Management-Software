import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ onSwitchToSignup, onForgotPassword }) => {
    const [loginField, setLoginField] = useState({ userName: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOnChange = (event, name) => {
        setLoginField({ ...loginField, [name]: event.target.value });
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!loginField.userName.trim() || !loginField.password.trim()) {
            toast.warn("Please enter both username and password");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/auth/login', loginField, {
                withCredentials: true
            });

            toast.success("Login Successful! Redirecting...");
            localStorage.setItem("isLogin", "true");
            if (response.data && response.data.gym) {
                localStorage.setItem("gymName", response.data.gym.gymName || "My Gym");
                localStorage.setItem("userName", response.data.gym.userName || "");
                localStorage.setItem("profilePic", response.data.gym.profilePic || "");
                localStorage.setItem("email", response.data.gym.email || "");
            }

            setTimeout(() => {
                navigate('/dashboard');
                window.location.reload();
            }, 600);

        } catch (err) {
            console.error("Login failed:", err);
            const errMsg = err.response?.data?.error || "Invalid username or password";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full max-w-md mx-auto p-8 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800'>
            <div className='text-center mb-6'>
                <h2 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent'>
                    Gym Portal Login
                </h2>
                <p className='text-sm text-gray-400 mt-1'>Access your gym management dashboard</p>
            </div>

            <form onSubmit={handleLogin} className='space-y-4'>
                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5'>
                        Username
                    </label>
                    <input
                        value={loginField.userName}
                        onChange={(e) => handleOnChange(e, "userName")}
                        type='text'
                        className='w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors'
                        placeholder='Enter gym username'
                    />
                </div>

                <div>
                    <div className='flex justify-between items-center mb-1.5'>
                        <label className='text-xs font-semibold uppercase tracking-wider text-gray-300'>
                            Password
                        </label>
                        {onForgotPassword && (
                            <button
                                type='button'
                                onClick={onForgotPassword}
                                className='text-xs text-indigo-400 hover:text-indigo-300 hover:underline'
                            >
                                Forgot password?
                            </button>
                        )}
                    </div>
                    <input
                        value={loginField.password}
                        onChange={(e) => handleOnChange(e, "password")}
                        type='password'
                        className='w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors'
                        placeholder='Enter password'
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition-all transform active:scale-95 disabled:opacity-50'
                >
                    {loading ? "Logging in..." : "Login to Portal"}
                </button>
            </form>

            {onSwitchToSignup && (
                <div className='mt-6 pt-4 border-t border-slate-800 text-center text-sm text-gray-400'>
                    Don't have a gym account yet?{' '}
                    <button
                        onClick={onSwitchToSignup}
                        className='text-indigo-400 font-semibold hover:underline'
                    >
                        Register Gym
                    </button>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Login;
