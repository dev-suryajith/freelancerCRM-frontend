import React, { useEffect, useState } from "react";
import {
    FaHome,
    FaCog,
    FaComments,
    FaUserCog,
} from "react-icons/fa";
import { ImUsers, ImUserTie } from "react-icons/im";
import { IoMenu } from "react-icons/io5";
import { MdOutlinePayments, MdPayment, MdWork } from "react-icons/md";
import { FaX } from "react-icons/fa6";
import serverURL from "../../services/serverURL";

function Sidebar({ setDisplayPanel }) {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
    const role = loggedUser?.role;

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [active, setActive] = useState("home");

    /* ---------------- MENU CONFIG ---------------- */
    const freelancerMenu = [
        { id: "home", label: "Home", icon: <FaHome /> },
        { id: "projects", label: "Projects", icon: <ImUserTie /> },
        { id: "client", label: "Clients", icon: <ImUsers /> },
        { id: "payments", label: "Payments", icon: <MdOutlinePayments /> },
        { id: "settings", label: "Settings", icon: <FaCog /> },
    ];

    const clientMenu = [
        { id: "projects", label: "My Projects", icon: <MdWork /> },
        { id: "payments", label: "Payments", icon: <MdPayment /> },
        { id: "chat", label: "Messages", icon: <FaComments /> },
        { id: "settings", label: "Settings", icon: <FaUserCog /> },
    ];

    const adminMenu = [
        { id: "home", label: "Dashboard", icon: <FaHome /> },
        { id: "freelancer", label: "Freelancers", icon: <ImUsers /> },
        { id: "payments", label: "Payments", icon: <MdPayment /> },
        { id: "settings", label: "Admin Settings", icon: <FaUserCog /> },
    ];

    const menuItems = role === "freelancer" ? freelancerMenu : role === "admin" ? adminMenu : clientMenu;

    /* ---------------- SCREEN DETECTION ---------------- */
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ---------------- ACTIONS ---------------- */
    const handleMenuClick = (id) => {
        setActive(id);
        setDisplayPanel(id);
        if (isMobile) setIsOpen(false);
    };

    /* ---------------- THEME ---------------- */
    const theme = {
        sidebar:
            role === "admin"
                ? "bg-slate-900 border-violet-800 shadow-violet-900/40"
                : "bg-gray-800 border-blue-800 shadow-blue-900/40",

        active:
            role === "admin"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                : "bg-blue-600 text-white",

        hover:
            role === "admin"
                ? "hover:bg-violet-800/40 hover:text-white"
                : "hover:bg-gray-700 hover:text-white",

        accent:
            role === "admin" ? "text-violet-400" : "text-blue-400",
    };

    return (
        <>
            {/* MOBILE TOGGLE */}
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`fixed top-20 left-4 z-50 p-2 rounded-lg shadow-lg ${theme.active}`}
                >
                    <IoMenu size={22} />
                </button>
            )}

            {/* OVERLAY */}
            {isMobile && isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed md:static z-50 min-h-screen flex flex-col py-6
        border-r shadow-xl transition-all duration-300
        ${theme.sidebar}
        ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-20"}`}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center px-4 mb-6">
                    <h2 className={`font-bold text-lg ${theme.accent}`}>
                        {role === "admin" ? "ADMIN PANEL" : "MENU"}
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-white"
                    >
                        <FaX />
                    </button>
                </div>

                {/* PROFILE */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={
                            loggedUser?.profile
                                ? `${serverURL}/ProfileImageUploads/${loggedUser.profile}`
                                : "/bmc.png"
                        }
                        className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                        alt="profile"
                    />
                    <h3 className="mt-3 text-white font-semibold">
                        {loggedUser?.username || loggedUser?.freelancerName}
                    </h3>
                    <p className={`text-xs uppercase ${theme.accent}`}>
                        {role}
                    </p>
                </div>

                {/* MENU */}
                <nav className="flex flex-col gap-2 px-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all
              ${active === item.id
                                    ? theme.active
                                    : `text-gray-300 ${theme.hover}`
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* FOOTER */}
                <div className="mt-auto text-center text-xs text-gray-400 py-4">
                    © 2025 Atlas CRM
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
