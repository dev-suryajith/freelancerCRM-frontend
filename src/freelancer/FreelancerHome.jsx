// src/freelancer/FreelancerHome.jsx
import React, { useState } from 'react';
import FreelancerSidebar from './components/FreelancerSidebar';
import HomePanel from './components/HomePanel';
import ClientPanel from './components/ClientPanel';
import PaymentsPanel from './components/PaymentsPanel';
import SettingsPanel from './components/SettingsPanel';
import ProjectsPanel from './components/ProjectsPanel';
import FreelancerNavBar from './components/FreelancerNavBar';
import { Link } from 'react-router-dom';
import Sidebar from '../common/components/Sidebar';


function FreelancerHome() {
  const [displayPanel, setDisplayPanel] = useState('home');
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"))

  const renderPanel = () => {
    switch (displayPanel) {
      case 'home':
        return <HomePanel />
      case 'projects':
        return <ProjectsPanel />
      case 'client':
        return <ClientPanel />
      case 'payments':
        return <PaymentsPanel />
      case 'settings':
        return <SettingsPanel />
      default:
        return 'Welcome Back!'
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
      <FreelancerNavBar />
      <div className="grid grid-cols-[auto_1fr] min-h-[calc(100vh-64px)]">
        {/* <FreelancerSidebar setDisplayPanel={setDisplayPanel} /> */}
        <Sidebar setDisplayPanel={setDisplayPanel} />
        <main className="p-8 overflow-hidden bg-linear-to-b from-transparent to-black/10 backdrop-blur-[1px]">
          {loggedUser ? renderPanel() :
            <div className="flex flex-col items-center justify-center scale-110 h-full ">
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
        </main>
      </div>
    </div>
  );
}

export default FreelancerHome;
