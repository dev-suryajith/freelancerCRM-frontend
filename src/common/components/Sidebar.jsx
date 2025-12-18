import React, { useEffect, useState } from 'react';
import { FaHome, FaCog, FaComments, FaUserCog } from 'react-icons/fa';
import { ImUsers, ImUserTie } from 'react-icons/im';
import { IoMenu } from 'react-icons/io5';
import { MdOutlinePayments, MdPayment, MdWork } from 'react-icons/md';
import { FaX } from 'react-icons/fa6';
import serverURL from '../../services/serverURL';

function Sidebar({ setDisplayPanel }) {
    const [isOpen, setIsOpen] = useState(true);
    const [disableToggle, setdisableToggle] = useState(true);
    const [active, setActive] = useState('home');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [role, setRole] = useState('')
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));

    const freelancerMenu = [
        { id: "home", label: "Home", icon: <FaHome /> },
        { id: "projects", label: "Projects", icon: <ImUserTie /> },
        { id: "client", label: "Clients", icon: <ImUsers /> },
        { id: "payments", label: "Payments", icon: <MdOutlinePayments /> },
        { id: "settings", label: "Settings", icon: <FaCog /> }
    ]

    const clientMenu = [
        { id: "projects", label: "My Projects", icon: <MdWork /> },
        { id: "payments", label: "Payments", icon: <MdPayment /> },
        { id: "chat", label: "Messages", icon: <FaComments /> },
        { id: "settings", label: "Settings", icon: <FaUserCog /> }
    ]
    const AdminMenu = [
        { id: "home", label: "Home", icon: <FaHome /> },
        { id: "freelancer", label: "Freelancers", icon: <ImUsers /> },
        { id: "payments", label: "Payments", icon: <MdPayment /> },
        { id: "settings", label: "Settings", icon: <FaUserCog /> }
    ]

    const menuItems = role === "freelancer" ? freelancerMenu : role === "admin" ? AdminMenu : clientMenu


    const handleMenuClick = (id) => {
        setActive(id);
        setDisplayPanel(id);
    };
    const checkRole = () => {
        setRole(loggedUser?.role)
    }
    const checkDeviceWidth = () => {
        const width = window.innerWidth;
        setScreenWidth(width);
        if (width < 500) {
            setIsOpen(false)
            setdisableToggle(true)
        }
        else {
            setIsOpen(true)
            setdisableToggle(false)
        }
    };


    useEffect(() => {
        checkDeviceWidth();
        checkRole()
    }, [screenWidth,]);

    return (
        <div
            className={`z-10 bg-gray-800 min-h-screen flex flex-col items-center py-6 border-r-2 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.3)] shadow-blue-800/50 border-blue-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
                }`}
        >
            {/* Toggle Button */}
            {
                !disableToggle &&
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="self-end mr-4 mb-6 text-white/75 hover:text-blue-500 transition"
                >
                    {isOpen ? <FaX size={20} /> : <IoMenu size={24} />}
                </button>
            }

            {/* Profile Section */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-linear-to-r= from-blue-500 to-indigo-400 p-0.5">
                        <div className="rounded-full w-full h-full"></div>
                    </div>

                    <img src={loggedUser ? `${serverURL}/ProfileImageUploads/${loggedUser.profile}` : "/bmc.png"} alt="Profile" className={`rounded-full border-4 border-white shadow-md transition-all duration-300 ${isOpen ? 'w-24 h-24' : 'w-12 h-12'}`} />

                </div>
                {isOpen && (
                    <>
                        {loggedUser?.role == 'freelancer' && <h1 className="text-lg font-semibold mt-3 text-gray-50">{loggedUser?.freelancerName}</h1>}
                        {loggedUser?.role == 'client' && <h1 className="text-lg font-semibold mt-3 text-gray-50">{loggedUser?.username}</h1>}
                        {loggedUser?.role == 'admin' && <h1 className="text-lg font-semibold mt-3 text-gray-50">{loggedUser?.username}</h1>}
                        
                        <p className="text-gray-100/75 text-xs text-center">{loggedUser?.role.toLocaleUpperCase()}</p>
                    </>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col w-full px-3 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        className={`group relative flex items-center gap-3 px-4 py-2 rounded-md font-medium text-white/75 transition-all duration-200 ${active === item.id
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
