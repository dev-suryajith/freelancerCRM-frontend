import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Admin_Freelancer from "../components/Admin_Freelancer";
import AdminHomeDashboard from "../components/AdminHomeDashboard";
import AllPayments from "../components/AllPayments";
import Sidebar from "../../common/components/Sidebar";
import AdminSettings from "../components/AdminSettings";

function AdminHome() {
  const [displayPanel, setDisplayPanel] = useState("home");

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <Sidebar setDisplayPanel={setDisplayPanel} />

        {/* Content */}
        <main className="p-6 md:p-8">
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-xl min-h-[85vh]">
            {displayPanel === "home" && <AdminHomeDashboard />}
            {displayPanel === "freelancer" && <Admin_Freelancer />}
            {displayPanel === "payments" && <AllPayments />}
            {displayPanel === "settings" && <AdminSettings />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminHome;
