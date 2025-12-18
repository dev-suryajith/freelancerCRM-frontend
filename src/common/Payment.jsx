import React, { useState } from "react";

function Payment() {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = {
    basic: 0,
    pro: 499,
    enterprise: 999,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white px-6 pt-28 pb-20 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 shadow-2xl">
        
        {/* Heading */}
        <h2 className="text-3xl font-bold text-indigo-400 mb-6">
          Complete Your Payment
        </h2>

        {/* Plan Select */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {["basic", "pro", "enterprise"].map((p) => (
            <div
              key={p}
              onClick={() => setSelectedPlan(p)}
              className={`cursor-pointer p-5 rounded-xl border text-center transition ${
                selectedPlan === p
                  ? "bg-indigo-600 border-indigo-400 shadow-lg scale-105"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              <h3 className="text-xl font-semibold capitalize">{p}</h3>
              <p className="text-gray-300 mt-2 text-lg">
                ₹{plans[p]} / month
              </p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white/10 border border-white/20 p-5 rounded-xl mb-10">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          <p className="text-gray-300">Plan: {selectedPlan.toUpperCase()}</p>
          <p className="text-gray-300">Billing Cycle: Monthly</p>
          <p className="text-indigo-400 text-2xl font-bold mt-3">
            Total: ₹{plans[selectedPlan]}
          </p>
        </div>

        {/* Payment Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Card Details</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Holder Name"
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <input
              type="text"
              placeholder="Card Number"
              maxLength="16"
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength="5"
                className="p-3 rounded-lg bg-black/20 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="CVV"
                maxLength="3"
                className="p-3 rounded-lg bg-black/20 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Pay Now Button */}
          <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-lg shadow-lg transition">
            Pay Now ₹{plans[selectedPlan]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
