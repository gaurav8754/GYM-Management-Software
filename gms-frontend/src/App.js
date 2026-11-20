import './App.css';
import Sidebar from './Components/Sidebar/sidebar';
import Dashboard from './Pages/Dashboard/dashboard';
import Home from './Pages/Home/home';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Member from './Pages/Member/member';
import GeneralUser from './Pages/GeneralUser/generalUser';
import MemberDetail from './Pages/MemberDetail/memberDetail';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLogin") === "true";
    setIsLogin(logged);
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      {/* Sidebar only renders on administrative routes when logged in */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/dashboard'
          element={
            <div className='flex w-full min-h-screen'>
              <Sidebar />
              <Dashboard />
            </div>
          }
        />
        <Route
          path='/member'
          element={
            <div className='flex w-full min-h-screen'>
              <Sidebar />
              <Member />
            </div>
          }
        />
        <Route
          path='/specific/:page'
          element={
            <div className='flex w-full min-h-screen'>
              <Sidebar />
              <GeneralUser />
            </div>
          }
        />
        <Route
          path='/member/:id'
          element={
            <div className='flex w-full min-h-screen'>
              <Sidebar />
              <MemberDetail />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
