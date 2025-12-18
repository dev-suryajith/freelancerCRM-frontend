import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaUserTie,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import {
  adminGetAllFreelancersAPI,
  adminGetAllPaymentsAPI,
} from "../../services/allAPI";

function AdminHomeDashboard() {
  const [selectedHalf, setSelectedHalf] = useState("");
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [chartData, setChartData] = useState([]);

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- STAT CARD ---------------- */
  const StatCard = ({ icon, title, value, accent }) => (
    <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 flex justify-between items-center hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-white mt-1">
          {value}
        </h2>
      </div>
      <div
        className={`text-3xl p-4 rounded-xl ${accent}`}
      >
        {icon}
      </div>
    </div>
  );

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const freelancersRes =
          await adminGetAllFreelancersAPI(reqHeader);
        setTotalFreelancers(
          freelancersRes?.data?.length || 0
        );

        const paymentsRes =
          await adminGetAllPaymentsAPI(reqHeader);
        const allPayments = paymentsRes?.data || [];

        setTotalRevenue(
          allPayments.reduce(
            (acc, p) => acc + Number(p.amount || 0),
            0
          )
        );

        setPendingPayments(
          allPayments.filter(
            (p) => p.status === "Pending"
          ).length
        );

        const monthlySales = Array(12).fill(0);
        allPayments.forEach((p) => {
          const month = new Date(
            p.createdAt
          ).getMonth();
          monthlySales[month] += Number(
            p.amount || 0
          );
        });

        setChartData(
          monthlySales.map((amt, idx) => ({
            name: new Date(0, idx).toLocaleString(
              "default",
              { month: "short" }
            ),
            sales: amt,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  /* ---------------- FILTER CHART ---------------- */
  const displayedChartData = selectedHalf
    ? chartData.filter((_, idx) =>
        selectedHalf === "H1"
          ? idx < 6
          : idx >= 6
      )
    : chartData;

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Admin insights & performance
          </p>
        </div>

        <select
          value={selectedHalf}
          onChange={(e) =>
            setSelectedHalf(e.target.value)
          }
          className="bg-[#0F172A] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Year</option>
          <option value="H1">H1 – Jan to Jun</option>
          <option value="H2">H2 – Jul to Dec</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaUserTie />}
          title="Total Freelancers"
          value={totalFreelancers}
          accent="bg-indigo-600/20 text-indigo-400"
        />
        <StatCard
          icon={<FaMoneyBillWave />}
          title="Total Revenue"
          value={`₹ ${totalRevenue.toLocaleString()}`}
          accent="bg-green-600/20 text-green-400"
        />
        <StatCard
          icon={<FaClock />}
          title="Pending Payments"
          value={pendingPayments}
          accent="bg-yellow-600/20 text-yellow-400"
        />
      </div>

      {/* CHART */}
      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Revenue Growth (Monthly)
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={displayedChartData}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#E5E7EB",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminHomeDashboard;
