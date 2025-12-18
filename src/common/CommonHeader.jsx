import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function CommonHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    const user = localStorage.getItem("loggedUserDetails");
    setIsLoggedIn(!!user);
  }, []);
  return (
    <div className="w-full bg-linear-to-r from-[#1E293B] to-[#26344b] shadow-lg ">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">

        {/* Brand */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Atlas CRM
        </h1>

        {/* Actions */}
        <Link to={isLoggedIn ? '/login' : '/login'} className="px-5 py-2 bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-md hover:bg-white/30 transition duration-300">
          {isLoggedIn ? 'Logout' : 'Login'}
        </Link>

      </div>
    </div>
  );
}

export default CommonHeader;
