import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
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
  const input = "w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-600 outline-none"
  const [editRow, setEditRow] = useState(null);
  const [editingData, setEditingData] = useState({});
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

  const loggedUser = JSON.parse(sessionStorage.getItem('loggedUserDetails'))
  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  /* ---------------- FETCH DATA ---------------- */
  const getAllProjects = async () => {
    try {
      const res = await getAllProjectsAPI(reqHeader);
      setAllProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllClients = async () => {
    try {
      const res = await getAllClientsAPI(reqHeader);
      setAllClients(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loggedUser) {
      setNewProject({ ...newProject, freelancerMail: loggedUser.email })
    }
    if (token) {
      getAllProjects();
      getAllClients();
    }
  }, [token]);

  /* ---------------- ADD PROJECT ---------------- */
  const handleAddProject = async () => {
    if (!newProject.projectName || !newProject.clientMail) {
      toast.warn("Project name and client are required");
      return;
    }

    try {
      setAddingProject(true);
      const res = await addProjectAPI(newProject, reqHeader);

      if (res.status === 200) {
        toast.success("Project added successfully");
        setOpenModal(false);
        setNewProject({
          projectName: "",
          clientMail: "",
          projectStatus: "Pending",
          projectDeadline: "",
          projectAmount: "",
          projectDescription: "",
        });
        getAllProjects();
      }
    } catch (err) {
      toast.error("Failed to add project");
    } finally {
      setAddingProject(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await deleteFreelancerProjectAPI(projectId, reqHeader);
      if (res.status === 200) {
        toast.success("Project deleted");
        getAllProjects();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEditClick = (project) => {
    setEditRow(project._id);
    setEditingData({
      projectName: project.projectName,
      clientMail: project.clientMail,
      projectStatus: project.projectStatus,
      projectDeadline: project.projectDeadline
        ? new Date(project.projectDeadline).toISOString().split("T")[0]
        : "",
      projectAmount: project.projectAmount || "",
    });
  };

  const handleSaveEdit = async (projectId) => {
    if (!editingData.projectName) return toast.warn("Project name required");

    setIsLoading(true);
    try {
      const res = await updateFreelancerProjectAPI(
        projectId,
        editingData,
        reqHeader
      );
      if (res.status === 200) {
        setEditRow(null);
        setEditingData({});
        getAllProjects();
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Completed: "bg-green-900/30 text-green-400",
      "In Progress": "bg-blue-900/30 text-blue-400",
      Pending: "bg-yellow-900/30 text-yellow-400",
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
      <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
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
        <div className="overflow-x-auto border border-gray-800 bg-[#222938] rounded-xl">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#0F1525]">
              <tr>
                {["Project", "Client", "Status", "Deadline", "Amount", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-gray-300 text-sm">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allProjects.map((project) => {
                const isEditing = editRow === project._id;
                return (
                  <tr key={project._id} className="border-t border-white/5 hover:bg-white/10 transition">
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          className="input"
                          value={editingData.projectName}
                          onChange={(e) =>
                            setEditingData({ ...editingData, projectName: e.target.value })
                          }
                        />
                      ) : (
                        project.projectName
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          className="input"
                          value={editingData.clientMail}
                          onChange={(e) =>
                            setEditingData({ ...editingData, clientMail: e.target.value })
                          }
                        >
                          <option value="">Select Client</option>
                          {allClients.map((c) => (
                            <option key={c._id} value={c.email}>
                              {c.username} ({c.email})
                            </option>
                          ))}
                        </select>
                      ) : (
                        project.clientMail
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          className="input"
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
                        getStatusBadge(project.projectStatus)
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="date"
                          className="input"
                          value={editingData.projectDeadline}
                          onChange={(e) =>
                            setEditingData({ ...editingData, projectDeadline: e.target.value })
                          }
                        />
                      ) : (
                        project.projectDeadline
                          ? new Date(project.projectDeadline).toLocaleDateString()
                          : "—"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          className="input"
                          value={editingData.projectAmount}
                          onChange={(e) =>
                            setEditingData({ ...editingData, projectAmount: e.target.value })
                          }
                        />
                      ) : (
                        project.projectAmount ? `₹${project.projectAmount}` : "—"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(project._id)}
                            className="btn-success"
                            disabled={isLoading}
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            onClick={() => setEditRow(null)}
                            className="btn-secondary"
                          >
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(project)}
                            className="btn-edit"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="btn-delete"
                          >
                            <Trash2 size={16} /> Delete
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
              <input
                className={input}
                placeholder="Project Name"
                value={newProject.projectName}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectName: e.target.value })
                }
              />

              <select
                className={input}
                value={newProject.clientMail}
                onChange={(e) =>
                  setNewProject({ ...newProject, clientMail: e.target.value })
                }
              >
                <option value="">Select Client</option>
                {allClients.map((c) => (
                  <option key={c._id} value={c.email}>
                    {c.username} ({c.email})
                  </option>
                ))}
              </select>

              <input
                className={`${input} read-only:`}
                readOnly='true'
                value={'Pending'}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectStatus: 'Pending' })
                }
              />

              <input
                type="date"
                className={input}
                value={newProject.projectDeadline}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectDeadline: e.target.value })
                }
              />

              <input
                type="number"
                className={input}
                placeholder="Amount"
                value={newProject.projectAmount}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectAmount: e.target.value })
                }
              />

              <textarea
                className={input}
                rows="3"
                placeholder="Description"
                value={newProject.projectDescription}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectDescription: e.target.value })
                }
              />

              <button
                onClick={handleAddProject}
                disabled={addingProject}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl text-white disabled:opacity-50"
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
