import { LogOut, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ClientNavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("loggedUserDetails");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedUserDetails");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
            Atlas CRM
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Greeting */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm">
                <User size={16} />
                <span className="font-medium">
                  {user.username || user.clientName || "Client"}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500 text-white transition text-sm font-medium shadow-md"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-white text-indigo-600 hover:bg-gray-100 transition text-sm font-semibold shadow-md"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}

export default ClientNavBar;
