import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Admin_Freelancer from '../components/Admin_Freelancer';
import AdminHomeDashboard from '../components/AdminHomeDashboard';
import AllPayments from '../components/AllPayments';
import Sidebar from "../../common/components/Sidebar";
import AdminSettings from '../components/AdminSettings';

function AdminHome() {
  const [displayPanel, setDisplayPanel] = useState('home');

  return (
    <>
      <Navbar />
      <div className="md:grid grid-cols-[1fr_4fr] min-h-screen">
        {/* Pass setter to Sidebar */}
        <Sidebar setDisplayPanel={setDisplayPanel} />

        {/* Main Content Area */}
        <div className="p-8">
          {displayPanel === 'home' && <AdminHomeDashboard />}
          {displayPanel === 'freelancer' && <Admin_Freelancer />}
          {displayPanel === 'payments' && <AllPayments />}
          {displayPanel === 'settings' && <AdminSettings />}
        </div>
      </div>
    </>
  );
}

export default AdminHome;
