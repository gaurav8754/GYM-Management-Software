import React, { useState, useEffect } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Modal from '../../Components/Modal/modal';
import MemberCard from '../../Components/MemberCard/memberCard';
import AddmemberShip from '../../Components/Addmembership/addmemberShip';
import Addmembers from '../../Components/Addmembers/addmembers';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Member = () => {
    const [addMembership, setAddmemberShip] = useState(false);
    const [addMember, setAddmember] = useState(false);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const [isSearchModeOn, setIsSearchModeOn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 9;

    const noOfPage = Math.ceil(totalData / limit) || 1;
    const startFrom = (currentPage - 1) * limit;
    const endTo = Math.min(currentPage * limit, totalData);

    useEffect(() => {
        if (!isSearchModeOn) {
            fetchData(skip, limit);
        }
    }, [skip]);

    const fetchData = async (currentSkip, currentLimit) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:4000/members/all-member?skip=${currentSkip}&limit=${currentLimit}`,
                { withCredentials: true }
            );
            if (response.data) {
                setData(response.data.members || []);
                setTotalData(response.data.totalMembers || 0);
            }
        } catch (err) {
            toast.error("Could not fetch members");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMemberShip = () => {
        setAddmemberShip(prev => !prev);
    };

    const handleMembers = () => {
        setAddmember(prev => !prev);
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            const nextSkip = (currentPage - 2) * limit;
            setSkip(nextSkip);
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < noOfPage) {
            const nextSkip = currentPage * limit;
            setSkip(nextSkip);
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleSearchData = async () => {
        if (!search.trim()) {
            setIsSearchModeOn(false);
            setSkip(0);
            setCurrentPage(1);
            fetchData(0, limit);
            return;
        }

        setLoading(true);
        setIsSearchModeOn(true);
        try {
            const response = await axios.get(
                `http://localhost:4000/members/searched-members?searchTerm=${encodeURIComponent(search.trim())}`,
                { withCredentials: true }
            );
            if (response.data) {
                setData(response.data.members || []);
                setTotalData(response.data.totalMembers || response.data.members?.length || 0);
            }
        } catch (err) {
            console.error("Search error:", err);
            toast.error("Search failed");
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearch("");
        setIsSearchModeOn(false);
        setSkip(0);
        setCurrentPage(1);
        fetchData(0, limit);
    };

    return (
        <div className='flex-1 p-6 md:p-8 bg-slate-50 min-h-screen text-slate-900'>
            {/* Header Action Bar */}
            <div className='border border-slate-800 bg-slate-950 flex flex-wrap justify-between items-center w-full text-white rounded-2xl p-4 shadow-lg gap-3'>
                <Link
                    to={'/dashboard'}
                    className='inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition'
                >
                    <ArrowBackIcon fontSize="small" /> Back to Dashboard
                </Link>

                <div className='flex gap-3'>
                    <button
                        onClick={handleMembers}
                        className='px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2'
                    >
                        <AddIcon fontSize="small" /> Add Member
                    </button>
                    <button
                        onClick={handleMemberShip}
                        className='px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2'
                    >
                        <FitnessCenterIcon fontSize="small" /> Membership Plans
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className='mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center max-w-xl'>
                <div className='relative flex-1'>
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearchData(); }}
                        className='border border-slate-300 w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm'
                        placeholder='Search member by name, mobile, or address...'
                    />
                    {isSearchModeOn && (
                        <button
                            onClick={clearSearch}
                            className='absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-700 font-bold'
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearchData}
                    className='px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition flex items-center justify-center gap-1.5 text-sm font-semibold shadow-sm'
                >
                    <SearchIcon fontSize="small" /> Search
                </button>
            </div>

            {/* Pagination & Status Header */}
            <div className='mt-6 flex justify-between items-center text-sm text-slate-700'>
                <div className='font-semibold'>
                    {isSearchModeOn ? `Search Results: ${totalData} found` : `Total Members: ${totalData}`}
                </div>

                {!isSearchModeOn && totalData > 0 && (
                    <div className='flex items-center gap-3'>
                        <span className='text-xs text-gray-500'>
                            {startFrom + 1} - {endTo} of {totalData}
                        </span>
                        <div className='flex gap-1'>
                            <button
                                disabled={currentPage === 1}
                                onClick={handlePrev}
                                className={`w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center transition ${
                                    currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-gray-100' : 'hover:bg-indigo-600 hover:text-white bg-white'
                                }`}
                            >
                                <ChevronLeftIcon fontSize="small" />
                            </button>
                            <button
                                disabled={currentPage >= noOfPage}
                                onClick={handleNext}
                                className={`w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center transition ${
                                    currentPage >= noOfPage ? 'opacity-40 cursor-not-allowed bg-gray-100' : 'hover:bg-indigo-600 hover:text-white bg-white'
                                }`}
                            >
                                <ChevronRightIcon fontSize="small" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Member Cards Grid */}
            {loading ? (
                <div className='py-20 text-center text-gray-500'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3'></div>
                    <span>Loading members...</span>
                </div>
            ) : data.length === 0 ? (
                <div className='mt-6 p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center shadow-sm'>
                    <FitnessCenterIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                    <h3 className='text-lg font-bold text-slate-700 mt-2'>No Members Found</h3>
                    <p className='text-xs text-gray-400 mt-1'>
                        {isSearchModeOn ? "Try a different search query" : "Click 'Add Member' above to enroll your first gym member."}
                    </p>
                </div>
            ) : (
                <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {data.map((item) => (
                        <MemberCard key={item._id} item={item} />
                    ))}
                </div>
            )}

            {/* Modals */}
            {addMembership && (
                <Modal
                    header="Membership Plans"
                    handleClose={handleMemberShip}
                    content={<AddmemberShip handleClose={handleMemberShip} />}
                />
            )}

            {addMember && (
                <Modal
                    header="Add New Member"
                    handleClose={() => { handleMembers(); fetchData(skip, limit); }}
                    content={<Addmembers />}
                />
            )}

            <ToastContainer />
        </div>
    );
};

export default Member;
