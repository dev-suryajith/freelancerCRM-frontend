import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ClientProjects from "./components/ClientProjects";
import ClientChat from "./components/ClientChat";
import ClientPayment from "./components/ClientPayment";
import ClientSettings from "./components/ClientSettings";
import { Link } from "react-router-dom";
import Sidebar from "../common/components/Sidebar";
import ClientNavBar from './components/ClientNavBar'
import Footer from "../common/Footer";
import Header from "../common/Header";

function ClientDashboard() {
  const [displayPanel, setDisplayPanel] = useState("home");
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"))

  const renderPage = () => {
    switch (displayPanel) {
      case "projects":
        return <ClientProjects />;
      case "chat":
        return <ClientChat />;
      case "payments":
        return <ClientPayment />;
      case "settings":
        return <ClientSettings />;
      default:
        return (
          <div className="text-white p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto text-center"
            >
              {/* Title Animation */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl font-extrabold mb-4 
        bg-linear-to-r from-indigo-400 to-purple-500 
        text-transparent bg-clip-text drop-shadow-xl"
              >
                Welcome to Your Dashboard
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-300 text-lg mb-10"
              >
                Select an option from the sidebar to get started.
              </motion.p>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl 
        border border-white/10 inline-flex items-center gap-3"
              >
                {/* Animated Icon */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Sparkles className="text-yellow-300 w-6 h-6" />
                </motion.div>

                <p className="text-gray-200 font-medium">
                  You’re all set! Everything is synced and ready.
                </p>
              </motion.div>

              {/* Floating subtle glow */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 mt-10 w-60 h-60 
        bg-purple-600 opacity-20 blur-3xl rounded-full"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 6 }}
              />
            </motion.div>
          </div>
        );
    }
  };

  useEffect(() => {
    document.title = "Client Dashboard | Atlas CRM";
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <ClientNavBar />

      <div className="flex flex-1">
        {
          loggedUser ?
            <Sidebar displayPanel={displayPanel} setDisplayPanel={setDisplayPanel} />
            :
            <Sidebar />
        }

        <div className="flex-1 bg-linear-to-br from-gray-900 via-gray-800 to-blac p-6 overflow-hidden">
          {loggedUser ? renderPage() :
            <div className="flex flex-col items-center justify-center scale-110 h-full">
              <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm max-w-md">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-300 mb-2">Authentication Required</h1>
                <p className="text-gray-400 mb-6">Please log in to access this page</p>
                <Link to={'/login'}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ClientDashboard;
