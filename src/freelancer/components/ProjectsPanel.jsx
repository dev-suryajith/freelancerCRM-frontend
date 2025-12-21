import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  X,
  Save,
  Plus,
} from "lucide-react";
import {
  deleteFreelancerProjectAPI,
  getAllClientsAPI,
  getAllProjectsAPI,
  updateFreelancerProjectAPI,
  addProjectAPI,
} from "../../services/allAPI";
import { toast } from "react-toastify";

function ProjectsPanel() {
  const input =
    "w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-600 outline-none";

  const [editRow, setEditRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingProject, setAddingProject] = useState(false);

  const [newProject, setNewProject] = useState({
    freelancerMail: "",
    projectName: "",
    clientMail: "",
    projectStatus: "Pending",
    projectDeadline: "",
    projectAmount: "",
    projectDescription: "",
  });

  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- FETCH ---------------- */
  const getAllProjects = async () => {
    const res = await getAllProjectsAPI(reqHeader);
    setAllProjects(Array.isArray(res.data) ? res.data : []);
  };

  const getAllClients = async () => {
    const res = await getAllClientsAPI(reqHeader);
    setAllClients(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    if (loggedUser) {
      setNewProject((p) => ({ ...p, freelancerMail: loggedUser.email }));
    }
    if (token) {
      getAllProjects();
      getAllClients();
    }
  }, [token]);

  /* ---------------- ADD PROJECT ---------------- */
  const handleAddProject = async () => {
    if (!newProject.projectName || !newProject.clientMail) {
      return toast.warn("Project name and client required");
    }

    try {
      setAddingProject(true);
      const res = await addProjectAPI(newProject, reqHeader);
      if (res.status === 200) {
        toast.success("Project added");
        setOpenModal(false);
        setNewProject({
          ...newProject,
          projectName: "",
          clientMail: "",
          projectDeadline: "",
          projectAmount: "",
          projectDescription: "",
        });
        getAllProjects();
      }
    } catch {
      toast.error("Failed to add project");
    } finally {
      setAddingProject(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteFreelancerProjectAPI(id, reqHeader);
    toast.success("Project deleted");
    getAllProjects();
  };

  /* ---------------- EDIT ---------------- */
  const handleEditClick = (project) => {
    const snapshot = {
      projectName: project.projectName,
      clientMail: project.clientMail,
      projectStatus: project.projectStatus,
      projectDeadline: project.projectDeadline
        ? new Date(project.projectDeadline).toISOString().split("T")[0]
        : "",
      projectAmount: project.projectAmount || "",
    };

    setEditRow(project._id);
    setEditingData(snapshot);
    setOriginalData(snapshot);
  };

  const handleCancelEdit = () => {
    setEditingData(originalData);
    setEditRow(null);
    setOriginalData(null);
  };

  const handleSaveEdit = async (id) => {
    setIsLoading(true);
    try {
      await updateFreelancerProjectAPI(id, editingData, reqHeader);
      toast.success("Project updated");
      setEditRow(null);
      setOriginalData(null);
      getAllProjects();
    } catch {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      Pending: "bg-yellow-900/30 text-yellow-400",
      "In Progress": "bg-blue-900/30 text-blue-400",
      Completed: "bg-green-900/30 text-green-400",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      {/* HEADER */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-gray-400 text-sm">Manage all projects</p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-white"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#0F1525]">
              <tr>
                {["Project", "Client", "Status", "Deadline", "Amount", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-gray-300 text-sm">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allProjects.map((p) => {
                const editing = editRow === p._id;
                return (
                  <tr
                    key={p._id}
                    className={`border-t border-white/5 ${
                      editing
                        ? "bg-indigo-500/10 ring-1 ring-indigo-500/40"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <td className="px-6 py-4">
                      {editing ? (
                        <input
                          className={input}
                          value={editingData.projectName}
                          onChange={(e) =>
                            setEditingData({ ...editingData, projectName: e.target.value })
                          }
                        />
                      ) : (
                        p.projectName
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editing ? (
                        <select
                          className={input}
                          value={editingData.clientMail}
                          onChange={(e) =>
                            setEditingData({ ...editingData, clientMail: e.target.value })
                          }
                        >
                          <option value="">Select client</option>
                          {allClients.map((c) => (
                            <option key={c._id} value={c.email}>
                              {c.username}
                            </option>
                          ))}
                        </select>
                      ) : (
                        p.clientMail
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editing ? (
                        <select
                          className={input}
                          value={editingData.projectStatus}
                          onChange={(e) =>
                            setEditingData({ ...editingData, projectStatus: e.target.value })
                          }
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      ) : (
                        statusBadge(p.projectStatus)
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editing ? (
                        <input
                          type="date"
                          className={input}
                          value={editingData.projectDeadline}
                          onChange={(e) =>
                            setEditingData({ ...editingData, projectDeadline: e.target.value })
                          }
                        />
                      ) : (
                        p.projectDeadline
                          ? new Date(p.projectDeadline).toLocaleDateString()
                          : "—"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editing ? (
                        <input
                          type="number"
                          className={input}
                          value={editingData.projectAmount}
                          onChange={(e) =>
                            setEditingData({ ...editingData, projectAmount: e.target.value })
                          }
                        />
                      ) : (
                        `₹${p.projectAmount || "—"}`
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(p._id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save size={16} />
                            {isLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            disabled={editRow !== null}
                            onClick={() => handleEditClick(p)}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p._id)}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PROJECT MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Add Project</h3>
              <button onClick={() => setOpenModal(false)}>
                <X className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <input className={input} placeholder="Project Name"
                value={newProject.projectName}
                onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
              />

              <select className={input}
                value={newProject.clientMail}
                onChange={(e) => setNewProject({ ...newProject, clientMail: e.target.value })}
              >
                <option value="">Select Client</option>
                {allClients.map((c) => (
                  <option key={c._id} value={c.email}>{c.username}</option>
                ))}
              </select>

              <input type="date" className={input}
                value={newProject.projectDeadline}
                onChange={(e) => setNewProject({ ...newProject, projectDeadline: e.target.value })}
              />

              <input type="number" className={input} placeholder="Amount"
                value={newProject.projectAmount}
                onChange={(e) => setNewProject({ ...newProject, projectAmount: e.target.value })}
              />

              <textarea className={input} rows="3" placeholder="Description"
                value={newProject.projectDescription}
                onChange={(e) => setNewProject({ ...newProject, projectDescription: e.target.value })}
              />

              <button
                onClick={handleAddProject}
                disabled={addingProject}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl text-white"
              >
                {addingProject ? "Adding..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectsPanel;
