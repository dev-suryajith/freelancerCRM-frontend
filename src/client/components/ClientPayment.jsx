import React, { useEffect, useState } from "react";
import { MdPayment, MdInfoOutline, MdDownload, MdRefresh } from "react-icons/md";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { getClientProjectsAPI, makePaymentAPI, updateTransactionIdAPI } from "../../services/allAPI";
import LoadingSpinner from "../../common/components/LoadingSpinner";
import jsPDF from "jspdf";

const STATUS = {
  Paid: { cls: "bg-green-600/20 text-green-400 border-green-500/30", icon: <FiCheckCircle /> },
  Pending: { cls: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30", icon: <FiClock /> },
  Failed: { cls: "bg-red-600/20 text-red-400 border-red-500/30", icon: <FiAlertCircle /> },
};

function ClientPayment() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [payingId, setPayingId] = useState(null);



  const fetchPayments = async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");
      if (!token) return setError("Please login to view payments");

      const res = await getClientProjectsAPI({ Authorization: `Bearer ${token}` });
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePayment = async (project) => {
    setPayingId(project._id);
    const { email, freelancerMail } = user;
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await makePaymentAPI(
        { ...project, clientMail: email, freelancerMail, projectId: project._id },
        { Authorization: `Bearer ${token}` }
      );

      const url = res.data.checkoutSessionURL;
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
    }
    setPayingId(null);
  };

  const generatePDF = async (payment) => {
    const result = await updateTransactionIdAPI({ projectId: payment._id });
    const { transactionId } = result.data;

    if (!payment) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Colors for styling
    const primaryColor = [41, 128, 185]; // Blue
    const secondaryColor = [46, 204, 113]; // Green
    const textColor = [52, 73, 94]; // Dark gray
    const lightGray = [236, 240, 241];

    // Add company header with logo and details
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, 30, { align: "center" });

    // Invoice title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("PAYMENT RECEIPT", pageWidth / 2, 40, { align: "center" });

    // Reset position after header
    let yPos = 70;

    // Invoice and Date section
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPos, contentWidth, 40, 'F');

    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("RECEIPT #:", margin + 10, yPos + 15);
    doc.text("DATE:", margin + 10, yPos + 30);

    doc.setFont("helvetica", "normal");
    doc.text(transactionId || "PENDING", margin + 80, yPos + 15);
    doc.text(new Date(payment.paymentDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), margin + 80, yPos + 30);

    yPos += 50;

    // From/To section
    const fromToY = yPos;

    // From (Company)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("FROM:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Atlas CRM Inc.", margin, yPos + 8);
    doc.text("123 Business Ave, Suite 100", margin, yPos + 16);
    doc.text("San Francisco, CA 94107", margin, yPos + 24);
    doc.text("support@atlascrm.com", margin, yPos + 32);

    // To (Client)
    doc.setFont("helvetica", "bold");
    doc.text("TO:", margin + 100, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(user?.name || "Client", margin + 100, yPos + 8);
    doc.text(user?.email || "N/A", margin + 100, yPos + 16);
    doc.text(payment.freelancerName || "Freelancer", margin + 100, yPos + 24);
    doc.text(payment.freelancerMail || "N/A", margin + 100, yPos + 32);

    yPos += 50;

    // Project Details Table
    doc.setFillColor(...secondaryColor);
    doc.rect(margin, yPos, contentWidth, 15, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DESCRIPTION", margin + 10, yPos + 10);
    doc.text("AMOUNT", margin + contentWidth - 40, yPos + 10, { align: "right" });

    yPos += 15;

    // Project row
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Project name row
    doc.text(payment.projectName || "Project Payment", margin + 10, yPos + 10);
    doc.text(`$${payment.projectAmount}`, margin + contentWidth - 40, yPos + 10, { align: "right" });

    yPos += 20;

    // Payment details section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Payment Details", margin, yPos);

    yPos += 10;

    const paymentDetails = [
      ["Payment Status:", payment.paymentStatus],
      ["Payment Method:", "Credit Card / PayPal"],
      ["Payment Date:", new Date(payment.paymentDate).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })],
      ["Transaction ID:", transactionId || "N/A"],
      ["Reference:", payment._id.slice(-8)]
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    paymentDetails.forEach(([label, value], index) => {
      doc.text(label, margin, yPos + (index * 8));
      doc.text(value, margin + 80, yPos + (index * 8));
    });

    yPos += (paymentDetails.length * 8) + 20;

    // Total amount with highlight
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, margin + contentWidth, yPos);

    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL PAID:", margin + contentWidth - 120, yPos);
    doc.text(`$${payment.projectAmount}`, margin + contentWidth - 40, yPos, { align: "right" });

    yPos += 20;

    // Footer with terms and conditions
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);

    doc.text("Terms & Conditions:", margin, yPos);
    doc.setFontSize(8);
    doc.text("This receipt confirms payment for services rendered. All payments are final unless otherwise stated.",
      margin, yPos + 6, { maxWidth: contentWidth });
    doc.text("For billing inquiries, please contact support@atlascrm.com",
      margin, yPos + 16, { maxWidth: contentWidth });

    yPos += 30;

    // Status badge
    doc.setFillColor(...secondaryColor);
    doc.roundedRect(pageWidth / 2 - 30, yPos, 60, 15, 7, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("PAID", pageWidth / 2, yPos + 9, { align: "center" });

    yPos += 25;

    // Thank you message
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Thank you for your business!", pageWidth / 2, yPos, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("A copy of this receipt has been sent to your email.", pageWidth / 2, yPos + 7, { align: "center" });

    // Page number
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page 1 of 1`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

    // Save the PDF
    const fileName = `Receipt_${transactionId || payment._id.slice(-8)}.pdf`;
    doc.save(fileName);
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "—");
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  const totalSpent = payments.reduce((sum, p) => sum + (p.projectAmount || 0), 0);

  useEffect(() => {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
    setUser(loggedUser);
    fetchPayments();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-white">
        <LoadingSpinner size="lg" message="Loading payments..." />
      </div>
    );

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-semibold flex items-center gap-3">
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

      {/* Error */}
      {error && <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">{error}</div>}

      {/* Summary */}
      {!!payments.length && (
        <div className="mb-6 text-xl">
          Total Spent: <span className="font-bold text-green-400">{formatCurrency(totalSpent)}</span>
        </div>
      )}

      {/* Empty */}
      {!payments.length && !error && <p className="text-gray-400">No payments found.</p>}

      {/* Table */}
      {!!payments.length && (
        <div className="overflow-x-auto bg-gray-800 rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-900">
              <tr>
                {["Project", "Amount", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="p-4 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const s = STATUS[p.paymentStatus] || STATUS.Pending;
                return (
                  <tr key={p._id} className="border-t border-gray-700 hover:bg-gray-700/20 transition-colors">
                    <td className="p-4">{p.projectName}</td>
                    <td className="p-4 font-semibold">{formatCurrency(p.projectAmount)}</td>
                    <td className="p-4">{formatDate(p.paymentDate)}</td>
                    <td className="p-4">
                      <span className={`inline-flex gap-2 px-3 py-1 rounded-full border ${s.cls}`}>
                        {s.icon} {p.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => setSelected(p)} className="bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-500 transition">
                        <MdInfoOutline />
                      </button>
                      {p.paymentStatus === "Paid" && (
                        <button onClick={() => generatePDF(p)} className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600 transition">
                          <MdDownload />
                        </button>
                      )}
                      {p.paymentStatus === "Pending" && (
                        <button
                          onClick={() => handlePayment(p)}
                          disabled={payingId === p._id}
                          className="bg-green-600 px-3 py-2 rounded-lg disabled:opacity-50 hover:bg-green-500 transition"
                        >
                          {payingId === p._id ? "Processing..." : "Pay Now"}
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

      {/* Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg"
          >
            <h3 className="text-xl mb-4 font-semibold">Payment Details</h3>
            <p>Project: {selected.projectName}</p>
            <p>Amount: {formatCurrency(selected.projectAmount)}</p>
            <p>Date: {formatDate(selected.paymentDate)}</p>
            <p>Status: {selected.paymentStatus}</p>
            <p>Transaction ID: {selected.transactionId || "—"}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-500 transition">
                Close
              </button>
              {selected.paymentStatus === "Paid" && (
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

export default ClientPayment;
