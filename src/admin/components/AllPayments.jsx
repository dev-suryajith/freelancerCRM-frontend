import React, { useEffect, useState } from "react";
import { MdPayment } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { adminGetAllPaymentsAPI } from "../../services/allAPI";

function AllPayments() {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔽 SORT STATE
  const [sortBy, setSortBy] = useState("date"); // date | amount | status
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- FETCH PAYMENTS ---------------- */
  const getAllPayments = async () => {
    try {
      const result = await adminGetAllPaymentsAPI(reqHeader);
      if (result.status === 200) {
        setPayments(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPayments();
  }, []);

  /* ---------------- HELPERS ---------------- */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusColors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  /* ---------------- FILTER ---------------- */
  const filteredPayments = payments.filter(
    (p) =>
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientMail.toLowerCase().includes(search.toLowerCase()) ||
      p.freelancerMail.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- SORT ---------------- */
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === "amount") {
      valueA = a.amount;
      valueB = b.amount;
    } else if (sortBy === "status") {
      valueA = a.status;
      valueB = b.status;
    } else {
      // date
      valueA = new Date(a.paidAt || a.createdAt);
      valueB = new Date(b.paidAt || b.createdAt);
    }

    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
        <MdPayment className="text-blue-600" /> All Payments
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* SEARCH */}
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by project, client, freelancer..."
            className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* SORT BY */}
        <select
          className="border px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="status">Sort by Status</option>
        </select>

        {/* SORT ORDER */}
        <select
          className="border px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading payments...</p>
        ) : sortedPayments.length === 0 ? (
          <p className="text-center text-gray-500">No payments found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="pb-3">Project</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Freelancer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Txn ID</th>
              </tr>
            </thead>

            <tbody>
              {sortedPayments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 font-medium text-gray-800">
                    {p.projectName}
                  </td>
                  <td className="py-3">{p.clientMail}</td>
                  <td className="py-3">{p.freelancerMail}</td>
                  <td className="py-3 font-semibold">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        statusColors[p.status]
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {formatDate(p.paidAt || p.createdAt)}
                  </td>
                  <td className="py-3 text-xs text-gray-400">
                    {p.transactionId || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AllPayments;
