import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ImUserTie } from "react-icons/im";
import {
  adminGetAllFreelancersAPI,
  deleteFreelancerAPI,
} from "../../services/allAPI";
import serverURL from "../../services/serverURL";
import { X } from "lucide-react";

function Admin_Freelancer() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [freelancers, setFreelancers] = useState([]);

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const getAllFreelancers = async () => {
    try {
      const result = await adminGetAllFreelancersAPI(reqHeader);
      if (result.status === 200 && Array.isArray(result.data)) {
        setFreelancers(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (freelancerId) => {
    if (!window.confirm("Delete this freelancer?")) return;
    try {
      const result = await deleteFreelancerAPI(freelancerId, reqHeader);
      if (result.status === 200) getAllFreelancers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) getAllFreelancers();
  }, [token]);

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ImUserTie className="text-indigo-400" />
          Freelancers
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium"
        >
          + Add Freelancer
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search freelancer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0F172A] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Freelancer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {freelancers
          .filter((f) =>
            f.freelancerName?.toLowerCase().includes(search.toLowerCase())
          )
          .map((f) => (
            <div
              key={f._id}
              className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)] transition"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    f.profile
                      ? `${serverURL}/ProfileImageUploads/${f.profile}`
                      : `https://api.dicebear.com/9.x/initials/svg?seed=${f.freelancerName}`
                  }
                  alt="avatar"
                  className="w-14 h-14 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <h2 className="font-semibold text-white">
                    {f.freelancerName}
                  </h2>
                  <p className="text-sm text-gray-400">{f.email}</p>
                </div>
              </div>

              {/* Details */}
              <div className="flex justify-between text-sm text-gray-300 mb-4">
                <p>
                  📞 <span className="font-medium">{f.phone || "—"}</span>
                </p>
                <p>
                  📁 Projects:{" "}
                  <span className="font-medium">
                    {f.projectList?.length || 0}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition text-sm">
                  View Profile
                </button>

                <button
                  onClick={() => handleDelete(f._id)}
                  className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Add Freelancer Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-white/5 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-6">
              Add Freelancer
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Freelancer Name"
                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium">
                Save Freelancer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin_Freelancer;
