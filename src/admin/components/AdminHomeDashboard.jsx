import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { FaUserTie, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { adminGetAllFreelancersAPI, adminGetAllPaymentsAPI, } from "../../services/allAPI";

function AdminHomeDashboard() {
  const [selectedHalf, setSelectedHalf] = useState("");
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [chartData, setChartData] = useState([]);

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const StatCard = ({ icon, title, value }) => (
    <div className="bg-white border border-gray-900 rounded-2xl p-6 flex justify-between items-center hover:shadow-md transition">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
      </div>
      <div className="text-blue-600 text-4xl">{icon}</div>
    </div>
  );


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const freelancersRes = await adminGetAllFreelancersAPI(reqHeader);
        setTotalFreelancers(freelancersRes?.data?.length || 0);

        const paymentsRes = await adminGetAllPaymentsAPI(reqHeader);
        const allPayments = paymentsRes?.data || [];

        setTotalRevenue(
          allPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0)
        );
        setPendingPayments(
          allPayments.filter((p) => p.status === "pending").length
        );

        const monthlySales = Array(12).fill(0);
        allPayments.forEach((p) => {
          const month = new Date(p.createdAt).getMonth();
          monthlySales[month] += Number(p.amount || 0);
        });

        setChartData(
          monthlySales.map((amt, idx) => ({
            name: new Date(0, idx).toLocaleString("default", { month: "short" }),
            sales: amt,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  const displayedChartData = selectedHalf
    ? chartData.filter((_, idx) =>
      selectedHalf === "H1" ? idx < 6 : idx >= 6
    )
    : chartData;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Admin Dashboard
        </h1>

        <select
          value={selectedHalf}
          onChange={(e) => setSelectedHalf(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Half-Year</option>
          <option value="H1">H1 - Jan–Jun</option>
          <option value="H2">H2 - Jul–Dec</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard
          icon={<FaUserTie />}
          title="Total Freelancers"
          value={totalFreelancers}
        />
        <StatCard
          icon={<FaMoneyBillWave />}
          title="Total Revenue"
          value={`₹ ${totalRevenue.toLocaleString()}`}
        />
        <StatCard
          icon={<FaClock />}
          title="Pending Payments"
          value={pendingPayments}
        />
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Revenue Growth (Monthly)
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={displayedChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminHomeDashboard;
