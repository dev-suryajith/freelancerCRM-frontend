import React, { useEffect, useMemo, useState } from "react";
import { Briefcase, Users, CreditCard, TrendingUp } from "lucide-react";
import { FaX } from "react-icons/fa6";
import AddNewWorkStepper from "../AddNewWorkStepper";
import {
  getAllProjectsAPI,
  getAllClientsAPI,
  allFreelancerPaymentsAPI,
} from "../../services/allAPI";

function HomePanel() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  const fetchStats = async () => {
    try {
      setLoading(true);
      const [projectsRes, clientsRes, paymentsRes] = await Promise.all([
        getAllProjectsAPI(reqHeader),
        getAllClientsAPI(reqHeader),
        allFreelancerPaymentsAPI(reqHeader),
      ]);

      setProjects(projectsRes?.data || []);
      setClients(clientsRes?.data || []);
      setPayments(paymentsRes?.data || []);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  /* ---------------- DERIVED VALUES ---------------- */
  const pendingAmount = useMemo(() => {
    return payments
      .filter((p) => p.status !== "Paid")
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  const formattedPendingAmount = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(pendingAmount);
  }, [pendingAmount]);

  const stats = useMemo(
    () => [
      {
        title: "Active Projects",
        value: projects.length,
        icon: <Briefcase size={26} className="text-blue-400" />,
      },
      {
        title: "Total Clients",
        value: clients.length,
        icon: <Users size={26} className="text-green-400" />,
      },
      {
        title: "Pending Payments",
        value: formattedPendingAmount,
        icon: <CreditCard size={26} className="text-red-400" />,
      },
    ],
    [projects.length, clients.length, formattedPendingAmount]
  );

  /* ---------------- RECENT ACTIVITY ---------------- */
  const recentActivity = useMemo(() => {
    const paymentActivity = payments.map((p) => ({
      text: `Payment ${p.status} from ${p.clientMail} for ${p.projectName}`,
      time: new Date(p.updatedAt),
    }));

    const projectActivity = projects.map((p) => ({
      text: `New project "${p.projectName}" added`,
      time: new Date(p.createdAt),
    }));

    return [...paymentActivity, ...projectActivity]
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
  }, [payments, projects]);

  return (
    <div className="p-5 sm:p-7 space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Dashboard Overview
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white/10 backdrop-blur-md border border-white/20
                     px-4 py-2.5 text-white font-semibold rounded-xl
                     hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]
                     transition-all"
        >
          + Add New Work
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="relative bg-white/10 backdrop-blur-xl border border-white/20
                       rounded-2xl p-6 shadow-lg
                       hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]
                       transition-all duration-300 flex items-center justify-between group"
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 to-transparent
                            opacity-0 group-hover:opacity-100 transition pointer-events-none" />

            <div className="relative z-10">
              <p className="text-white/70 text-sm font-medium">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-white mt-2 tracking-tight">
                {loading ? "—" : stat.value}
              </p>
            </div>

            <div className="relative z-10 bg-white/15 backdrop-blur-md p-4 rounded-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={22} className="text-indigo-400" />
          Recent Activity
        </h2>

        {recentActivity.length === 0 ? (
          <p className="text-white/60 text-sm">No recent activity</p>
        ) : (
          <ul className="space-y-4">
            {recentActivity.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-start gap-4 py-3
                           border-b border-white/10 last:border-0"
              >
                <span className="text-white/80 text-sm leading-relaxed">
                  {item.text}
                </span>
                <span className="text-xs text-white/50 whitespace-nowrap">
                  {item.time.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white/10 backdrop-blur-2xl border border-white/20
                       w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4
                            bg-white/10 border-b border-white/20">
              <h1 className="text-white text-lg font-semibold tracking-wide">
                New Work
              </h1>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-red-400 transition"
              >
                <FaX />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <AddNewWorkStepper setShowModal={setShowModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePanel;
