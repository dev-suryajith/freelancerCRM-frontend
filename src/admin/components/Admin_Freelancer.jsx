import React, { useEffect, useState } from "react";
import { FaSearch, FaUserTie } from "react-icons/fa";
import { adminGetAllFreelancersAPI, deleteFreelancerAPI } from "../../services/allAPI";
import serverURL from "../../services/serverURL";

function Admin_Freelancer() {
  const [openChat, setOpenChat] = useState(false);
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
    try {
      const result = await deleteFreelancerAPI(freelancerId, reqHeader);
      if (result.status === 200) {
        getAllFreelancers()
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (token) getAllFreelancers();
  }, [token]);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <FaUserTie className="text-blue-600" /> Freelancers
      </h1>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search freelancer..."
            className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full flex justify-end">
          <button
            onClick={() => setOpenChat(true)}
            className="bg-blue-600 px-5 py-3 rounded-lg text-white font-semibold"
          >
            Add Freelancer
          </button>
        </div>
      </div>

      {/* Freelancer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {freelancers
          .filter((f) =>
            f.freelancerName
              ?.toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((f) => (
            <div
              key={f._id}
              className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    f.profile
                      ? `${serverURL}/ProfileImageUploads/${f.profile}`
                      : `https://api.dicebear.com/9.x/avataaars/svg?seed=${f.freelancerName}`
                  }
                  alt="avatar"
                  className="w-16 h-16 rounded-full border object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {f.freelancerName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {f.email}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="flex justify-between text-sm mt-4 mb-4">
                <p>
                  📞 <span className="font-semibold">{f.phone}</span>
                </p>
                <p>
                  📁 Projects:{" "}
                  <span className="font-semibold">
                    {f.projectList?.length || 0}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex justify-between">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition">
                  View Profile
                </button>

                <button onClick={() => handleDelete(f._id)} className="px-4 py-2 text-sm rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Add Freelancer Modal */}
      {openChat && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpenChat(false)}
              className="absolute top-3 right-3 text-gray-500 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Add Freelancer
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Freelancer Name"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin_Freelancer;
