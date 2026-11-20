import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link } from 'react-router-dom';

const MemberCard = ({ item }) => {
    const formattedDate = item?.nextBillDate
        ? new Date(item.nextBillDate).toLocaleDateString('en-GB')
        : 'N/A';

    const isExpired = item?.nextBillDate && new Date(item.nextBillDate) < new Date();
    const statusColor = item?.status === "Active" && !isExpired ? "#22c55e" : "#ef4444";

    return (
        <Link
            to={`/member/${item?._id}`}
            className='bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-400 group flex flex-col justify-between'
        >
            <div>
                <div className='w-24 h-24 relative mx-auto mb-4'>
                    <img
                        className='w-full h-full object-cover rounded-full border-2 border-slate-200 group-hover:border-indigo-500 transition-colors'
                        src={item?.profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"}
                        alt={item?.name || 'Member'}
                    />
                    <CircleIcon
                        className='absolute top-0 right-0'
                        sx={{ color: statusColor, fontSize: 18, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
                    />
                </div>

                <h3 className='text-xl font-bold text-center text-slate-800 group-hover:text-indigo-600 transition-colors'>
                    {item?.name}
                </h3>

                <div className='flex items-center justify-center gap-1.5 text-sm text-gray-500 mt-1'>
                    <PhoneIcon sx={{ fontSize: 16 }} />
                    <span>{item?.mobileNo || 'No phone'}</span>
                </div>

                {item?.membership && (
                    <div className='flex items-center justify-center gap-1.5 text-xs text-indigo-700 font-semibold bg-indigo-50 py-1 px-2.5 rounded-full mt-3 w-fit mx-auto'>
                        <FitnessCenterIcon sx={{ fontSize: 14 }} />
                        <span>{item.membership.months ? `${item.membership.months} Months Plan` : 'Custom Plan'}</span>
                    </div>
                )}
            </div>

            <div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600'>
                <span className='flex items-center gap-1 font-medium'>
                    <CalendarMonthIcon sx={{ fontSize: 14, color: '#6366f1' }} /> Next Bill:
                </span>
                <span className={`font-semibold ${isExpired ? 'text-red-600' : 'text-slate-800'}`}>
                    {formattedDate} {isExpired ? '(Expired)' : ''}
                </span>
            </div>
        </Link>
    );
};

export default MemberCard;
