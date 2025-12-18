import { LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ClientNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
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
    <div className="w-full bg-linear-to-r from-indigo-600 to-blue-600 shadow-lg ">
      <div className="max-w-ful mx-auto px-6 md:px-12 py-4 flex justify-between items-center">

        {/* Brand */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Atlas CRM
        </h1>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/90 border border-red-500/70  hover:bg-red-500 text-white transition text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium text-white"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}

export default ClientNavBar;
