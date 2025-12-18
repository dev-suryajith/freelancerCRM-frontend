import React, { useState } from 'react';
import { FaHome, FaComments, FaUserCog } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import { FaX } from 'react-icons/fa6';
import { MdWork, MdSupportAgent, MdPayment } from 'react-icons/md';
import { useEffect } from 'react';
import serverURL from '../../services/serverURL';

function ClientSidebar({ setDisplayPanel }) {
    const [isOpen, setIsOpen] = useState(true);
    const [active, setActive] = useState('dashboard');
    const [clientData, setClientData] = useState({
        username: "",
        email: "",
        phone: "",
        role: "",
        address: "",
        freelancerMail: "",
        password: "",
        profile: null,
    });
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));

    useEffect(() => {
        if (loggedUser) {
            setClientData(loggedUser);
        }
    }, []);

    const menuItems = [
        // { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },s
        { id: 'projects', label: 'My Projects', icon: <MdWork /> },
        { id: 'payments', label: 'Payments', icon: <MdPayment /> },
        { id: 'chat', label: 'Messages', icon: <FaComments /> },
        // { id: 'support', label: 'Support', icon: <MdSupportAgent /> },
        { id: 'settings', label: 'Settings', icon: <FaUserCog /> },
    ];

    const handleMenuClick = (id) => {
        setActive(id);
        if (setDisplayPanel) setDisplayPanel(id);
    };

    return (
        <div
            className={`z-10 bg-gray-800 min-h-screen flex flex-col items-center py-6 border-r-2 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.3)] shadow-blue-800/50 border-blue-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="self-end mr-4 mb-6 text-gray-200 hover:text-blue-500 transition"
            >
                {isOpen ? <FaX size={20} /> : <IoMenu size={24} />}
            </button>

            {/* Profile Section */}
            <div className="flex flex-col items-center mb-10">
                <img
                    // src={`../public/bmc.png`}
                    src={clientData.profile ? `${serverURL}/ProfileImageUploads/${clientData.profile}` : "/bmc.png"}
                    alt="Profile"
                    className={`rounded-full border-4 border-white shadow-md transition-all duration-300 ${isOpen ? 'w-24 h-24' : 'w-12 h-12'
                        }`}
                />
                {isOpen && (
                    <div>
                        <h1 className="text-lg font-semibold mt-3 text-white">
                            {clientData.username}
                        </h1>
                        <h2 className="text-sm font-semibold mt text-center text-white/75">
                            {clientData.role.toLocaleUpperCase()}
                        </h2>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col w-full px-3 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        className={`group relative flex items-center gap-3 px-4 py-2 rounded-md font-medium text-shadow-white transition-all duration-200 ${active === item.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'hover:bg-blue-50 hover:text-blue-600'
                            }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {isOpen && <span>{item.label}</span>}

                        {/* Tooltip for collapsed sidebar */}
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

export default ClientSidebar;
