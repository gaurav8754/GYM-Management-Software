import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PaymentIcon from '@mui/icons-material/Payment';

const MemberDetail = () => {
    const [status, setStatus] = useState("Active");
    const [renew, setRenew] = useState(false);
    const [membership, setMembership] = useState([]);
    const [data, setData] = useState(null);
    const [planMember, setPlanMember] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchData();
        fetchMembership();
    }, [id]);

    const fetchMembership = async () => {
        try {
            const res = await axios.get('http://localhost:4000/plans/get-membership', { withCredentials: true });
            if (res.data && res.data.memberships) {
                setMembership(res.data.memberships);
                if (res.data.memberships.length > 0) {
                    setPlanMember(res.data.memberships[0]._id);
                }
            }
        } catch (err) {
            console.error("Error fetching memberships:", err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:4000/members/member-detail/${id}`, { withCredentials: true });
            if (res.data && res.data.member) {
                setData(res.data.member);
                setStatus(res.data.member.status);
            }
        } catch (err) {
            console.error("Error fetching member details:", err);
            toast.error("Failed to load member profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchBtn = async () => {
        const nextStatus = status === "Active" ? "Inactive" : "Active";
        try {
            await axios.post(`http://localhost:4000/members/change-status/${id}`, { status: nextStatus }, { withCredentials: true });
            setStatus(nextStatus);
            toast.success(`Member status updated to ${nextStatus}`);
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Failed to update status");
        }
    };

    const isDateInPast = (inputDate) => {
        if (!inputDate) return false;
        return new Date(inputDate) < new Date();
    };

    const handleOnChangeSelect = (event) => {
        setPlanMember(event.target.value);
    };

    const handleRenewSaveBtn = async () => {
        if (!planMember) {
            toast.warn("Please select a membership plan");
            return;
        }

        try {
            const res = await axios.put(`http://localhost:4000/members/update-member-plan/${id}`, { membership: planMember }, { withCredentials: true });
            toast.success("Membership renewed successfully!");
            if (res.data && res.data.member) {
                setData(res.data.member);
                setStatus("Active");
                setRenew(false);
            }
        } catch (err) {
            console.error("Error renewing plan:", err);
            toast.error("Failed to renew membership");
        }
    };

    if (loading) {
        return (
            <div className='w-full md:w-3/4 p-10 flex justify-center items-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
                    <p className='text-gray-500'>Loading member profile...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className='w-full md:w-3/4 p-8'>
                <div onClick={() => navigate(-1)} className='inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-slate-800'>
                    <ArrowBackIcon fontSize="small" /> Go Back
                </div>
                <div className='mt-8 text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm'>
                    Member record not found.
                </div>
            </div>
        );
    }

    const joinDateFormatted = data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-GB') : 'N/A';
    const nextBillFormatted = data.nextBillDate ? new Date(data.nextBillDate).toLocaleDateString('en-GB') : 'N/A';
    const lastPaymentFormatted = data.lastPayment ? new Date(data.lastPayment).toLocaleDateString('en-GB') : joinDateFormatted;

    return (
        <div className='w-full md:w-3/4 text-black p-6 bg-slate-50 min-h-screen'>
            <div
                onClick={() => navigate(-1)}
                className='inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all shadow-sm'
            >
                <ArrowBackIcon fontSize="small" /> Go Back
            </div>

            <div className='mt-6 bg-white rounded-2xl shadow-md border border-slate-100 p-8'>
                <div className='flex flex-col md:flex-row gap-8 items-start'>
                    {/* Left: Avatar & Quick Info */}
                    <div className='w-full md:w-1/3 flex flex-col items-center bg-slate-50 p-6 rounded-xl border border-slate-200'>
                        <img
                            src={data.profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"}
                            className='w-40 h-40 rounded-full object-cover border-4 border-white shadow-md'
                            alt={data.name}
                        />
                        <h2 className='mt-4 text-2xl font-bold text-slate-800 text-center'>{data.name}</h2>
                        <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {status}
                        </span>

                        <div className='mt-6 w-full flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200'>
                            <span className='font-medium text-sm text-gray-600'>Status Toggle</span>
                            <Switch
                                onColor='#6366F1'
                                checked={status === "Active"}
                                onChange={handleSwitchBtn}
                            />
                        </div>
                    </div>

                    {/* Right: Details & Actions */}
                    <div className='w-full md:w-2/3 flex flex-col justify-between'>
                        <div>
                            <h3 className='text-lg font-bold text-slate-900 border-b pb-2 mb-4'>Member Details</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                                    <PhoneIcon className='text-indigo-600' />
                                    <div>
                                        <p className='text-xs text-gray-500 font-medium'>Phone Number</p>
                                        <p className='text-base font-semibold text-slate-800'>{data.mobileNo || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                                    <HomeIcon className='text-indigo-600' />
                                    <div>
                                        <p className='text-xs text-gray-500 font-medium'>Address</p>
                                        <p className='text-base font-semibold text-slate-800'>{data.address || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                                    <FitnessCenterIcon className='text-indigo-600' />
                                    <div>
                                        <p className='text-xs text-gray-500 font-medium'>Current Plan</p>
                                        <p className='text-base font-semibold text-slate-800'>
                                            {data.membership?.months ? `${data.membership.months} Months (₹${data.membership.price})` : 'Standard'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                                    <CalendarMonthIcon className='text-indigo-600' />
                                    <div>
                                        <p className='text-xs text-gray-500 font-medium'>Joined Date</p>
                                        <p className='text-base font-semibold text-slate-800'>{joinDateFormatted}</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg'>
                                    <PaymentIcon className='text-indigo-600' />
                                    <div>
                                        <p className='text-xs text-gray-500 font-medium'>Last Payment</p>
                                        <p className='text-base font-semibold text-slate-800'>{lastPaymentFormatted}</p>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-3 p-3 rounded-lg ${isDateInPast(data.nextBillDate) ? 'bg-red-50 border border-red-200' : 'bg-slate-50'}`}>
                                    <CalendarMonthIcon className={isDateInPast(data.nextBillDate) ? 'text-red-600' : 'text-indigo-600'} />
                                    <div>
                                        <p className='text-xs text-gray-500 font-medium'>Next Bill Date</p>
                                        <p className={`text-base font-semibold ${isDateInPast(data.nextBillDate) ? 'text-red-700' : 'text-slate-800'}`}>
                                            {nextBillFormatted} {isDateInPast(data.nextBillDate) ? '(Expired)' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Renewal Section */}
                        <div className='mt-8 pt-6 border-t border-slate-200'>
                            <button
                                onClick={() => setRenew(prev => !prev)}
                                className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm ${
                                    renew
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-95'
                                }`}
                            >
                                {renew ? 'Cancel Renewal' : 'Renew / Extend Membership'}
                            </button>

                            {renew && (
                                <div className='mt-4 p-5 bg-indigo-50 rounded-xl border border-indigo-200 flex flex-col md:flex-row gap-4 items-center'>
                                    <div className='w-full md:w-2/3'>
                                        <label className='block text-xs font-semibold text-indigo-900 mb-1'>Select Renewal Plan</label>
                                        <select
                                            value={planMember}
                                            onChange={handleOnChangeSelect}
                                            className='w-full p-2.5 bg-white border border-indigo-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        >
                                            {membership.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.months} Months Membership — ₹{item.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleRenewSaveBtn}
                                        className='w-full md:w-1/3 mt-auto py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow'
                                    >
                                        Confirm & Renew
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MemberDetail;
