import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loginAPI, registerAPI, sendCodeAPI } from "../services/allAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";


function Login({ tab }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "freelancer",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      const result = await registerAPI(formData);
      console.log(result.data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setErrorMsg("Registration failed. Try again.");
    }
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      return setErrorMsg("Fill the form completely");
    }

    try {
      const result = await loginAPI(formData);
      const { user, token } = result.data;

      if (result.status === 200) {
        sessionStorage.setItem(
          "loggedUserDetails",
          JSON.stringify({ ...user, profile: user.profile || "" })
        );
        sessionStorage.setItem("token", token);
        toast.success(`Welcome back, ${user.freelancerName || user.username}!`);
        if (user.role === "client") navigate("/client");
        if (user.role === "freelancer") navigate("/freelancer");
        if (user.role === "admin") navigate("/admin");
      }
    } catch (error) {
      if (error?.status === 404) {
        setErrorMsg("Invalid login credentials");
      } else if (error?.status === 405) {
        setErrorMsg(
          <div>
            Incorrect password.
            <p className="text-gray-200 mt-1">Try again or reset your password</p>
            <button
              onClick={() => (setResetPassword(true))}
              className="text-blue-400 mt-2 underline"
            >
              Reset Password
            </button>
          </div>
        );
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  const handleFindAccount = async () => {
    const { email } = formData;
    console.log(email);


    if (!email) return setErrorMsg("Please enter a valid email");

    try {
      const result = await sendCodeAPI({ email });

      if (result.status === 200) {
        setCodeSent(true);
      }
    } catch (err) {
      console.log(err);
      setErrorMsg("Failed to send code. Try again.");
    }
  };


  useEffect(() => {
    if (resetPassword == true) {
      setErrorMsg("")
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full ${codeSent ? "max-w-lg" : "max-w-md"} bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20`}
      >
        {!codeSent ?
          <div>
            <div>
              {
                !resetPassword ?
                  <div>
                    <h2 className="text-3xl font-semibold text-center text-white mb-2">
                      {tab === "register" ? "Create Account" : "Welcome Back"}
                    </h2>

                    <p className="text-center text-gray-300 text-sm mb-8">
                      {tab === "register"
                        ? "Register to start managing your freelancing journey"
                        : "Log in to continue managing your freelancing journey"}
                    </p>

                    <form className="space-y-5">
                      {/* REGISTER FIELDS */}
                      {tab === "register" && (
                        <>
                          <div>
                            <label className="text-gray-200 mb-1 block text-sm">Full Name</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={formData.username}
                              onChange={(e) => handleChange("username", e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-gray-200 mb-1 block text-sm">Phone</label>
                            <input
                              type="text"
                              placeholder="9876543210"
                              value={formData.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </>
                      )}

                      {/* Email */}
                      <div>
                        <label className="text-gray-200 mb-1 block text-sm">Email</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-gray-200 mb-1 block text-sm">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-white text-xl"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      {tab === "register" && (
                        <div>
                          <label className="text-gray-200 mb-1 block text-sm">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleChange("confirmPassword", e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3 text-white text-xl"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="button"
                        onClick={() =>
                          tab === "register" ? handleRegister() : handleLogin()
                        }
                        className={`w-full py-3 rounded-xl text-lg font-medium shadow-lg text-white ${tab === "register"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-blue-600 hover:bg-blue-700"
                          }`}
                      >
                        {tab === "register" ? "Register" : "Login"}
                      </button>
                    </form>

                    {/* Error Message */}
                    {errorMsg && (
                      <div className="text-red-400 text-center text-sm mt-4">{errorMsg}</div>
                    )}

                    {/* Bottom Navigation */}
                    <div className="text-gray-300 text-center text-sm mt-6">
                      {tab === "register" ? (
                        <>
                          Already have an account?{" "}
                          <span
                            className="text-purple-400 hover:underline cursor-pointer"
                            onClick={() => {
                              navigate("/login");
                              setFormData({
                                username: "",
                                email: "",
                                phone: "",
                                password: "",
                                role: "freelancer",
                                confirmPassword: "",
                              });
                            }}
                          >
                            Login
                          </span>
                        </>
                      ) : (
                        <>
                          Don’t have an account?{" "}
                          <span
                            className="text-blue-400 hover:underline cursor-pointer"
                            onClick={() => {
                              navigate("/register");
                              setFormData({
                                username: "",
                                email: "",
                                phone: "",
                                password: "",
                                role: "freelancer",
                                confirmPassword: "",
                              });
                              setErrorMsg(null);
                            }}
                          >
                            Register
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  :
                  <div>
                    <h2 className="text-3xl font-semibold text-center text-white mb-2">
                      Find Your Account
                    </h2>

                    <p className="text-center text-gray-300 text-sm mb-8">
                      Please enter your email address to search for your account.
                    </p>

                    <form className="space-y-5">
                      {/* Email */}
                      <div>
                        <label className="text-gray-200 mb-1 block text-sm">Email</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>



                      {/* Submit */}
                      <div className='flex items-center gap-3'>
                        <button
                          type="button"
                          onClick={() => setResetPassword(false)}
                          className={`w-full py-3 rounded-xl text-lg font-medium shadow-lg text-gray-800 bg-gray-50 hover:bg-gray-300`}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleFindAccount}
                          className={`w-full py-3 rounded-xl text-lg font-medium shadow-lg text-white bg-blue-600 hover:bg-blue-700`}
                        >
                          Send Code
                        </button>
                      </div>
                    </form>

                    {/* Error Message */}
                    {errorMsg && (
                      <div className="text-red-400 text-center text-sm mt-4">{errorMsg}</div>
                    )}

                    {/* Bottom Navigation */}
                    {
                      resetPassword == false &&
                      <div className="text-gray-300 text-center text-sm mt-6">
                        {tab === "register" ? (
                          <>
                            Already have an account?{" "}
                            <span
                              className="text-purple-400 hover:underline cursor-pointer"
                              onClick={() => {
                                navigate("/login");
                                setFormData({
                                  username: "",
                                  email: "",
                                  phone: "",
                                  password: "",
                                  role: "freelancer",
                                  confirmPassword: "",
                                });
                              }}
                            >
                              Login
                            </span>
                          </>
                        ) : (
                          <>
                            Don’t have an account?{" "}
                            <span
                              className="text-blue-400 hover:underline cursor-pointer"
                              onClick={() => {
                                navigate("/register");
                                setFormData({
                                  username: "",
                                  email: "",
                                  phone: "",
                                  password: "",
                                  role: "freelancer",
                                  confirmPassword: "",
                                });
                                setErrorMsg(null);
                              }}
                            >
                              Register
                            </span>
                          </>
                        )}
                      </div>
                    }
                  </div>
              }
            </div>
          </div>
          :
          <div>
            <h2 className="text-3xl font-semibold text-center text-white mb-2">
              Verification Code Has Been Send
            </h2>

            <p className="text-center text-gray-300 text-sm mb-8">
              Please check your entered email box to search for your account.
            </p>
            <div className="w-full flex justify-center items-center"><Link to={'/login'} className="w-45 flex justify-center px-7 py-3 rounded-xl text-lg font-medium shadow-lg text-white bg-blue-600 hover:bg-blue-700" type="button">Back To Login</Link></div>
          </div>
        }
      </motion.div>
    </div>
  );
}

export default Login;
