import React, { useEffect, useState } from "react";
import { MdPayment, MdInfoOutline, MdDownload, MdRefresh } from "react-icons/md";
import { allFreelancerPaymentsAPI, updateTransactionIdAPI, makePaymentAPI } from "../../services/allAPI";
import jsPDF from "jspdf";
import LoadingSpinner from "../../common/components/LoadingSpinner";

const STATUS = {
  Paid: { cls: "bg-green-600/20 text-green-400 border-green-500/30", icon: "✔" },
  Pending: { cls: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30", icon: "⏳" },
  Failed: { cls: "bg-red-600/20 text-red-400 border-red-500/30", icon: "❌" },
};

function PaymentsPanel() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setError("");

      const res = await allFreelancerPaymentsAPI(reqHeader);
      console.log(res.data);

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const generatePDF = (payment) => {
    if (!payment) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // --- Header ---
    doc.setFillColor(41, 128, 185); // Blue header
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT RECEIPT", pageWidth / 2, 28, { align: "center" });

    yPos += 50;

    // --- From / To Section ---
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.setFont("helvetica", "bold");
    doc.text("FROM:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("Atlas CRM Inc.", margin, yPos + 7);
    doc.text("123 Business Ave, Suite 100", margin, yPos + 14);
    doc.text("San Francisco, CA 94107", margin, yPos + 21);
    doc.text("support@atlascrm.com", margin, yPos + 28);

    doc.setFont("helvetica", "bold");
    doc.text("TO:", margin + 100, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(payment.clientMail, margin + 100, yPos + 7);

    yPos += 40;

    // --- Payment Info Box ---
    const infoLabels = [
      ["Transaction ID:", payment.transactionId || "—"],
      ["Project:", payment.projectName],
      ["Amount Paid:", `$${payment.amount}`],
      ["Payment Status:", payment.status],
      ["Payment Date:", new Date(payment.paidAt).toLocaleString()],
    ];

    doc.setFillColor(236, 240, 241);
    doc.rect(margin, yPos, pageWidth - margin * 2, infoLabels.length * 10 + 5, "F");

    doc.setTextColor(52, 73, 94);
    doc.setFont("helvetica", "bold");

    infoLabels.forEach(([label, value], index) => {
      doc.text(label, margin + 5, yPos + 8 + index * 10);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), margin + 70, yPos + 8 + index * 10);
      doc.setFont("helvetica", "bold");
    });

    yPos += infoLabels.length * 10 + 20;

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your payment!", pageWidth / 2, yPos, { align: "center" });
    doc.text("This receipt confirms payment for services rendered.", pageWidth / 2, yPos + 6, { align: "center" });

    // Save PDF
    doc.save(`Receipt_${payment.transactionId || payment._id.slice(-8)}.pdf`);
  };


  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "—");
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amt || 0);

  if (loading) return <LoadingSpinner size="lg" message="Loading payments..." />;

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-semibold flex items-center gap-3">
          <MdPayment className="text-blue-400" /> Payment History
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

      {error && <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">{error}</div>}

      {!payments.length && !error && <p className="text-gray-400">No payments found.</p>}

      {payments.length > 0 && (
        <div className="overflow-x-auto bg-gray-800 rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-900">
              <tr>
                {["Project", "Amount", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="p-4 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const s = STATUS[p.status] || STATUS.Pending;
                return (
                  <tr key={p._id} className="border-t border-gray-700 hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">{p.projectName}</td>
                    <td className="p-4 font-semibold">{formatCurrency(p.amount)}</td>
                    <td className="p-4">{formatDate(p.paidAt)}</td>
                    <td className="p-4">
                      <span className={`inline-flex gap-2 px-3 py-1 rounded-full border ${s.cls}`}>
                        {s.icon} {p.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => setSelected(p)} className="bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-500 transition">
                        <MdInfoOutline />
                      </button>
                      {p.status === "Paid" && (
                        <button onClick={() => generatePDF(p)} className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600 transition">
                          <MdDownload />
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

      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div onClick={(e) => e.stopPropagation()} className="bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-xl mb-4 font-semibold">Payment Details</h3>
            <p>Project: {selected.projectName}</p>
            <p>Amount: {formatCurrency(selected.amount)}</p>
            <p>Date: {formatDate(selected.paidAt)}</p>
            <p>Status: {selected.status}</p>
            <p>Transaction ID: {selected.transactionId || "—"}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-500 transition">
                Close
              </button>
              {selected.status === "Paid" && (
                <button onClick={() => generatePDF(selected)} className="bg-blue-600 py-2 px-4 rounded-lg hover:bg-blue-500 transition">
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

export default PaymentsPanel;
