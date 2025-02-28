import React, { useEffect, useState } from "react";
import AdminService from "../../../Services/adminService";
import commonService from "../../../Services/common";

const ManagerView = () => {
  const [branches, setBranches] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);
  const [formData, setFormData] = useState({
    managerId: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    contact: "",
    branchId: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch branches and managers
  useEffect(() => {
    fetchBranches();
    fetchManagers();
  }, []);

  // Filter managers when branch selection changes
  useEffect(() => {
    fetchManagers();
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const response = await AdminService.getBranches();
      if (response.data) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      setMessage({ text: "Failed to fetch branches", type: "error" });
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await AdminService.getManagers();
      if (response.data) {
        if (selectedBranch === "all") {
          setSelectedManagers(response.data);
        } else {
          let manager = response.data.filter(
            (manager) => manager.branch_id._id === selectedBranch
          );
          setSelectedManagers(manager);
        }
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      setMessage({ text: "Failed to fetch managers", type: "error" });
    }
  };

  const handleEditClick = (manager) => {
    setCurrentManager(manager);
    setFormData({
      managerId: manager._id,
      username: manager.username,
      email: manager.email || "",
      firstName: manager.first_name || "",
      lastName: manager.last_name || "",
      contact: manager.contact || "",
      branchId: manager.branch_id._id
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (manager) => {
    setCurrentManager(manager);
    setIsDeleteModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await AdminService.updateManager(formData);
      if (response.data) {
        setMessage({ text: "Manager updated successfully", type: "success" });
        setIsModalOpen(false);
        fetchManagers(); // Refresh the list
      } else if (response.error) {
        setMessage({ text: response.error, type: "error" });
      }
    } catch (error) {
      console.error("Error updating manager:", error);
      setMessage({ text: "Failed to update manager", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await AdminService.deleteManager(currentManager._id);
      if (response.data) {
        setMessage({ text: "Manager deleted successfully", type: "success" });
        setIsDeleteModalOpen(false);
        fetchManagers(); // Refresh the list
      } else if (response.error) {
        setMessage({ text: response.error, type: "error" });
      }
    } catch (error) {
      console.error("Error deleting manager:", error);
      setMessage({ text: "Failed to delete manager", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-x-auto p-10 sm:p-20 min-h-screen">
      {/* Message display */}
      {message.text && (
        <div className={`p-4 mb-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <h1 className="text-2xl text-blue-500 mb-2">View Managers</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        View, edit, or delete managers in a branch
      </p>
      
      {/* Branch Selection */}
      <div className="relative z-0 w-full mb-10 group mt-2">
        <select
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="block py-2.5 px-2 mt-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        >
          <option value="none" selected disabled hidden>
            Select Branch
          </option>
          <option value="all">All</option>

          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>{branch.branch_name}</option>
          ))}
        </select>
        <label
          htmlFor="branch-select"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Branch
        </label>
      </div>

      {/* Managers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Manager ID
              </th>
              <th scope="col" className="px-6 py-3">
                Manager Name
              </th>
              <th scope="col" className="px-6 py-3">
                Branch Name
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedManagers.map((manager) => (
              <tr className="bg-white dark:bg-gray-800" key={manager._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-400">
                        {commonService.handleID(manager._id)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-200">
                    {manager.first_name} {manager.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {manager.branch_id.branch_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {manager.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEditClick(manager)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(manager)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Edit Manager
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Branch
                </label>
                <select
                  id="branchId"
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete manager "{currentManager.first_name} {currentManager.last_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerView;