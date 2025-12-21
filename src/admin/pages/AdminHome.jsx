import React, { useEffect, useState } from "react";
import Admin_Freelancer from "../components/Admin_Freelancer";
import AdminHomeDashboard from "../components/AdminHomeDashboard";
import AllPayments from "../components/AllPayments";
import Sidebar from "../../common/components/Sidebar";
import AdminSettings from "../components/AdminSettings";
import Footer from "../../common/Footer";
import Navbar from "../components/Navbar";

function AdminHome() {
  const [displayPanel, setDisplayPanel] = useState("home");

  useEffect(() => {
    document.title = "Admin Dashboard | Atlas CRM";
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      {/* Top Navbar */}
      <Navbar/>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <Sidebar setDisplayPanel={setDisplayPanel} />

        {/* Content */}
        <main className="p-6 md:p-8">
          <div className="border border-white/15 rounded-2xl p-6 shadow-xl shadow-blue-50/10 min-h-[85vh]">
            {displayPanel === "home" && <AdminHomeDashboard />}
            {displayPanel === "freelancer" && <Admin_Freelancer />}
            {displayPanel === "payments" && <AllPayments />}
            {displayPanel === "settings" && <AdminSettings />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AdminHome;
