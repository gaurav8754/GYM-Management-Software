import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../../config';

const AVATAR_PRESETS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=250&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=250&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop"
];

const Addmembers = () => {
    const today = new Date().toISOString().split('T')[0];
    const [inputField, setInputField] = useState({
        name: "",
        mobileNo: "",
        address: "",
        membership: "",
        profilePic: AVATAR_PRESETS[0],
        joiningDate: today
    });
    const [membershipList, setMembershipList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    const fetchMembership = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/plans/get-membership`, { withCredentials: true });
            if (res.data && res.data.memberships) {
                setMembershipList(res.data.memberships);
                if (res.data.memberships.length > 0) {
                    setInputField(prev => ({ ...prev, membership: res.data.memberships[0]._id }));
                }
            }
        } catch (err) {
            console.error("Error fetching memberships:", err);
            toast.error("Could not fetch membership plans");
        }
    };

    useEffect(() => {
        fetchMembership();
    }, []);

    const handleRegisterButton = async () => {
        if (!inputField.name.trim() || !inputField.mobileNo.trim()) {
            toast.warn("Please enter Member Name and Mobile Number");
            return;
        }

        if (!inputField.membership) {
            toast.warn("Please create and select a Membership plan first");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/members/register-member`, inputField, { withCredentials: true });
            toast.success(res.data.message || "Member registered successfully!");
            // Reset form
            setInputField({
                name: "",
                mobileNo: "",
                address: "",
                membership: membershipList[0]?._id || "",
                profilePic: AVATAR_PRESETS[0],
                joiningDate: today
            });
        } catch (err) {
            console.error("Error registering member:", err);
            const errMsg = err.response?.data?.error || "Registration failed";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='text-black p-2'>
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2 text-sm'>
                <div>
                    <label className='block font-semibold text-slate-700 mb-1'>Full Name *</label>
                    <input
                        value={inputField.name}
                        onChange={(e) => handleOnChange(e, "name")}
                        placeholder='e.g. John Doe'
                        type='text'
                        className='border border-slate-300 w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>

                <div>
                    <label className='block font-semibold text-slate-700 mb-1'>Mobile Number *</label>
                    <input
                        value={inputField.mobileNo}
                        onChange={(e) => handleOnChange(e, "mobileNo")}
                        placeholder='e.g. 9876543210'
                        type='tel'
                        className='border border-slate-300 w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>

                <div>
                    <label className='block font-semibold text-slate-700 mb-1'>Address</label>
                    <input
                        value={inputField.address}
                        onChange={(e) => handleOnChange(e, "address")}
                        placeholder='e.g. Flat 4B, Downtown'
                        type='text'
                        className='border border-slate-300 w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>

                <div>
                    <label className='block font-semibold text-slate-700 mb-1'>Joining Date</label>
                    <input
                        value={inputField.joiningDate}
                        onChange={(e) => handleOnChange(e, "joiningDate")}
                        type='date'
                        className='border border-slate-300 w-full px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>

                <div className='md:col-span-2'>
                    <label className='block font-semibold text-slate-700 mb-1'>Membership Plan *</label>
                    {membershipList.length === 0 ? (
                        <p className='text-red-500 text-xs'>No membership plans available yet. Please add a plan first via the Membership button.</p>
                    ) : (
                        <select
                            value={inputField.membership}
                            onChange={(e) => handleOnChange(e, "membership")}
                            className='border border-slate-300 w-full px-3 py-2.5 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        >
                            {membershipList.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.months} Months Membership — ₹{item.price}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Avatar Selection */}
                <div className='md:col-span-2'>
                    <label className='block font-semibold text-slate-700 mb-2'>Select Profile Avatar or Image URL</label>
                    <div className='flex gap-3 mb-3'>
                        {AVATAR_PRESETS.map((url, i) => (
                            <img
                                key={i}
                                src={url}
                                alt={`Preset ${i}`}
                                onClick={() => setInputField({ ...inputField, profilePic: url })}
                                className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                                    inputField.profilePic === url ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                                }`}
                            />
                        ))}
                    </div>
                    <input
                        type='text'
                        value={inputField.profilePic}
                        onChange={(e) => handleOnChange(e, "profilePic")}
                        placeholder='Or paste custom image URL'
                        className='border border-slate-300 w-full px-3 py-2 rounded-lg text-xs'
                    />
                </div>
            </div>

            <div className='mt-6 flex justify-end'>
                <button
                    disabled={loading}
                    onClick={handleRegisterButton}
                    className='px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all shadow-md disabled:opacity-50'
                >
                    {loading ? "Registering..." : "Register Member"}
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Addmembers;
