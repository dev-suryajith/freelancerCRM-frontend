import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FreelancerNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
const navigate=useNavigate()
  const handleLogout = () => {
    sessionStorage.removeItem("loggedUserDetails")
    sessionStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate('/login')
  }

  useEffect(() => {
    const user = sessionStorage.getItem("loggedUserDetails");
    setIsLoggedIn(!!user);
  }, []);
  return (
    <div className="w-full bg-linear-to-r from-indigo-950 to-blue-950 shadow-lg ">
      <div className="max-w-ful mx-auto px-6 md:px-12 py-4 flex justify-between items-center">

        {/* Brand */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Atlas CRM
        </h1>

        {/* Actions */}
        {isLoggedIn ?
          <button onClick={handleLogout} className="px-5 py-2 bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-md hover:bg-white/30 transition duration-300">Logout</button>
          :
          <Link to={'/login'} className="px-5 py-2 bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-md hover:bg-white/30 transition duration-300">Login</Link>
        }

      </div>
    </div>
  );
}

export default FreelancerNavBar;
