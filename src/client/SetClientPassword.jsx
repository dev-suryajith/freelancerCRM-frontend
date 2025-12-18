import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { verifyCodeAPI } from "../services/allAPI";

function SetClientPassword() {
  const [codeVerified, setCodeVerified] = useState(false);

  const [showPassword, setShowPassword] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState("password");

  const [appendCode, setAppendCode] = useState({
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: ""
  });

  const clientMail = useParams();
  console.log("Client Email:", clientMail.email);

  // Returns combined OTP
  const combineCode = () => {
    return (
      appendCode.code1 +
      appendCode.code2 +
      appendCode.code3 +
      appendCode.code4 +
      appendCode.code5
    );
  };

  // Auto move to next field
  const handleInput = (e, nextField) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) {
      setAppendCode({ ...appendCode, [e.target.name]: value });

      if (value && nextField) document.getElementById(nextField).focus();
    }
  };

  // Verify Code Logic
  const verifyCode = async () => {
    const finalCode = combineCode();

    if (finalCode.length !== 5) return alert("Enter complete 5-digit code");

    try {
      const response = await verifyCodeAPI({ verificationCode: finalCode });
      console.log("Verification Response:", response.data);

      if (response.data.codeVerified==true) {
        setCodeVerified(true);
      } else {
        alert("Invalid Verification Code");
      }
    } catch (err) {
      console.log(err);
      alert("Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black p-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20">

        <h2 className="text-3xl font-semibold text-center text-white mb-2">
          Set Your Password
        </h2>
        <p className="text-center text-gray-300 text-sm mb-8">
          Create a strong password to secure your account
        </p>

        <form className="space-y-6">

          {/* STEP 1: Verification Code */}
          {!codeVerified ? (
            <div>
              <label className="text-gray-200 mb-2 block text-sm">Enter Verification Code</label>

              <div className="flex justify-between gap-2">
                {["code1", "code2", "code3", "code4", "code5"].map((key, index) => (
                  <input
                    key={key}
                    id={key}
                    name={key}
                    maxLength={1}
                    value={appendCode[key]}
                    onChange={(e) => handleInput(e, index < 4 ? `code${index + 2}` : null)}
                    placeholder="_"
                    className="w-12 h-12 my-6 text-center text-xl font-semibold rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={verifyCode}
                className="w-full bg-green-600 hover:bg-green-700 transition duration-200 text-white py-3 rounded-xl text-lg font-medium shadow-lg"
              >
                Verify Code
              </button>
            </div>
          ) : (

            /* STEP 2: New Password */
            <div>
              {/* New Password */}
              <div className="relative">
                <label className="text-gray-200 mb-1 block text-sm">New Password</label>
                <input
                  type={showPassword}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(showPassword === "password" ? "text" : "password")
                  }
                  className="absolute right-4 top-11 text-white"
                >
                  {showPassword === "password" ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative mt-4">
                <label className="text-gray-200 mb-1 block text-sm">Confirm Password</label>
                <input
                  type={showConfirmPassword}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      showConfirmPassword === "password" ? "text" : "password"
                    )
                  }
                  className="absolute right-4 top-11 text-white"
                >
                  {showConfirmPassword === "password" ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="button"
                className="w-full mt-6 bg-green-600 hover:bg-green-700 transition duration-200 text-white py-3 rounded-xl text-lg font-medium shadow-lg"
              >
                Set Password
              </button>

              <p className="text-gray-400 text-center text-xs mt-6">
                Make sure your password is at least 8 characters long
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SetClientPassword;
