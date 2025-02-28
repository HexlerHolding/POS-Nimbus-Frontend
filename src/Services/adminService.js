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
      console.error("Error in getManagers:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in getBranches:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in getCategories:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in addManager:", error);
      return { error: error.response?.data?.message || error.message };
    }
  },
  
  addCategory: async (categoryData) => {
    try {
      // No need to include shopId - backend will get it from token
      const response = await axios.post(
        `${BASE_URL}/admin/category/add`,
        { categoryName: categoryData.categoryName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error adding category:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in addBranch:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in getAllOrders:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in getAllProducts:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in getNumberOfBranches:", error);
      return { error: error.response?.data?.message || error.message };
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
      console.error("Error in getBranchSales:", error);
      return { error: error.response?.data?.message || error.message };
    }
  },
  // Add these methods to your AdminService.js file

updateCategory: async (categoryData) => {
  try {
    console.log("Updating category:", categoryData);
    const response = await axios.put(
      `${BASE_URL}/admin/category/update`,
      {
        categoryId: categoryData.categoryId,
        categoryName: categoryData.categoryName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: error.response?.data?.message || error.message };
  }
},

deleteCategory: async (categoryId) => {
  try {
    console.log("Deleting category:", categoryId);
    const response = await axios.delete(
      `${BASE_URL}/admin/category/delete`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: { categoryId }
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: error.response?.data?.message || error.message };
  }
}
};

export default AdminService;