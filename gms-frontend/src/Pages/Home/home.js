import React, { useState } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';
import Login from '../../Components/Login/login';
import SignUp from '../../Components/Signup/signUp';
import Modal from '../../Components/Modal/modal';
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
    const [authModal, setAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
    const [trialForm, setTrialForm] = useState({ name: "", phone: "", goal: "Strength" });
    const isLogin = localStorage.getItem("isLogin") === "true";
    const gymName = localStorage.getItem("gymName") || "IRON FORGE";

    const handleTrialSubmit = (e) => {
        e.preventDefault();
        if (!trialForm.name || !trialForm.phone) {
            toast.warn("Please enter your name and phone number");
            return;
        }
        toast.success(`🎉 Free 1-Day Pass Confirmed for ${trialForm.name}! Our team will contact you at ${trialForm.phone}.`);
        setTrialForm({ name: "", phone: "", goal: "Strength" });
    };

    return (
        <div className='w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white'>
            {/* Top Navigation */}
            <header className='sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80'>
                <div className='max-w-7xl mx-auto px-6 h-20 flex justify-between items-center'>
                    <a href='#home' className='flex items-center gap-3'>
                        <div className='w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25'>
                            <FitnessCenterIcon fontSize="medium" />
                        </div>
                        <div>
                            <span className='text-2xl font-black tracking-wider text-white'>
                                {gymName.toUpperCase()}
                            </span>
                            <span className='block text-[10px] uppercase font-bold tracking-widest text-indigo-400'>
                                Elite Training Center
                            </span>
                        </div>
                    </a>

                    <nav className='hidden md:flex items-center gap-8 text-sm font-medium text-slate-300'>
                        <a href='#home' className='hover:text-white transition'>Home</a>
                        <a href='#programs' className='hover:text-white transition'>Programs</a>
                        <a href='#plans' className='hover:text-white transition'>Memberships</a>
                        <a href='#amenities' className='hover:text-white transition'>Facilities</a>
                        <a href='#trainers' className='hover:text-white transition'>Coaches</a>
                        <a href='#trial' className='hover:text-white transition'>Free Pass</a>
                    </nav>

                    <div className='flex items-center gap-4'>
                        {isLogin ? (
                            <Link
                                to='/dashboard'
                                className='px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition transform active:scale-95'
                            >
                                <DashboardIcon fontSize="small" /> Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={() => { setAuthMode("login"); setAuthModal(true); }}
                                className='px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition transform active:scale-95'
                            >
                                <LoginIcon fontSize="small" /> Gym Portal Login
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id='home' className='relative min-h-[85vh] flex items-center justify-center overflow-hidden'>
                <div
                    className='absolute inset-0 bg-cover bg-center filter brightness-[0.25]'
                    style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop")`
                    }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80' />

                <div className='relative z-10 max-w-5xl mx-auto px-6 text-center py-20'>
                    <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs uppercase tracking-widest font-bold mb-6'>
                        <BoltIcon fontSize="small" className='text-yellow-400' /> Unleash Your Inner Beast
                    </div>

                    <h1 className='text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight'>
                        Build Your <span className='bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent'>Strongest</span> Self
                    </h1>

                    <p className='mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed'>
                        World-class biomechanics equipment, Olympic lifting platforms, tailored nutrition coaching, and high-energy community designed to sculpt your body.
                    </p>

                    <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center'>
                        <a
                            href='#trial'
                            className='w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-500/25 transition transform hover:-translate-y-0.5'
                        >
                            Claim Free 1-Day Trial Pass
                        </a>
                        <a
                            href='#plans'
                            className='w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base rounded-2xl transition'
                        >
                            Explore Memberships
                        </a>
                    </div>

                    {/* Stats Counter */}
                    <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-slate-800/80'>
                        <div>
                            <div className='text-3xl sm:text-4xl font-black text-white'>2,500+</div>
                            <div className='text-xs uppercase text-slate-400 mt-1 font-semibold'>Active Members</div>
                        </div>
                        <div>
                            <div className='text-3xl sm:text-4xl font-black text-indigo-400'>120+</div>
                            <div className='text-xs uppercase text-slate-400 mt-1 font-semibold'>Modern Machines</div>
                        </div>
                        <div>
                            <div className='text-3xl sm:text-4xl font-black text-purple-400'>25+</div>
                            <div className='text-xs uppercase text-slate-400 mt-1 font-semibold'>Certified Coaches</div>
                        </div>
                        <div>
                            <div className='text-3xl sm:text-4xl font-black text-pink-400'>24/7</div>
                            <div className='text-xs uppercase text-slate-400 mt-1 font-semibold'>Member Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Programs Section */}
            <section id='programs' className='py-24 bg-slate-900 border-t border-slate-800'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='text-center max-w-2xl mx-auto mb-16'>
                        <span className='text-xs font-bold uppercase tracking-widest text-indigo-400'>Training Disciplines</span>
                        <h2 className='text-3xl sm:text-4xl font-black uppercase text-white mt-2'>Engineered For Performance</h2>
                        <p className='text-sm text-slate-400 mt-3'>Whatever your fitness ambition, our specialized zones and certified programming deliver real, measurable transformations.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {[
                            {
                                title: "Strength & Powerlifting",
                                desc: "Olympic weightlifting platforms, calibrated competition plates, power racks, and hypertrophy machinery.",
                                img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
                                tag: "Muscle & Power"
                            },
                            {
                                title: "CrossFit & High Intensity",
                                desc: "Dynamic kettlebells, rowing ergs, assault bikes, plyo boxes, and timed circuit tracks for explosive endurance.",
                                img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
                                tag: "Cardio & Fat Loss"
                            },
                            {
                                title: "Combat & Boxing Zone",
                                desc: "Full-size boxing ring, heavy teardrop bags, speedballs, and combat footwork conditioning drills.",
                                img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop",
                                tag: "Agility & Grit"
                            },
                            {
                                title: "Yoga & Deep Mobility",
                                desc: "Restorative hot yoga, myofascial release, joint mobility routines, and guided breathing for injury prevention.",
                                img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
                                tag: "Flexibility & Mind"
                            },
                            {
                                title: "1-on-1 Personal Coaching",
                                desc: "Customized biomechanics analysis, macro-nutrient calculations, and dedicated accountability with master coaches.",
                                img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
                                tag: "Tailored Results"
                            },
                            {
                                title: "Cardio Cinema & Endurance",
                                desc: "Curved motorless treadmills, stairmasters, ski ergs, and heart rate telemetry monitors.",
                                img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&auto=format&fit=crop",
                                tag: "Stamina & Heart"
                            }
                        ].map((prog, i) => (
                            <div key={i} className='bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg'>
                                <div className='h-52 overflow-hidden relative'>
                                    <img src={prog.img} alt={prog.title} className='w-full h-full object-cover group-hover:scale-110 transition duration-500' />
                                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent' />
                                    <span className='absolute bottom-3 left-4 text-xs font-bold uppercase tracking-wider bg-indigo-600 px-3 py-1 rounded-full text-white'>
                                        {prog.tag}
                                    </span>
                                </div>
                                <div className='p-6'>
                                    <h3 className='text-xl font-bold text-white group-hover:text-indigo-400 transition-colors'>{prog.title}</h3>
                                    <p className='text-xs text-slate-400 mt-2 leading-relaxed'>{prog.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership Pricing Plans */}
            <section id='plans' className='py-24 bg-slate-950'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='text-center max-w-2xl mx-auto mb-16'>
                        <span className='text-xs font-bold uppercase tracking-widest text-indigo-400'>Pricing Options</span>
                        <h2 className='text-3xl sm:text-4xl font-black uppercase text-white mt-2'>Transparent Membership Plans</h2>
                        <p className='text-sm text-slate-400 mt-3'>No lock-in hidden contracts. Choose the tier that matches your commitment level.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                        {[
                            {
                                months: "1 Month",
                                title: "Starter Pass",
                                price: "₹1,499",
                                popular: false,
                                perks: ["Full gym floor access", "Locker & Shower access", "Free WiFi & Water bar", "Equipment orientation"]
                            },
                            {
                                months: "3 Months",
                                title: "Pro Athlete",
                                price: "₹3,999",
                                popular: true,
                                perks: ["All Starter perks", "2 1-on-1 PT Sessions", "Sauna & Steam room", "Diet & Macro guidance", "Free gym shaker bottle"]
                            },
                            {
                                months: "6 Months",
                                title: "Beast Mode",
                                price: "₹6,999",
                                popular: false,
                                perks: ["All Pro perks", "Unlimited Sauna access", "Monthly InBody scan", "2 Guest passes / month", "Official gym hoodie"]
                            },
                            {
                                months: "12 Months",
                                title: "VIP Annual",
                                price: "₹11,999",
                                popular: false,
                                perks: ["All Beast Mode perks", "Priority coach booking", "Free towel service", "Unlimited Guest passes", "Recovery ice bath access"]
                            }
                        ].map((plan, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all duration-300 ${
                                    plan.popular
                                        ? 'bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-3'
                                        : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                {plan.popular && (
                                    <span className='absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md'>
                                        Most Popular
                                    </span>
                                )}

                                <div>
                                    <div className='text-xs uppercase font-bold text-indigo-400 tracking-wider'>{plan.months}</div>
                                    <h3 className='text-2xl font-bold text-white mt-1'>{plan.title}</h3>
                                    <div className='mt-4 flex items-baseline gap-1'>
                                        <span className='text-3xl sm:text-4xl font-black text-white'>{plan.price}</span>
                                        <span className='text-xs text-slate-400'>/ duration</span>
                                    </div>

                                    <ul className='mt-6 space-y-3 text-xs text-slate-300'>
                                        {plan.perks.map((p, idx) => (
                                            <li key={idx} className='flex items-center gap-2'>
                                                <CheckCircleOutlineIcon fontSize="small" className='text-indigo-400' />
                                                <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => { setAuthMode("signup"); setAuthModal(true); }}
                                    className={`w-full py-3 mt-8 rounded-xl text-xs uppercase font-bold tracking-wider transition ${
                                        plan.popular
                                            ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg hover:opacity-95'
                                            : 'bg-slate-800 text-white hover:bg-indigo-600'
                                    }`}
                                >
                                    Select Plan
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* World-Class Amenities */}
            <section id='amenities' className='py-24 bg-slate-900 border-t border-slate-800'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='text-center max-w-2xl mx-auto mb-16'>
                        <span className='text-xs font-bold uppercase tracking-widest text-indigo-400'>Why We Are #1</span>
                        <h2 className='text-3xl sm:text-4xl font-black uppercase text-white mt-2'>Premium Amenities</h2>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
                        {[
                            { title: "24/7 RFID Access", desc: "Train on your schedule anytime day or night.", icon: <AccessTimeIcon fontSize="large" className="text-indigo-400" /> },
                            { title: "Steam & Ice Bath", desc: "High recovery thermotherapy & muscle soothing.", icon: <VerifiedIcon fontSize="large" className="text-purple-400" /> },
                            { title: "Protein Smoothie Bar", desc: "Post-workout isolates, branched amino acids & coffee.", icon: <BoltIcon fontSize="large" className="text-pink-400" /> },
                            { title: "Secure Lockers & Valet", desc: "Private showers, lockers, and monitored parking.", icon: <FitnessCenterIcon fontSize="large" className="text-yellow-400" /> }
                        ].map((item, i) => (
                            <div key={i} className='bg-slate-950 p-6 rounded-2xl border border-slate-800'>
                                <div className='mb-3 flex justify-center'>{item.icon}</div>
                                <h4 className='font-bold text-white text-base'>{item.title}</h4>
                                <p className='text-xs text-slate-400 mt-1'>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coaches */}
            <section id='trainers' className='py-24 bg-slate-950'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='text-center max-w-2xl mx-auto mb-16'>
                        <span className='text-xs font-bold uppercase tracking-widest text-indigo-400'>Certified Experts</span>
                        <h2 className='text-3xl sm:text-4xl font-black uppercase text-white mt-2'>Meet Head Coaches</h2>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                        {[
                            { name: "Marcus Vance", role: "Head of Strength & Powerlifting", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop" },
                            { name: "Sarah Jenkins", role: "HIIT & Olympic Cross-Training", img: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=400&auto=format&fit=crop" },
                            { name: "David Chen", role: "Combat Conditioning & Boxing", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop" },
                            { name: "Elena Rostova", role: "Mobility, Posture & Yoga Guru", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop" }
                        ].map((coach, i) => (
                            <div key={i} className='bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-center group'>
                                <div className='h-72 overflow-hidden'>
                                    <img src={coach.img} alt={coach.name} className='w-full h-full object-cover group-hover:scale-105 transition duration-300' />
                                </div>
                                <div className='p-4'>
                                    <h4 className='text-lg font-bold text-white'>{coach.name}</h4>
                                    <p className='text-xs text-indigo-400 font-semibold mt-1'>{coach.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trial Registration & Contact */}
            <section id='trial' className='py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800'>
                <div className='max-w-4xl mx-auto px-6'>
                    <div className='bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden'>
                        <div className='absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl'></div>

                        <div className='text-center max-w-xl mx-auto mb-8'>
                            <span className='text-xs font-bold uppercase tracking-widest text-indigo-400'>Zero Risk Commitment</span>
                            <h2 className='text-3xl sm:text-4xl font-black uppercase text-white mt-2'>Claim Your Free 1-Day Pass</h2>
                            <p className='text-xs sm:text-sm text-slate-300 mt-2'>Experience the facility, test the equipment, and meet our coaches completely free.</p>
                        </div>

                        <form onSubmit={handleTrialSubmit} className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                            <input
                                type='text'
                                value={trialForm.name}
                                onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                                placeholder='Your Full Name *'
                                className='px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-indigo-500'
                            />
                            <input
                                type='tel'
                                value={trialForm.phone}
                                onChange={(e) => setTrialForm({ ...trialForm, phone: e.target.value })}
                                placeholder='Mobile Number *'
                                className='px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-indigo-500'
                            />
                            <button
                                type='submit'
                                className='px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-lg transition active:scale-95'
                            >
                                Get Instant Pass
                            </button>
                        </form>

                        <div className='mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 text-center sm:text-left'>
                            <div className='flex items-center gap-2 justify-center sm:justify-start'>
                                <LocationOnIcon fontSize="small" className='text-indigo-400' />
                                <span>742 Fitness Avenue, Suite 100</span>
                            </div>
                            <div className='flex items-center gap-2 justify-center sm:justify-start'>
                                <PhoneIcon fontSize="small" className='text-indigo-400' />
                                <span>+1 (800) 555-IRON</span>
                            </div>
                            <div className='flex items-center gap-2 justify-center sm:justify-start'>
                                <EmailIcon fontSize="small" className='text-indigo-400' />
                                <span>support@ironforgegym.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className='py-12 bg-slate-950 border-t border-slate-900 text-slate-500 text-xs text-center'>
                <div className='max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <div className='flex items-center gap-2 text-white font-bold text-sm'>
                        <FitnessCenterIcon fontSize="small" className='text-indigo-500' />
                        <span>{gymName.toUpperCase()} &copy; 2026. All rights reserved.</span>
                    </div>
                    <div className='flex gap-6'>
                        <a href='#home' className='hover:text-white transition'>Privacy Policy</a>
                        <a href='#home' className='hover:text-white transition'>Terms of Service</a>
                        <button
                            onClick={() => { setAuthMode("login"); setAuthModal(true); }}
                            className='text-indigo-400 font-semibold hover:underline'
                        >
                            Gym Admin Login
                        </button>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            {authModal && (
                <Modal
                    header={authMode === "login" ? "Gym Administration Login" : "Register Your Gym"}
                    handleClose={() => setAuthModal(false)}
                    content={
                        authMode === "login" ? (
                            <Login
                                onSwitchToSignup={() => setAuthMode("signup")}
                                onForgotPassword={() => {}}
                            />
                        ) : (
                            <SignUp onSwitchToLogin={() => setAuthMode("login")} />
                        )
                    }
                />
            )}

            <ToastContainer />
        </div>
    );
};

export default Home;
