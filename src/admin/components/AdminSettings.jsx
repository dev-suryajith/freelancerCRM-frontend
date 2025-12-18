import React, { useEffect, useState } from "react";
import serverURL from "../../services/serverURL";
import { editAdminAPI } from "../../services/allAPI";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

function AdminSettings() {
  const [preview, setPreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "Admin",
    password: "",
    profile: null,
  });

  const loggedUser = JSON.parse(
    sessionStorage.getItem("loggedUserDetails")
  );
  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setAdminData((prev) => ({ ...prev, profile: file }));
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();

      Object.entries(adminData).forEach(([key, value]) => {
        if (value && key !== "password") {
          formData.append(key, value);
        }
      });

      if (adminData.password) {
        formData.append("password", adminData.password);
      }

      const result = await editAdminAPI(formData, reqHeader);
      const updatedUser = result.data?.updatedUser || result.data;

      sessionStorage.setItem(
        "loggedUserDetails",
        JSON.stringify(updatedUser)
      );

      setAdminData(updatedUser);
      setPreview("");
      setEditMode(false);

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    if (loggedUser) {
      setAdminData((prev) => ({ ...prev, ...loggedUser }));
    }
  }, []);

  useEffect(() => {
    if (editMode) toast.info("Click profile image to change");
  }, [editMode]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Admin Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your admin profile and credentials
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-8">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* PROFILE */}
          <div className="flex flex-col items-center text-center">
            <label className="relative group cursor-pointer">
              {editMode && (
                <input
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />
              )}

              <img
                src={
                  preview
                    ? preview
                    : adminData?.profile
                    ? `${serverURL}/ProfileImageUploads/${adminData.profile}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        adminData?.username || "Admin"
                      )}&background=6366F1&color=fff&size=256`
                }
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500 shadow-lg transition group-hover:opacity-80"
              />

              {editMode && (
                <span className="absolute inset-0 bg-black/50 text-sm text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
                  Change Image
                </span>
              )}
            </label>

            <h2 className="mt-5 text-lg font-semibold text-white">
              {adminData?.username}
            </h2>
            <p className="text-gray-400 text-sm">
              {adminData?.role}
            </p>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Username
                  </label>
                  <input
                    value={adminData.username || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setAdminData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#020617] border border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none ${
                      !editMode &&
                      "cursor-not-allowed opacity-70"
                    }`}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block text-sm text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminData.password || ""}
                    readOnly={!editMode}
                    onChange={(e) =>
                      setAdminData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-[#020617] border border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none ${
                      !editMode &&
                      "cursor-not-allowed opacity-70"
                    }`}
                  />

                  {editMode && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-9 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                {["email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-400 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      value={adminData[field] || ""}
                      readOnly={!editMode}
                      onChange={(e) =>
                        setAdminData((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#020617] border border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none ${
                        !editMode &&
                        "cursor-not-allowed opacity-70"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-6 mt-12">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-semibold shadow-lg"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdateUser}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition text-sm font-semibold shadow-lg"
              >
                Update
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-8 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition text-sm font-semibold shadow-lg"
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

export default AdminSettings;
