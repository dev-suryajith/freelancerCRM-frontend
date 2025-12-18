import React, { useEffect, useState } from "react";
import serverURL from "../../services/serverURL";
import { editUserAPI } from "../../services/allAPI";
import { toast } from "react-toastify";

function ClientSettings() {
  const [preview, setPreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const [clientData, setClientData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    freelancerMail: "",
    password: "",
    confirmPassword: "",
    profile: null,
  });

  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
  const token = sessionStorage.getItem("token");

  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- IMAGaE UPLOAD ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setClientData({ ...clientData, profile: file });
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateUser = async () => {
    try {
      if (
        forgotPassword &&
        clientData.password !== clientData.confirmPassword
      ) {
        return toast.error("Passwords do not match");
      }

      const formData = new FormData();

      Object.entries(clientData).forEach(([key, value]) => {
        if (value && key !== "confirmPassword") {
          formData.append(key, value);
        }
      });

      const result = await editUserAPI(formData, reqHeader);

      const updatedUser = result.data?.updatedUser || result.data;


      sessionStorage.setItem(
        "loggedUserDetails",
        JSON.stringify(updatedUser)
      );

      setClientData(updatedUser);
      setPreview("");

      toast.success("Profile updated successfully");
      setEditMode(false);
      setForgotPassword(false);
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    if (loggedUser) setClientData(loggedUser);
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
          <h1 className="text-4xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your personal information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* PROFILE CARD */}
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
                        clientData.username || "User"
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
              {clientData.username}
            </h2>
            <p className="text-gray-400">{clientData.role || "Client"}</p>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-4">
                {["username", "email", "password"].map((field, i) => (
                  <div key={i} className="relative">
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
                      className={`w-full px-4 py-3 pr-12 rounded-xl bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition
        ${!editMode && "cursor-not-allowed opacity-70"}`}
                    />

                    {/* SHOW / HIDE BUTTON */}
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
                    Forgot password?
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
                    className={`w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition
                      ${!editMode && "cursor-not-allowed opacity-70"}`}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Freelancer Email
                  </label>
                  <input
                    value={clientData.freelancerMail || "Not assigned"}
                    readOnly
                    className={`w-full px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition
                      ${!editMode && "cursor-not-allowed opacity-70"}`}
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

        {/* ACTION BUTTONS */}
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

export default ClientSettings;
