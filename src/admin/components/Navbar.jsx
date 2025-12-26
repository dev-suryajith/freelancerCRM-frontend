import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("loggedUserDetails");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const user = sessionStorage.getItem("loggedUserDetails");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <header className="sticky top-0 z-100 w-full bg-linear-to-r py-4 from-[#020617] via-[#0F172A] to-[#020617] border-b border-white/5 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left */}
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Atlas CRM <span className="text-indigo-400">Admin</span>
        </h1>

        {/* Right */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition text-sm font-medium"
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
    </header>
  );
}

export default Navbar;
