import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  X,
  Trash2Icon,
} from "lucide-react";
import {
  addClientAPI,
  deleteFreelancerClientAPI,
  getAllClientsAPI,
  sendCodeAPI,
} from "../../services/allAPI";
import Chat from "../../common/components/Chat";
import { toast } from "react-toastify";

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
  const [openChat, setOpenChat] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [addingClient, setAddingClient] = useState(false);

  const [clientData, setClientData] = useState({
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
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* ---------------- FILTER ---------------- */
  useEffect(() => {
    let result = [...clients];

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClients(result);
  }, [searchTerm, clients]);

  /* ---------------- ADD CLIENT ---------------- */
  const handleAddClient = async () => {
    if (!clientData.clientName || !clientData.clientMail) {
      toast.warn("Client name and email are required");
      return;
    }

    try {
      setAddingClient(true);

      const result = await addClientAPI(clientData, reqHeader);

      if (result.status === 200) {
        await sendCodeAPI({ email: clientData.clientMail });

        toast.success(
          "Client added successfully & verification code sent"
        );

        setClientData({
          clientName: "",
          clientMail: "",
          clientPhone: "",
        });

        setOpenAddClient(false);
        fetchClients();
      } else if (result.status === 404) {
        toast.warn("Client already exists");
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to add client");
    } finally {
      setAddingClient(false);
    }
  };

  /* ---------------- DELETE CLIENT ---------------- */
  const handleDeleteClient = async (client) => {
    if (!window.confirm("Are you sure you want to delete this client?"))
      return;

    try {
      const res = await deleteFreelancerClientAPI(
        client._id,
        reqHeader
      );
      if (res.status === 200) {
        toast.success("Client deleted");
        fetchClients();
      }
    } catch {
      toast.error("Failed to delete client");
    }
  };

  /* ---------------- MODAL UX ---------------- */
  useEffect(() => {
    document.body.style.overflow =
      openAddClient || openChat ? "hidden" : "auto";
  }, [openAddClient, openChat]);

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") {
        setOpenAddClient(false);
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
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-6 py-6 sm:py-8 rounded-2xl">
      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Clients</h1>
          <p className="text-gray-400 mt-1">
            Manage and chat with your clients
          </p>
        </div>

        <button
          onClick={() => setOpenAddClient(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium"
        >
          + Add Client
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 bg-[#222938]/10 border border-white/5 rounded-2xl p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients..."
            className="w-full bg-[#222938] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#222938] border border-white/5 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-[#0F1525] text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Contact</th>
              {/* <th className="px-6 py-4 text-left">Status</th> */}
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client._id}
                className="border-t border-white/5 hover:bg-white/10 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold uppercase">
                      {client.username?.slice(0, 2)}
                    </div>
                    {client.username}
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

                {/* <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-500/10">
                    {client.status}
                  </span>
                </td> */}

                <td className="px-6 py-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setOpenChat(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client)}
                      className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            No clients found
          </div>
        )}
      </div>

      {/* CHAT MODAL */}
      {openChat && selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-4xl h-[80vh] bg-[#0B0F19] rounded-2xl relative">
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

      {/* ADD CLIENT MODAL */}
      {openAddClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-md bg-[#0B0F19] rounded-2xl p-6 relative">
            <button
              onClick={() => setOpenAddClient(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add Client</h2>

            <div className="space-y-4">
              <input
                placeholder="Client Name"
                value={clientData.clientName}
                onChange={(e) =>
                  setClientData({
                    ...clientData,
                    clientName: e.target.value,
                  })
                }
                className="w-full input"
              />
              <input
                placeholder="Email"
                value={clientData.clientMail}
                onChange={(e) =>
                  setClientData({
                    ...clientData,
                    clientMail: e.target.value,
                  })
                }
                className="w-full input"
              />
              <input
                placeholder="Phone"
                value={clientData.clientPhone}
                onChange={(e) =>
                  setClientData({
                    ...clientData,
                    clientPhone: e.target.value,
                  })
                }
                className="w-full input"
              />

              <button
                disabled={addingClient}
                onClick={handleAddClient}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {addingClient ? "Adding..." : "Add Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientPanel;
