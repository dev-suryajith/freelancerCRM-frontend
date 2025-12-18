import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, AlertCircle, Edit2, Trash2, X, Save } from "lucide-react";
import {
  deleteFreelancerProjectAPI,
  getAllProjectsAPI,
  updateFreelancerProjectAPI
} from "../../services/allAPI";
import AddProjectForm from "./AddProjectForm";

function ProjectsPanel() {
  const [editRow, setEditRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const reqHeader = { Authorization: `Bearer ${token}` };

  const getAllProjects = async () => {
    try {
      const res = await getAllProjectsAPI(reqHeader);
      setAllProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await deleteFreelancerProjectAPI(projectId, reqHeader);
      if (res.status === 200) {
        getAllProjects();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (project) => {
    setEditRow(project._id);
    setEditingData({
      projectName: project.projectName,
      projectDescription: project.projectDescription || "",
      projectStatus: project.projectStatus,
      projectDeadline: project.projectDeadline ? 
        new Date(project.projectDeadline).toISOString().split('T')[0] : "",
      projectAmount: project.projectAmount || "",
      clientMail: project.clientMail || ""
    });
  };

  const handleSaveEdit = async (projectId) => {
    if (!editingData.projectName?.trim()) {
      alert("Project name is required");
      return;
    }

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
    } catch (error) {
      console.log(error);
      alert("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditRow(null);
    setEditingData({});
  };

  const handleInputChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (token) getAllProjects();
  }, [token]);

  const getStatusBadge = (status) => {
    const base = "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit";
    
    const config = {
      Completed: { 
        bg: "bg-green-900/30", 
        text: "text-green-400",
        border: "border border-green-800/50",
        icon: <CheckCircle size={14} />
      },
      "In Progress": { 
        bg: "bg-blue-900/30", 
        text: "text-blue-400",
        border: "border border-blue-800/50",
        icon: <Clock size={14} />
      },
      Pending: { 
        bg: "bg-yellow-900/30", 
        text: "text-yellow-400",
        border: "border border-yellow-800/50",
        icon: <AlertCircle size={14} />
      }
    };
    
    const current = config[status] || config.Pending;
    
    return (
      <span className={`${current.bg} ${current.text} ${current.border} ${base}`}>
        {current.icon}
        {status}
      </span>
    );
  };

  return (
    <>
      {/* Projects Table */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Project Management</h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage all your projects from one place
            </p>
          </div>
          {/* <button
            onClick={() => setOpenModal(true)}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <span className="text-lg">+</span> Add New Project
          </button> */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="py-4 px-6 text-left text-gray-300 font-semibold text-sm">Project</th>
                <th className="py-4 px-6 text-left text-gray-300 font-semibold text-sm">Client</th>
                <th className="py-4 px-6 text-left text-gray-300 font-semibold text-sm">Status</th>
                <th className="py-4 px-6 text-left text-gray-300 font-semibold text-sm">Deadline</th>
                <th className="py-4 px-6 text-left text-gray-300 font-semibold text-sm">Amount</th>
                <th className="py-4 px-6 text-left text-gray-300 font-semibold text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {allProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No projects found</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Start by adding your first project
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                allProjects.map((project) => {
                  const isEditing = editRow === project._id;

                  return (
                    <tr 
                      key={project._id} 
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-200"
                    >
                      {/* Project Name */}
                      <td className="py-4 px-6">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingData.projectName || ""}
                            onChange={(e) => handleInputChange("projectName", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Project name"
                          />
                        ) : (
                          <div>
                            <p className="text-white font-medium">{project.projectName}</p>
                            {project.projectDescription && (
                              <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">
                                {project.projectDescription}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Client Email */}
                      <td className="py-4 px-6">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editingData.clientMail || ""}
                            onChange={(e) => handleInputChange("clientMail", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="client@example.com"
                          />
                        ) : (
                          <p className="text-gray-300">{project.clientMail || "—"}</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {isEditing ? (
                          <select
                            value={editingData.projectStatus || "Pending"}
                            onChange={(e) => handleInputChange("projectStatus", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          getStatusBadge(project.projectStatus)
                        )}
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-6">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editingData.projectDeadline || ""}
                            onChange={(e) => handleInputChange("projectDeadline", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-300">
                            {project.projectDeadline
                              ? new Date(project.projectDeadline).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : "—"}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        {isEditing ? (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              $
                            </span>
                            <input
                              type="number"
                              value={editingData.projectAmount || ""}
                              onChange={(e) => handleInputChange("projectAmount", e.target.value)}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-300">
                            {project.projectAmount ? `$${project.projectAmount}` : "—"}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(project._id)}
                              disabled={isLoading}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Save size={16} />
                              )}
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                            >
                              <X size={16} />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(project)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg border border-blue-800/50 transition-colors"
                            >
                              <Edit2 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-800/50 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Add New Project</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Fill in the details to create a new project
                </p>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <AddProjectForm 
                onSuccess={() => {
                  setOpenModal(false);
                  getAllProjects();
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectsPanel;