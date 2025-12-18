import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { updatePaymentStatusAPI, updateTransactionIdAPI } from "../services/allAPI";

function PaymentSuccess() {
  const { projectId } = useParams();
  const [role, setRole] = useState("");

  // Generate a random transaction ID
  const generateTransactionId = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const updatePaymentStatus = async () => {
    if (!projectId) return;

    const transactionId = generateTransactionId(12); // generate once
    console.log("Transaction ID:", transactionId);

    try {
      const result = await updatePaymentStatusAPI({
        projectId,
        status: "Paid",
        transactionId,
      });
      console.log(result.data);
      if (result.status == 200) {
        const res = await updateTransactionIdAPI({ projectId })
        console.log(res.data);

      }
    } catch (err) {
      console.error("Payment update failed:", err);
    }
  };

  useEffect(() => {
    // Get user role
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
    setRole(loggedUser?.role || "");

    // Update payment status once
    updatePaymentStatus();
  }, [projectId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Payment Successful
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          Thank you! Your payment has been processed successfully.
        </p>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-6" />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to={`/${role}`}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-xl transition"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/projects"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition border border-gray-600"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
