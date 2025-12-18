import React, { useState } from 'react';
import { FaHome, FaBook, FaBriefcase, FaCog } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { ImUsers, ImUserTie } from 'react-icons/im';
import { IoMenu } from 'react-icons/io5';
import { MdOutlinePayments } from 'react-icons/md';

function Sidebar({ setDisplayPanel }) {
  const [isOpen, setIsOpen] = useState(true);
    const [active, setActive] = useState('home');
  
    const menuItems = [
      { id: 'home', label: 'Home', icon: <FaHome /> },
      { id: 'freelancer', label: 'Freelancers', icon: <ImUserTie /> },
      // { id: 'client', label: 'Clients', icon: <ImUsers /> },
      { id: 'payments', label: 'Payments', icon: <MdOutlinePayments /> },
      { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ];
  
    const handleMenuClick = (id) => {
      setActive(id);
      setDisplayPanel(id);
    };
  
    return (
      <div
        className={`bg-white border-r border-gray-200 min-h-screen flex flex-col items-center py-6 shadow-lg transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="self-end mr-4 mb-6 text-gray-600 hover:text-blue-500 transition"
        >
          {isOpen ? <FaX size={20} /> : <IoMenu size={24} />}
        </button>
  
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-linear-to-r= from-blue-500 to-indigo-400 p-0.5">
              <div className="rounded-full w-full h-full"></div>
            </div>
            <img src="../public/bmc.png" alt="Profile" className={`rounded-full border-4 border-white shadow-md transition-all duration-300 ${ isOpen ? 'w-24 h-24' : 'w-12 h-12' }`} />
          </div>
          {isOpen && (
            <>
              <h1 className="text-lg font-semibold mt-3 text-gray-800">Suryajith S S</h1>
              <p className="text-gray-500 text-sm">Admin</p>
            </>
          )}
        </div>
  
        {/* Navigation Menu */}
        <nav className="flex flex-col w-full px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`group relative flex items-center gap-3 px-4 py-2 rounded-md font-medium text-gray-700 transition-all duration-200 ${
                active === item.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
  
              {/* Tooltip when collapsed */}
              {!isOpen && (
                <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
  
        {/* Footer */}
        <div className="mt-auto text-gray-400 text-xs py-4">
          {isOpen && <p>© 2025 Freelancer CRM</p>}
        </div>
      </div>
    );
  }

export default Sidebar;
