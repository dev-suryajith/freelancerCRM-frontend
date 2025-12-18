import React, { useEffect, useState } from "react";
import { Briefcase, Users, CreditCard, TrendingUp } from "lucide-react";
import { FaX } from "react-icons/fa6";
import AddNewWorkStepper from "../AddNewWorkStepper";
import { getAllProjectsAPI, getAllClientsAPI, allFreelancerPaymentsAPI } from "../../services/allAPI";

function HomePanel() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  // Fetch all stats dynamically
  const fetchStats = async () => {
    try {
      const [projectsRes, clientsRes, paymentsRes] = await Promise.all([
        getAllProjectsAPI(reqHeader),
        getAllClientsAPI(reqHeader),
        allFreelancerPaymentsAPI(reqHeader),
      ]);
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  const stats = [
    {
      title: "Active Projects",
      value: projects.length,
      color: "text-blue-600",
      icon: <Briefcase size={28} className="text-blue-600" />,
    },
    {
      title: "Total Clients",
      value: clients.length,
      color: "text-green-600",
      icon: <Users size={28} className="text-green-600" />,
    },
    {
      title: "Pending Payments",
      value: `₹${payments.filter(p => p.status !== "Paid").reduce((a,b) => a + b.amount, 0)}`,
      color: "text-red-500",
      icon: <CreditCard size={28} className="text-red-500" />,
    },
  ];

  // Recent activity based on projects and payments
  const recentActivity = [
    ...payments.slice(-3).map(p => ({
      action: `Payment ${p.status} from ${p.clientMail} for ${p.projectName}`,
      time: new Date(p.updatedAt).toLocaleString(),
    })),
    ...projects.slice(-3).map(p => ({
      action: `New project "${p.projectName}" added`,
      time: new Date(p.createdAt).toLocaleString(),
    })),
  ];

  return (
    <div className="p-4 sm:p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white">
          Dashboard Overview
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 text-white text-sm sm:text-lg font-semibold rounded hover:bg-blue-700 transition"
        >
          + Add New Work
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition flex justify-between items-center"
          >
            <div>
              <h2 className="text-gray-600 text-sm sm:text-base font-medium">
                {stat.title}
              </h2>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={22} className="text-indigo-500" />
          Recent Activity
        </h2>

        <ul className="space-y-3">
          {recentActivity.length === 0 ? (
            <li className="text-gray-500 text-sm">No recent activity</li>
          ) : (
            recentActivity.slice(0, 5).map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2 last:border-0"
              >
                <span className="text-gray-700 text-sm sm:text-base">{item.action}</span>
                <span className="text-xs sm:text-sm text-gray-500">{item.time}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-0 z-50">
          <div className="bg-white min-h-[420px] w-full max-w-md sm:max-w-lg shadow-xl rounded-2xl relative">

            {/* Modal Header */}
            <div className="w-full p-4 sm:p-5 flex justify-between items-center bg-gray-500 rounded-t-2xl">
              <h1 className="text-white text-lg sm:text-2xl font-semibold">New Work</h1>
              <button
                className="text-white hover:text-black text-lg sm:text-xl"
                onClick={() => setShowModal(false)}
              >
                <FaX />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <AddNewWorkStepper setShowModal={setShowModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePanel;
