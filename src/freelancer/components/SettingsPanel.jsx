import React, { useEffect, useState } from "react";
import serverURL from "../../services/serverURL";
import { toast } from "react-toastify";
import { updateFreelancerAPI } from "../../services/allAPI";

function SettingsPanel() {
  const [preview, setPreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [clientData, setClientData] = useState({
    freelancerName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    profile: null,
  });

  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setClientData({ ...clientData, profile: file });
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();

      // Always update these
      formData.append("freelancerName", clientData.freelancerName);
      formData.append("phone", clientData.phone);
      formData.append("role", clientData.role);

      // Update image only if changed
      if (clientData.profile instanceof File) {
        formData.append("profile", clientData.profile);
      }

      // Update password ONLY if user opted to change
      if (forgotPassword && clientData.password) {
        formData.append("password", clientData.password);
      }

      const result = await updateFreelancerAPI(formData, reqHeader);
      const updatedUser = result.data;

      sessionStorage.setItem(
        "loggedUserDetails",
        JSON.stringify(updatedUser)
      );

      setClientData({
        freelancerName: updatedUser.freelancerName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profile: updatedUser.profile,
        password: updatedUser.password,
      });

      setPreview("");
      setEditMode(false);
      setForgotPassword(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Profile update failed");
    }
  };


  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    if (loggedUser) {
      setClientData({
        freelancerName: loggedUser.freelancerName,
        email: loggedUser.email,
        phone: loggedUser.phone,
        role: loggedUser.role,
        profile: loggedUser.profile,
        password: loggedUser.password,
      });
    }
  }, []);

  useEffect(() => {
    editMode && toast.info("Click profile image to change");
  }, [editMode]);



  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 text-white">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Profile Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your personal information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* PROFILE */}
          <div className="flex flex-col items-center text-center">
            <label className="relative group cursor-pointer">
              {editMode && (
                <input type="file" hidden onChange={handleImageUpload} />
              )}

              <img
                src={
                  preview
                    ? preview
                    : clientData.profile
                      ? `${serverURL}/ProfileImageUploads/${clientData.profile}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        clientData.freelancerName || "User"
                      )}&background=3B82F6&color=fff&size=256`
                }
                alt="profile"
                className="w-44 h-44 rounded-full object-cover border-4 border-blue-500 shadow-xl group-hover:opacity-80 transition"
              />

              {editMode && (
                <span className="absolute inset-0 bg-black/50 text-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
                  Change Image
                </span>
              )}
            </label>

            <h2 className="mt-5 text-xl font-semibold">
              {clientData.freelancerName}
            </h2>
            <p className="text-gray-400">{clientData.role}</p>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-4">
                {["freelancerName", "email", "password"].map((field) => (
                  <div key={field} className="relative">
                    <label className="block text-sm text-gray-300 mb-1 capitalize">
                      {field}
                    </label>

                    <input
                      type={
                        field === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : "text"
                      }
                      value={clientData[field]}
                      readOnly={!editMode}
                      onChange={(e) =>
                        setClientData({
                          ...clientData,
                          [field]: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 pr-12 rounded-xl bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition ${!editMode && "cursor-not-allowed opacity-70"
                        }`}
                    />

                    {field === "password" && editMode && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-sm text-gray-400 hover:text-white"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>
                ))}

                {editMode && (
                  <button
                    onClick={() => setForgotPassword(!forgotPassword)}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Change password?
                  </button>
                )}
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    value={clientData.phone}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setClientData({ ...clientData, phone: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition ${!editMode && "cursor-not-allowed opacity-70"
                      }`}
                  />
                </div>

                {forgotPassword && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      onChange={(e) =>
                        setClientData({
                          ...clientData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-6 mt-12">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-105 transition font-semibold shadow-lg"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdateUser}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold shadow-lg"
              >
                Update
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-8 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition font-semibold shadow-lg"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
