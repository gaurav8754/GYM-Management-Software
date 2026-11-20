import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import MemberCard from '../../Components/MemberCard/memberCard';
import { getMonthlyJoined, threeDayExpire, fourToSevenDaysExpire, expired, inActiveMembers } from './data';

const GeneralUser = () => {
    const [header, setHeader] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const func = sessionStorage.getItem('func');
        functionCall(func);
    }, []);

    const functionCall = async (func) => {
        setLoading(true);
        let result = { members: [] };

        switch (func) {
            case "monthlyJoined":
                setHeader("Monthly Joined Members");
                result = await getMonthlyJoined();
                break;

            case "threeDayExpire":
                setHeader("Expiring In 3 Days Members");
                result = await threeDayExpire();
                break;

            case "fourToSevenDaysExpire":
                setHeader("Expiring In 4-7 Days Members");
                result = await fourToSevenDaysExpire();
                break;

            case "expired":
                setHeader("Expired Members");
                result = await expired();
                break;

            case "inActiveMembers":
                setHeader("Inactive Members");
                result = await inActiveMembers();
                break;

            default:
                setHeader("Filtered Members");
                result = await getMonthlyJoined();
                break;
        }

        setData(result.members || []);
        setLoading(false);
    };

    return (
        <div className='text-black p-5 w-full md:w-3/4 flex-col min-h-screen bg-slate-50'>
            <div className='border-2 bg-slate-900 flex justify-between items-center w-full text-white rounded-lg p-3 shadow-md'>
                <Link to={'/dashboard'} className='border-2 px-4 py-1.5 rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white transition-all flex items-center gap-2'>
                    <ArrowBackIcon fontSize="small" /> Back To Dashboard
                </Link>
                <div className='text-sm text-gray-300'>
                    Total: <span className='font-bold text-white'>{data.length}</span> Members
                </div>
            </div>

            <div className='mt-6 mb-4 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-slate-800 tracking-tight'>
                    {header}
                </h2>
                <span className='text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold'>
                    {data.length} {data.length === 1 ? 'Record' : 'Records'}
                </span>
            </div>

            {loading ? (
                <div className='flex justify-center items-center py-20 text-gray-500'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mr-3'></div>
                    <span>Loading members...</span>
                </div>
            ) : data.length === 0 ? (
                <div className='text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm'>
                    <p className='text-xl text-gray-500 font-medium'>No members found in this category.</p>
                    <p className='text-sm text-gray-400 mt-1'>Check back later or add new members.</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
                    {data.map((item, index) => (
                        <MemberCard key={item._id || index} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GeneralUser;
