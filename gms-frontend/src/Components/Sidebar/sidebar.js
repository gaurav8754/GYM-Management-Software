import React, { useState, useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const Sidebar = () => {
    const [greeting, setGreeting] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const greetingMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting("Good Morning ☀️");
        } else if (hour < 18) {
            setGreeting("Good Afternoon 🌤️");
        } else {
            setGreeting("Good Evening 🌙");
        }
    };

    useEffect(() => {
        greetingMessage();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.warn("Logout error:", err);
        }
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    const gymName = localStorage.getItem('gymName') || "My Gym";
    const profilePic = localStorage.getItem('profilePic') || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=250&auto=format&fit=crop";

    return (
        <aside className='w-64 min-w-[16rem] h-screen sticky top-0 bg-slate-950 text-white p-5 flex flex-col justify-between border-r border-slate-800 shadow-xl'>
            <div>
                {/* Brand / Gym Profile */}
                <div className='flex items-center gap-3 pb-6 border-b border-slate-800'>
                    <img
                        src={profilePic}
                        alt='Gym Logo'
                        className='w-12 h-12 rounded-xl object-cover border border-indigo-500 shadow-md'
                    />
                    <div className='overflow-hidden'>
                        <h1 className='text-base font-bold truncate text-white tracking-wide'>
                            {gymName}
                        </h1>
                        <p className='text-xs text-indigo-400 font-medium'>
                            {greeting}
                        </p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className='mt-8 space-y-2'>
                    <Link
                        to='/dashboard'
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                            location.pathname === "/dashboard"
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                    >
                        <HomeIcon fontSize="small" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to='/member'
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                            location.pathname === "/member" || location.pathname.startsWith('/member/')
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                    >
                        <GroupIcon fontSize="small" />
                        <span>All Members</span>
                    </Link>

                    <Link
                        to='/'
                        className='flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-200'
                    >
                        <LanguageIcon fontSize="small" />
                        <span>Public Gym Website</span>
                    </Link>
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className='pt-6 border-t border-slate-800 space-y-3'>
                <div className='bg-slate-900/80 p-3 rounded-xl text-xs text-slate-400 border border-slate-800 flex items-center gap-2'>
                    <FitnessCenterIcon fontSize="small" className="text-indigo-400" />
                    <span>Gym Management v2.0</span>
                </div>

                <button
                    onClick={handleLogout}
                    className='w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200'
                >
                    <LogoutIcon fontSize="small" />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
