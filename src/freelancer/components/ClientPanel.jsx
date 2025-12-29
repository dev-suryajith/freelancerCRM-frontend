import React, { useEffect, useState } from "react";
import { Mail, Phone, Search, X } from "lucide-react";
import {
  addClientAPI,
  deleteFreelancerClientAPI,
  getAllClientsAPI,
  sendCodeAPI,
  updateClientAPI,
} from "../../services/allAPI";
import Chat from "../../common/components/Chat";
import { toast } from "react-toastify";
import serverURL from "../../services/serverURL";

function ClientPanel() {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
  const token = sessionStorage.getItem("token");

  const reqHeader = {
    Authorization: `Bearer ${token}`,
  };

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [openAddClient, setOpenAddClient] = useState(false);
  const [openEditClient, setOpenEditClient] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);

  const [clientData, setClientData] = useState({
    clientName: "",
    clientMail: "",
    clientPhone: "",
  });

  const [editData, setEditData] = useState({
    clientId: "",
    clientName: "",
    clientMail: "",
    clientPhone: "",
  });

  /* ---------------- FETCH CLIENTS ---------------- */
  const fetchClients = async () => {
    try {
      const res = await getAllClientsAPI(reqHeader);
      if (res.status === 200) {
        setClients(res.data);
        setFilteredClients(res.data);
      }
    } catch (err) {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* ---------------- FILTER ---------------- */
  useEffect(() => {
    const result = clients.filter(
      (c) =>
        c.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(result);
  }, [searchTerm, clients]);

  /* ---------------- ADD CLIENT ---------------- */
  const handleAddClient = async () => {
    if (!clientData.clientName || !clientData.clientMail) {
      toast.warn("Client name and email are required");
      return;
    }

    try {
      const res = await addClientAPI(clientData, reqHeader);
      if (res.status === 200) {
        await sendCodeAPI({ email: clientData.clientMail });
        toast.success("Client added & verification sent");
        setClientData({ clientName: "", clientMail: "", clientPhone: "" });
        setOpenAddClient(false);
        fetchClients();
      }
    } catch {
      toast.error("Failed to add client");
    }
  };

  /* ---------------- UPDATE CLIENT (BODY + HEADER ONLY) ---------------- */
  const handleEditClient = async () => {
    try {
      const res = await updateClientAPI(editData, reqHeader);
      if (res.status === 200) {
        toast.success("Client updated");
        setOpenEditClient(false);
        fetchClients();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  /* ---------------- DELETE CLIENT ---------------- */
  const handleDeleteClient = async (client) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      const res = await deleteFreelancerClientAPI(client._id, reqHeader);
      if (res.status === 200) {
        toast.success("Client deleted");
        fetchClients();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- ESC CLOSE ---------------- */
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") {
        setOpenAddClient(false);
        setOpenEditClient(false);
        setOpenChat(false);
      }
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-gray-400">
        Loading clients...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 px-4 sm:px-6 py-6 rounded-2xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and chat with clients
          </p>
        </div>

        <button
          onClick={() => setOpenAddClient(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm"
        >
          + Add Client
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#222938] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block bg-[#222938] border border-white/5 rounded-2xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0F1525] text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Actions</th>
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
                    <div className="w-10 h-10 rounded-full bg-indigo-600 overflow-hidden flex items-center justify-center font-semibold">
                      {client.profile ? (
                        <img
                          src={`${serverURL}/ProfileImageUploads/${client.profile}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        client.username?.slice(0, 2)
                      )}
                    </div>
                    <span className="font-medium">{client.username}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} /> {client.phone || "N/A"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditData({
                          clientId: client._id,
                          clientName: client.username,
                          clientMail: client.email,
                          clientPhone: client.phone || "",
                        });
                        setOpenEditClient(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setOpenChat(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm"
                    >
                      Chat
                    </button>

                    <button
                      onClick={() => handleDeleteClient(client)}
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden space-y-4">
        {filteredClients.map((client) => (
          <div
            key={client._id}
            className="bg-[#222938] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 overflow-hidden flex items-center justify-center font-semibold">
                {client.profile ? (
                  <img
                    src={`${serverURL}/ProfileImageUploads/${client.profile}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  client.username?.slice(0, 2)
                )}
              </div>
              <div>
                <p className="font-semibold">{client.username}</p>
                <p className="text-xs text-gray-400">{client.email}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              📞 {client.phone || "N/A"}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditData({
                    clientId: client._id,
                    clientName: client.username,
                    clientMail: client.email,
                    clientPhone: client.phone || "",
                  });
                  setOpenEditClient(true);
                }}
                className="flex-1 py-2 rounded-lg bg-yellow-500 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setSelectedClient(client);
                  setOpenChat(true);
                }}
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-sm"
              >
                Chat
              </button>
            </div>

            <button
              onClick={() => handleDeleteClient(client)}
              className="w-full mt-2 py-2 rounded-lg bg-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          No clients found
        </div>
      )}

      {/* CHAT MODAL */}
      {openChat && selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[80vh] bg-[#0B0F19] rounded-2xl relative flex flex-col">
            <button
              onClick={() => setOpenChat(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X />
            </button>

            <Chat
              currentUserId={loggedUser._id}
              otherUserId={selectedClient._id}
            />
          </div>
        </div>
      )}

      {/* EDIT CLIENT MODAL */}
      {openEditClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-hidden p-4">
          <div className="w-full max-w-md bg-[#0B0F19] rounded-2xl p-6 relative">
            <button
              onClick={() => setOpenEditClient(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Client</h2>

            <div className="space-y-4">
              <input
                placeholder="Client Name"
                value={editData.clientName}
                onChange={(e) =>
                  setEditData({ ...editData, clientName: e.target.value })
                }
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2"
              />
              <input
                placeholder="Email"
                value={editData.clientMail}
                onChange={(e) =>
                  setEditData({ ...editData, clientMail: e.target.value })
                }
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2"
              />
              <input
                placeholder="Phone"
                value={editData.clientPhone}
                onChange={(e) =>
                  setEditData({ ...editData, clientPhone: e.target.value })
                }
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2"
              />

              <button
                onClick={handleEditClient}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                Update Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientPanel;
