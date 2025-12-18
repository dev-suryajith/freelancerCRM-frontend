import React, { useEffect, useState } from "react";
import serverURL from "../../services/serverURL";
import { editAdminAPI } from "../../services/allAPI";
import { toast } from "react-toastify";

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

    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
    const token = sessionStorage.getItem("token");
    const reqHeader = { Authorization: `Bearer ${token}` };

    /* ---------------- IMAGE UPLOAD ---------------- */
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setAdminData((prev) => ({ ...prev, profile: file }));
    };

    /* ---------------- UPDATE PROFILE ---------------- */
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

            toast.success("Profile updated successfully");
            setEditMode(false);
            // setForgotPassword(false);
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

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen  px-4 py-10">
            <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-xl p-8 text-gray-800">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Admin Profile Settings
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Manage your admin account details
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
                                        : adminData?.profile
                                            ? `${serverURL}/ProfileImageUploads/${adminData.profile}`
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                adminData?.username || "Admin"
                                            )}&background=4F46E5&color=fff&size=256`
                                }
                                alt="profile"
                                className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow-lg group-hover:opacity-80 transition"
                            />

                            {editMode && (
                                <span className="absolute inset-0 bg-black/40 text-sm text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
                                    Change Image
                                </span>
                            )}
                        </label>

                        <h2 className="mt-5 text-xl font-semibold">
                            {adminData?.username}
                        </h2>
                        <p className="text-gray-500">{adminData?.role}</p>
                    </div>

                    {/* FORM */}
                    <div className="lg:col-span-2">
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* LEFT */}
                            <div className="space-y-4">
                                {["username", "password"].map((field) => (
                                    <div key={field} className="relative">
                                        <label className="block text-sm text-gray-600 mb-1 capitalize">
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
                                            value={adminData[field] || ""}
                                            readOnly={!editMode}
                                            onChange={(e) =>
                                                setAdminData((prev) => ({
                                                    ...prev,
                                                    [field]: e.target.value,
                                                }))
                                            }
                                            className={`w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition ${!editMode && "cursor-not-allowed bg-gray-100"
                                                }`}
                                        />

                                        {field === "password" && editMode && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-900"
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT */}
                            <div className="space-y-4">
                                {["email", "phone"].map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm text-gray-600 mb-1 capitalize">
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
                                            className={`w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition ${!editMode && "cursor-not-allowed bg-gray-100"
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-center gap-6 mt-12">
                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-8 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition font-semibold shadow-lg"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleUpdateUser}
                                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition font-semibold shadow-lg"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="px-8 py-3 rounded-xl bg-gray-400 hover:bg-gray-500 text-white transition font-semibold shadow-lg"
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
