import React, { useState } from "react";
import { FaHome, FaCog } from "react-icons/fa";
import { ImUserTie } from "react-icons/im";
import { MdOutlinePayments } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { FaX } from "react-icons/fa6";

function Sidebar({ setDisplayPanel }) {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "home", label: "Dashboard", icon: <FaHome /> },
    { id: "freelancer", label: "Freelancers", icon: <ImUserTie /> },
    { id: "payments", label: "Payments", icon: <MdOutlinePayments /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  const handleMenuClick = (id) => {
    setActive(id);
    setDisplayPanel(id);
  };

  return (
    <aside
      className={`relative min-h-screen transition-all duration-300
      ${isOpen ? "w-64" : "w-20"}
      bg-linear-to-b from-[#0F172A] to-[#020617]
      border-r border-white/5 shadow-xl`}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-5 -right-4 z-50 bg-[#1E293B] border border-white/10 rounded-full p-2 text-gray-300 hover:text-indigo-400 transition"
      >
        {isOpen ? <FaX size={14} /> : <IoMenu size={18} />}
      </button>

      {/* Logo / Profile */}
      <div className="flex flex-col items-center py-8 border-b border-white/5">
        <div
          className={`rounded-full bg-linear-to-br from-indigo-500 to-cyan-400 p-0.5 transition-all duration-300 ${
            isOpen ? "w-20 h-20" : "w-12 h-12"
          }`}
        >
          <img
            src="/bmc.png"
            alt="Admin"
            className="w-full h-full rounded-full object-cover bg-[#020617]"
          />
        </div>

        {isOpen && (
          <>
            <h1 className="mt-4 text-white font-semibold text-lg">
              Suryajith S S
            </h1>
            <p className="text-xs text-gray-400 tracking-wide">
              ADMIN
            </p>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>

              {isOpen && (
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              )}

              {/* Tooltip (collapsed) */}
              {!isOpen && (
                <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#020617] border border-white/10 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-4 w-full text-center text-xs text-gray-500">
          © 2025 Atlas CRM
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
