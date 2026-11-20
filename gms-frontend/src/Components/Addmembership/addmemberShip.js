import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { API_BASE_URL } from '../../config';

const AddmemberShip = ({ handleClose }) => {
    const [inputField, setInputField] = useState({ months: "", price: "" });
    const [membership, setMembership] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    const fetchMembership = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/plans/get-membership`, { withCredentials: true });
            if (res.data && res.data.memberships) {
                setMembership(res.data.memberships);
            }
        } catch (err) {
            console.error("Error fetching memberships:", err);
            toast.error("Failed to load membership plans");
        }
    };

    useEffect(() => {
        fetchMembership();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddmembership = async () => {
        if (!inputField.months || !inputField.price) {
            toast.warn("Please enter both months and price");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/plans/add-membership`, inputField, { withCredentials: true });
            toast.success(res.data.message || "Membership plan saved!");
            setInputField({ months: "", price: "" });
            fetchMembership();
        } catch (err) {
            console.error("Error adding membership:", err);
            const errMsg = err.response?.data?.error || "Failed to add membership plan";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='text-black p-2'>
            <h4 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-3'>Existing Membership Plans</h4>

            <div className='flex flex-wrap gap-3 items-center justify-start min-h-[60px] max-h-48 overflow-y-auto p-1'>
                {membership.length === 0 ? (
                    <p className='text-sm text-gray-400 italic'>No plans configured yet. Create your first plan below.</p>
                ) : (
                    membership.map((plan) => (
                        <div
                            key={plan._id}
                            className='flex items-center gap-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-4 py-2.5 rounded-xl shadow-sm'
                        >
                            <FitnessCenterIcon sx={{ fontSize: 18, color: '#a5b4fc' }} />
                            <div>
                                <div className='font-bold text-sm'>{plan.months} {plan.months === 1 ? 'Month' : 'Months'}</div>
                                <div className='text-xs text-indigo-300 font-semibold'>₹{plan.price}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <hr className='my-5 border-slate-200' />

            <h4 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-3'>Add or Update Plan</h4>
            <div className='flex flex-col sm:flex-row gap-3'>
                <div className='flex-1'>
                    <label className='block text-xs font-semibold text-slate-600 mb-1'>Duration (Months)</label>
                    <input
                        value={inputField.months}
                        onChange={(e) => handleOnChange(e, "months")}
                        className='border border-slate-300 rounded-lg text-sm w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        type='number'
                        min="1"
                        placeholder="e.g. 1, 3, 6, 12"
                    />
                </div>

                <div className='flex-1'>
                    <label className='block text-xs font-semibold text-slate-600 mb-1'>Price (₹)</label>
                    <input
                        value={inputField.price}
                        onChange={(e) => handleOnChange(e, "price")}
                        className='border border-slate-300 rounded-lg text-sm w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        type='number'
                        min="0"
                        placeholder="e.g. 1500"
                    />
                </div>

                <div className='flex items-end'>
                    <button
                        disabled={loading}
                        onClick={handleAddmembership}
                        className='w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow disabled:opacity-50'
                    >
                        {loading ? "Saving..." : "+ Save Plan"}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddmemberShip;
