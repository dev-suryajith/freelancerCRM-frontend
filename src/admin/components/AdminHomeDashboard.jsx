import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { FaUserTie, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { adminGetAllFreelancersAPI, adminGetAllPaymentsAPI } from "../../services/allAPI";

function AdminHomeDashboard() {
  const [selectedHalf, setSelectedHalf] = useState("");
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [chartData, setChartData] = useState([]);
  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const freelancersRes = await adminGetAllFreelancersAPI(reqHeader);
        setTotalFreelancers(freelancersRes?.data?.length || 0);

        const paymentsRes = await adminGetAllPaymentsAPI(reqHeader);
        const allPayments = paymentsRes?.data || [];
        setTotalRevenue(allPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0));
        setPendingPayments(allPayments.filter((p) => p.status === "pending").length);

        // Prepare chart data
        const monthlySales = Array(12).fill(0);
        allPayments.forEach((p) => {
          const month = new Date(p.createdAt).getMonth();
          monthlySales[month] += Number(p.amount || 0);
        });
        const chart = monthlySales.map((amt, idx) => ({
          name: new Date(0, idx).toLocaleString("default", { month: "short" }),
          sales: amt,
        }));
        setChartData(chart);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, []);

  // Filter chart by half-year
  const displayedChartData = selectedHalf
    ? chartData.filter((_, idx) => (selectedHalf === "H1" ? idx < 6 : idx >= 6))
    : chartData;

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">
          Admin Dashboard
        </h1>
        <select
          value={selectedHalf}
          onChange={(e) => setSelectedHalf(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-gray-700 shadow hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select Half-Year</option>
          <option value="H1">H1 - Jan–Jun</option>
          <option value="H2">H2 - Jul–Dec</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <Card
          icon={<FaUserTie className="text-white text-5xl drop-shadow-md" />}
          title="Total Freelancers"
          value={totalFreelancers}
          gradient="from-blue-500 to-blue-700"
        />
        <Card
          icon={<FaMoneyBillWave className="text-white text-5xl drop-shadow-md" />}
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          gradient="from-green-500 to-green-700"
        />
        <Card
          icon={<FaClock className="text-white text-5xl drop-shadow-md" />}
          title="Pending Payments"
          value={pendingPayments}
          gradient="from-red-500 to-red-700"
        />
      </div>

      {/* Chart */}
      <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Revenue Growth (Monthly)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={displayedChartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 6, fill: "#2563eb" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Card Component
const Card = ({ icon, title, value, gradient }) => (
  <div
    className={`flex justify-between items-center p-6 rounded-2xl shadow-lg transform hover:scale-102 transition-all duration-300 ease-in-out bg-linear-to-br ${gradient}`}
  >
    <div>
      <p className="text-gray-200 font-medium">{title}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">{value}</h2>
    </div>
    <div>{icon}</div>
  </div>
);

export default AdminHomeDashboard;
