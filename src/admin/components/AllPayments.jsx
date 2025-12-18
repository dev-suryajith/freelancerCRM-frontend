import React, { useEffect, useState } from "react";
import { MdPayment } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { adminGetAllPaymentsAPI } from "../../services/allAPI";

function AllPayments() {
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("date"); // date | amount | status
  const [sortOrder, setSortOrder] = useState("desc");

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- FETCH ---------------- */
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
    if (token) getAllPayments();
  }, [token]);

  /* ---------------- HELPERS ---------------- */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusStyles = {
    Paid: "bg-green-500/10 text-green-400 ring-green-500/20",
    Pending: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    Failed: "bg-red-500/10 text-red-400 ring-red-500/20",
  };

  /* ---------------- FILTER ---------------- */
  const filteredPayments = payments.filter(
    (p) =>
      p.projectName?.toLowerCase().includes(search.toLowerCase()) ||
      p.clientMail?.toLowerCase().includes(search.toLowerCase()) ||
      p.freelancerMail?.toLowerCase().includes(search.toLowerCase())
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
      valueA = new Date(a.paidAt || a.createdAt);
      valueB = new Date(b.paidAt || b.createdAt);
    }

    return sortOrder === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <MdPayment className="text-indigo-400" />
          Payments
        </h1>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search project, client, freelancer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0F172A] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#0F172A] border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="status">Sort by Status</option>
        </select>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-[#0F172A] border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-[#0F172A] border border-white/5 rounded-2xl overflow-x-auto">
        {loading ? (
          <p className="py-12 text-center text-gray-400">
            Loading payments...
          </p>
        ) : sortedPayments.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            No payments found
          </p>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#020617] text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 text-left">Project</th>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Freelancer</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Txn ID</th>
              </tr>
            </thead>

            <tbody>
              {sortedPayments.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {p.projectName}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {p.clientMail}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {p.freelancerMail}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-200">
                    ₹{p.amount?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs rounded-full ring-1 ${
                        statusStyles[p.status] ||
                        "bg-gray-500/10 text-gray-400 ring-gray-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(p.paidAt || p.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
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
