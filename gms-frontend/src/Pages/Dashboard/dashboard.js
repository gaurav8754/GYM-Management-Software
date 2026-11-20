import React, { useState, useEffect } from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ErrorIcon from '@mui/icons-material/Error';
import BlockIcon from '@mui/icons-material/Block';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Modal from '../../Components/Modal/modal';
import Addmembers from '../../Components/Addmembers/addmembers';
import AddmemberShip from '../../Components/Addmembership/addmemberShip';

const Dashboard = () => {
    const [counts, setCounts] = useState({
        total: 0,
        monthly: 0,
        expiring3: 0,
        expiring47: 0,
        expired: 0,
        inactive: 0
    });
    const [loading, setLoading] = useState(true);
    const [addMemberModal, setAddMemberModal] = useState(false);
    const [addMembershipModal, setAddMembershipModal] = useState(false);

    const gymName = localStorage.getItem('gymName') || "Titan Fitness";

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const [allRes, monthlyRes, exp3Res, exp47Res, expiredRes, inactiveRes] = await Promise.allSettled([
                axios.get(`${API_BASE_URL}/members/all-member?limit=1`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/members/monthly-member`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/members/expiring-within-3-days`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/members/expiring-within-4-7-days`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/members/expired-member`, { withCredentials: true }),
                axios.get(`${API_BASE_URL}/members/inactive-member`, { withCredentials: true })
            ]);

            setCounts({
                total: allRes.status === 'fulfilled' ? (allRes.value.data.totalMembers || 0) : 0,
                monthly: monthlyRes.status === 'fulfilled' ? (monthlyRes.value.data.totalMembers || 0) : 0,
                expiring3: exp3Res.status === 'fulfilled' ? (exp3Res.value.data.totalMembers || 0) : 0,
                expiring47: exp47Res.status === 'fulfilled' ? (exp47Res.value.data.totalMembers || 0) : 0,
                expired: expiredRes.status === 'fulfilled' ? (expiredRes.value.data.totalMembers || 0) : 0,
                inactive: inactiveRes.status === 'fulfilled' ? (inactiveRes.value.data.totalMembers || 0) : 0
            });
        } catch (err) {
            console.error("Dashboard stats error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOnClickMenu = (value) => {
        sessionStorage.setItem('func', value);
    };

    return (
        <div className='flex-1 p-6 md:p-8 bg-slate-50 min-h-screen text-slate-900'>
            {/* Top Header */}
            <div className='bg-slate-900 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <span className='text-xs uppercase font-bold tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800'>
                        Gym Operations Center
                    </span>
                    <h1 className='text-2xl md:text-3xl font-extrabold mt-2'>
                        {gymName} Overview
                    </h1>
                    <p className='text-xs md:text-sm text-gray-400 mt-1'>
                        Manage member renewals, track subscriptions, and grow your fitness business.
                    </p>
                </div>

                <div className='flex gap-3'>
                    <button
                        onClick={() => setAddMemberModal(true)}
                        className='px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition'
                    >
                        <AddIcon fontSize="small" /> Add Member
                    </button>
                    <button
                        onClick={() => setAddMembershipModal(true)}
                        className='px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition'
                    >
                        <FitnessCenterIcon fontSize="small" /> Manage Plans
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className='mt-8'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-bold text-slate-800'>Quick Status & Alerts</h2>
                    <span className='text-xs text-gray-500'>Click any card to view list</span>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {/* Card 1: Total Members */}
                    <Link
                        to='/member'
                        className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group'
                    >
                        <div className='flex justify-between items-center'>
                            <div className='p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                                <PeopleAltIcon fontSize="large" />
                            </div>
                            <span className='text-3xl font-black text-slate-900'>{counts.total}</span>
                        </div>
                        <h3 className='mt-4 font-bold text-slate-800 text-lg'>All Registered Members</h3>
                        <p className='text-xs text-gray-500 mt-1'>Total members enrolled across all plans</p>
                    </Link>

                    {/* Card 2: Monthly Joined */}
                    <Link
                        to='/specific/monthly'
                        onClick={() => handleOnClickMenu("monthlyJoined")}
                        className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group'
                    >
                        <div className='flex justify-between items-center'>
                            <div className='p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors'>
                                <SignalCellularAltIcon fontSize="large" />
                            </div>
                            <span className='text-3xl font-black text-slate-900'>{counts.monthly}</span>
                        </div>
                        <h3 className='mt-4 font-bold text-slate-800 text-lg'>Joined This Month</h3>
                        <p className='text-xs text-gray-500 mt-1'>New member enrollments this calendar month</p>
                    </Link>

                    {/* Card 3: Expiring In 3 Days */}
                    <Link
                        to='/specific/expire-with-in-3-days'
                        onClick={() => handleOnClickMenu("threeDayExpire")}
                        className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group'
                    >
                        <div className='flex justify-between items-center'>
                            <div className='p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors'>
                                <AccessAlarmIcon fontSize="large" />
                            </div>
                            <span className='text-3xl font-black text-amber-600'>{counts.expiring3}</span>
                        </div>
                        <h3 className='mt-4 font-bold text-slate-800 text-lg'>Expiring in ≤ 3 Days</h3>
                        <p className='text-xs text-gray-500 mt-1'>Urgent renewal follow-ups needed</p>
                    </Link>

                    {/* Card 4: Expiring In 4-7 Days */}
                    <Link
                        to='/specific/expire-with-in-4-7-days'
                        onClick={() => handleOnClickMenu("fourToSevenDaysExpire")}
                        className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group'
                    >
                        <div className='flex justify-between items-center'>
                            <div className='p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors'>
                                <AccessAlarmIcon fontSize="large" />
                            </div>
                            <span className='text-3xl font-black text-slate-900'>{counts.expiring47}</span>
                        </div>
                        <h3 className='mt-4 font-bold text-slate-800 text-lg'>Expiring in 4–7 Days</h3>
                        <p className='text-xs text-gray-500 mt-1'>Upcoming billings due next week</p>
                    </Link>

                    {/* Card 5: Expired */}
                    <Link
                        to='/specific/expired'
                        onClick={() => handleOnClickMenu("expired")}
                        className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group'
                    >
                        <div className='flex justify-between items-center'>
                            <div className='p-3 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors'>
                                <ErrorIcon fontSize="large" />
                            </div>
                            <span className='text-3xl font-black text-red-600'>{counts.expired}</span>
                        </div>
                        <h3 className='mt-4 font-bold text-slate-800 text-lg'>Expired Memberships</h3>
                        <p className='text-xs text-gray-500 mt-1'>Members past due date requiring renewal</p>
                    </Link>

                    {/* Card 6: Inactive */}
                    <Link
                        to='/specific/inactive'
                        onClick={() => handleOnClickMenu("inActiveMembers")}
                        className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group'
                    >
                        <div className='flex justify-between items-center'>
                            <div className='p-3 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors'>
                                <BlockIcon fontSize="large" />
                            </div>
                            <span className='text-3xl font-black text-slate-700'>{counts.inactive}</span>
                        </div>
                        <h3 className='mt-4 font-bold text-slate-800 text-lg'>Inactive Members</h3>
                        <p className='text-xs text-gray-500 mt-1'>Paused or suspended member accounts</p>
                    </Link>
                </div>
            </div>

            {/* Modals */}
            {addMemberModal && (
                <Modal
                    header="Add New Gym Member"
                    handleClose={() => { setAddMemberModal(false); fetchDashboardStats(); }}
                    content={<Addmembers />}
                />
            )}

            {addMembershipModal && (
                <Modal
                    header="Manage Membership Plans"
                    handleClose={() => setAddMembershipModal(false)}
                    content={<AddmemberShip handleClose={() => setAddMembershipModal(false)} />}
                />
            )}
        </div>
    );
};

export default Dashboard;
