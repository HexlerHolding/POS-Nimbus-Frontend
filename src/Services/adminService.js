import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const handleResponse = async (response) => {
  if (response.status >= 200 && response.status < 300) {
    //all possible valid (success) status codes
    return { data: response.data };
  } else {
    return { error: response.data.message };
  }
};

const AdminService = {
  getManagers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/managers`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getBranches: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/branches`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/categories`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  addManager: async (manager) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/manager/add`,
        manager,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },

  addBranch: async (branch) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/branch/add`,
        branch,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/orders`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getAllProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/products`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getNumberOfBranches: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/branches/count`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getBranchSales: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/branches/sales`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },
};

export default AdminService;
