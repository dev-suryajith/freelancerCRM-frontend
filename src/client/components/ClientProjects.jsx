import React, { useEffect, useState } from "react";
import { MdWork } from "react-icons/md";
import { getClientProjectsAPI } from "../../services/allAPI";

function ClientProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStatusColor = (status) => {
    const colors = {
      "Planning / Starting Soon": "bg-blue-500",
      "Active / Project Started": "bg-indigo-600",
      "In Development": "bg-yellow-500",
      "Under Review": "bg-orange-500",
      "Completed": "bg-green-600",
      "On Hold": "bg-gray-500",
      "Cancelled": "bg-red-600",
    };

    return colors[status] || "bg-gray-400";
  };

  const getAllProjects = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Unauthorized access");
        return;
      }

      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      
      const result = await getClientProjectsAPI(reqHeader);
      console.log(result.data);
      
      setProjects(result.data || []);
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-10 text-white text-center">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-10 text-red-400 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="px-6 py-10 text-white">
      <div className="flex items-center gap-2 mb-6">
        <MdWork className="text-3xl text-blue-400" />
        <h2 className="text-3xl font-bold">Your Projects</h2>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id || project.id}
              className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-2">
                {project.projectName}
              </h3>

              <p className="text-gray-300 mb-4 line-clamp-3">
                {project.projectDescription}
              </p>

              <div className="flex justify-between items-center">
                <span
                  className={`text-sm px-3 py-1 rounded-full text-white ${getStatusColor(
                    project.projectStatus
                  )}`}
                >
                  {project.projectStatus}
                </span>

                <p className="text-sm text-gray-400">
                  ₹ {project.projectAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientProjects;
