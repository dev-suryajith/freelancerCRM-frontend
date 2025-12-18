import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedUserDetails");
    if (storedUser) {
      setUserDetails(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedUserDetails");
    setUserDetails(null);
    navigate("/login");
  };

  return (
    <header className="w-full bg-blue-700 text-white py-3 px-6 flex items-center justify-between shadow-md">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/logo.png"
          width="65"
          height="65"
          alt="Logo"
          className="rounded-md"
        />
        <span className="font-semibold text-lg tracking-wide">
          Atlas CRM
        </span>
      </Link>

      {/* NAV */}
      <nav className="hidden md:flex items-center gap-6 font-medium">
        <Link to="/" className="hover:text-gray-200">Home</Link>
        <Link to="/about" className="hover:text-gray-200">About</Link>
        <Link to="/contact" className="hover:text-gray-200">Contact</Link>
        <Link to="/pricing" className="hover:text-gray-200">Pricing</Link>

        {/* USER */}
        <div className="relative group">
          {userDetails ? (
            <>
              {/* Username */}
              <div className="cursor-pointer flex items-center border p-2 rounded-xl gap-1">
                <span className="hidden sm:block">
                  Hello, <b>{userDetails.username || userDetails.freelancerName}</b>
                </span>
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 z-50">
                <Link
                  to={`/${userDetails.role}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-md"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-700 font-semibold px-3 py-1 rounded-md text-sm hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
