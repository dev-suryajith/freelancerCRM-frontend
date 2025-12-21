import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  MdPayment,
  MdInfoOutline,
  MdDownload,
  MdRefresh,
} from "react-icons/md";
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import {
  getClientProjectsAPI,
  makePaymentAPI,
  updateTransactionIdAPI,
} from "../../services/allAPI";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import jsPDF from "jspdf";

const STATUS = {
  Paid: {
    cls: "bg-green-600/20 text-green-400 border-green-500/30",
    icon: <FiCheckCircle />,
  },
  Pending: {
    cls: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
    icon: <FiClock />,
  },
  Failed: {
    cls: "bg-red-600/20 text-red-400 border-red-500/30",
    icon: <FiAlertCircle />,
  },
};

function ClientPayment() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const token = sessionStorage.getItem("token");

  /* ---------------- FETCH PAYMENTS ---------------- */
  const fetchPayments = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setError("");

      if (!token) {
        setError("Please login to view payments");
        return;
      }

      const res = await getClientProjectsAPI({
        Authorization: `Bearer ${token}`,
      });
console.log(res.data);

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  /* ---------------- MAKE PAYMENT ---------------- */
  const handlePayment = async (project) => {
    if (!user || !token) return;

    setPayingId(project._id);
    try {
      const res = await makePaymentAPI(
        {
          ...project,
          clientMail: user.email,
          freelancerMail: user.freelancerMail,
          projectId: project._id,
        },
        { Authorization: `Bearer ${token}` }
      );

      if (res?.data?.checkoutSessionURL) {
        window.location.href = res.data.checkoutSessionURL;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPayingId(null);
    }
  };

  /* ---------------- PDF RECEIPT ---------------- */
  const generatePDF = async (payment) => {
    if (!payment) return;

    const result = await updateTransactionIdAPI({
      projectId: payment._id,
    });

    const transactionId = result?.data?.transactionId || "PENDING";

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("PAYMENT RECEIPT", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Receipt ID: ${transactionId}`, 20, 40);
    doc.text(`Date: ${new Date(payment.paymentDate).toLocaleString()}`, 20, 50);

    doc.text("Project Details", 20, 70);
    doc.line(20, 72, 190, 72);

    doc.text(`Project: ${payment.projectName}`, 20, 85);
    doc.text(`Amount: ₹${payment.projectAmount}`, 20, 95);
    doc.text(`Status: ${payment.paymentStatus}`, 20, 105);

    doc.setFontSize(10);
    doc.text(
      "This receipt confirms successful payment for the project listed above.",
      20,
      130
    );

    doc.save(`Receipt_${transactionId}.pdf`);
  };

  /* ---------------- HELPERS ---------------- */
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "—";

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const totalSpent = useMemo(
    () =>
      payments.reduce((sum, p) => sum + (p.projectAmount || 0), 0),
    [payments]
  );

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const loggedUser = JSON.parse(
      sessionStorage.getItem("loggedUserDetails")
    );
    setUser(loggedUser);
    fetchPayments();
  }, [fetchPayments]);

  if (loading) {
    return (
      <div className="p-6 text-white">
        <LoadingSpinner size="lg" message="Loading payments..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-3">
          <MdPayment className="text-blue-400" />
          Payment History
        </h2>

        <button
          onClick={() => fetchPayments(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
        >
          <MdRefresh className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* SUMMARY */}
      {!!payments.length && (
        <div className="mb-6 text-lg">
          Total Spent:{" "}
          <span className="font-bold text-green-400">
            {formatCurrency(totalSpent)}
          </span>
        </div>
      )}

      {/* EMPTY */}
      {!payments.length && !error && (
        <p className="text-gray-400">No payments found.</p>
      )}

      {/* TABLE */}
      {!!payments.length && (
        <div className="overflow-x-auto bg-gray-800 rounded-xl">
          <table className="min-w-[700px] w-full">
            <thead className="bg-gray-900">
              <tr>
                {["Project", "Amount", "Date", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="p-4 text-left">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => {
                const s = STATUS[p.paymentStatus] || STATUS.Pending;

                return (
                  <tr
                    key={p._id}
                    className="border-t border-gray-700 hover:bg-gray-700/20"
                  >
                    <td className="p-4">{p.projectName}</td>
                    <td className="p-4 font-semibold">
                      {formatCurrency(p.projectAmount)}
                    </td>
                    <td className="p-4">
                      {formatDate(p.paymentDate)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex gap-2 px-3 py-1 rounded-full border ${s.cls}`}
                      >
                        {s.icon} {p.paymentStatus ? p.paymentStatus : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 flex-wrap">
                      <button
                        onClick={() => setSelected(p)}
                        className="bg-blue-600 px-3 py-2 rounded-lg"
                      >
                        <MdInfoOutline />
                      </button>

                      {p.paymentStatus == "Paid" && (
                        <button
                          onClick={() => generatePDF(p)}
                          className="bg-gray-700 px-3 py-2 rounded-lg"
                        >
                          <MdDownload />
                        </button>
                      )}

                      {p.paymentStatus == "Pending" && (
                        <button
                          onClick={() => handlePayment(p)}
                          disabled={payingId === p._id}
                          className="bg-green-600 px-3 py-2 rounded-lg disabled:opacity-50"
                        >
                          {payingId === p._id
                            ? "Processing..."
                            : "Pay Now"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 p-6 rounded-xl w-full max-w-md"
          >
            <h3 className="text-xl mb-4 font-semibold">
              Payment Details
            </h3>
            <p>Project: {selected.projectName}</p>
            <p>Amount: {formatCurrency(selected.projectAmount)}</p>
            <p>Date: {formatDate(selected.paymentDate)}</p>
            <p>Status: {selected.paymentStatus}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Close
              </button>

              {selected.paymentStatus === "Paid" && (
                <button
                  onClick={() => generatePDF(selected)}
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Download Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientPayment;
