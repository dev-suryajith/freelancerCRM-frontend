import React, { useEffect, useState } from "react";
import { getAllClientsAPI, addClientProjectAPI } from "../../services/allAPI";
import { toast } from "react-toastify";

function AddProjectForm() {
    const [clients, setClients] = useState([]);

    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUserDetails"));
    const userToken = sessionStorage.getItem("token");
    const reqHeader = { Authorization: `Bearer ${userToken}` };

    const [projectData, setProjectData] = useState({
        freelancerMail: loggedUser?.email || "",
        clientName: "",
        clientMail: "",
        clientPhone: "",
        projectName: "",
        projectStatus: "Pending",
        projectDeadline: "",
        projectAmount: "",
        projectDescription: ""
    });

    // ---------------- GET CLIENTS ----------------
    const getAllClients = async () => {
        try {
            const result = await getAllClientsAPI(reqHeader);
            setClients(Array.isArray(result.data) ? result.data : []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (loggedUser && userToken) {
            getAllClients();
        }
    }, []);

    // ---------------- HANDLE CHANGE ----------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name]: value }));
    };

    // ---------------- HANDLE SUBMIT ----------------
    const handleSubmit = async () => {
        try {
            if (!loggedUser || !userToken) {
                toast.warn("Unauthorized action");
                return;
            }

            if (
                !projectData.projectName ||
                !projectData.clientMail ||
                !projectData.projectAmount ||
                !projectData.projectDeadline
            ) {
                toast.warn("Please fill all required fields");
                return;
            }
            console.log(projectData);
            
            const result = await addClientProjectAPI(projectData, reqHeader);

            if (result.status === 200) {
                toast.success("Project added successfully");

                setProjectData({
                    freelancerMail: loggedUser.email,
                    clientName: "",
                    clientMail: "",
                    clientPhone: "",
                    projectName: "",
                    projectStatus: "Pending",
                    projectDeadline: "",
                    projectAmount: "",
                    projectDescription: ""
                });
            } else if (result.status === 404) {
                toast.warn("Project already exists");
            } else if (result.status === 500) {
                toast.error("Server error. Try again later");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Try again later");
        }
    };

    return (
        <div className="max-w-xl mx-auto  border border-gray-700 rounded-2xl px-12 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">
                Add New Project
            </h2>

            <div className="space-y-4">
                {/* Project Name */}
                <div>
                    <label className="text-gray-300 text-sm block mb-1">
                        Project Name
                    </label>
                    <input
                        type="text"
                        name="projectName"
                        value={projectData.projectName}
                        onChange={handleChange}
                        placeholder="Website Redesign"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Client */}
                <div>
                    <label className="text-gray-300 text-sm block mb-1">
                        Select Client
                    </label>
                    <select
                        onChange={(e) => {
                            const selectedClient = clients.find(
                                (c) => c._id === e.target.value
                            );

                            if (selectedClient) {
                                setProjectData((prev) => ({
                                    ...prev,
                                    clientName: selectedClient.username,
                                    clientMail: selectedClient.email,
                                    clientPhone: selectedClient.contact
                                }));
                            }
                        }}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                        <option value="">-- Select Client --</option>
                        {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                                {client.username} ({client.email})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount */}
                <div>
                    <label className="text-gray-300 text-sm block mb-1">
                        Project Amount (₹)
                    </label>
                    <input
                        type="number"
                        name="projectAmount"
                        value={projectData.projectAmount}
                        onChange={handleChange}
                        placeholder="50000"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Deadline */}
                <div>
                    <label className="text-gray-300 text-sm block mb-1">
                        Deadline
                    </label>
                    <input
                        type="date"
                        name="projectDeadline"
                        value={projectData.projectDeadline}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="text-gray-300 text-sm block mb-1">
                        Status
                    </label>
                    <select
                        name="projectStatus"
                        value={projectData.projectStatus}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="text-gray-300 text-sm block mb-1">
                        Description
                    </label>
                    <textarea
                        name="projectDescription"
                        value={projectData.projectDescription}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Project details..."
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    className="w-full mt-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                    Add Project
                </button>
            </div>
        </div>
    );
}

export default AddProjectForm;
