import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  X
} from "lucide-react";
import { getAllClientsAPI } from "../../services/allAPI";
import Chat from "../../common/components/Chat";

function ClientPanel() {
  const loggedUser = JSON.parse(
    sessionStorage.getItem("loggedUserDetails")
  );
  const token = sessionStorage.getItem("token");

  const reqHeader = {
    Authorization: `Bearer ${token}`,
  };

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // 🔹 Chat modal state
  const [openChat, setOpenChat] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await getAllClientsAPI(reqHeader);
        if (res.status === 200) {
          setClients(res.data);
          setFilteredClients(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch clients", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients
  useEffect(() => {
    let result = [...clients];

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    setFilteredClients(result);
  }, [searchTerm, statusFilter, clients]);

  const statusStyles = {
    active: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    inactive: "bg-gray-500/10 text-gray-400 ring-gray-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  };

  const openChatModal = (client) => {
    setSelectedClient(client);
    setOpenChat(true);
  };

  const closeChatModal = () => {
    setOpenChat(false);
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-gray-400">
        Loading clients...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-gray-400 mt-1">
          Manage and chat with your clients
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#121826] border border-white/5 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients..."
            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#121826] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0F1525] text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client._id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold uppercase">
                      {client.username?.charAt(0)}
                    </div>
                    <p className="font-semibold">{client.username}</p>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {client.phone || "N/A"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs rounded-full ring-1 ${
                      statusStyles[client.status] ||
                      statusStyles.inactive
                    }`}
                  >
                    {client.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => openChatModal(client)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    <MessageSquare size={16} />
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No clients found
          </div>
        )}
      </div>

      {/* CHAT MODAL */}
      {openChat && selectedClient && (
        <div className="fixed inset-0 z-50  backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-4xl h-[80vh]  rounded-2xl shadow-2xl relative overflow-hidden">
            <button
              onClick={closeChatModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <Chat
              currentUserId={loggedUser._id}
              otherUserId={selectedClient._id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientPanel;
