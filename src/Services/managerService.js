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

const managerService = {
  getManagerProfile: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/manager/profile`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },
  updateManagerProfile: async (profileData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/manager/profile/update`,
        profileData,
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },
  updateProduct: async (productData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/product/update`,
        productData,
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

 

  addProduct: async (product) => {
    try {
      console.log(product);
      for (let pair of product.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.post(
        `${BASE_URL}/manager/product/add`,
        product,
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/manager/products`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/manager/categories`, {
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

  getCashiers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/manager/cashiers`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  addCashier: async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/manager/cashier/add`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },

  getKitchenStaff: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/manager/kitchens`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  addKitchenStaff: async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/manager/kitchen/add`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },

  getBranch: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/manager/`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  updateBranchTimings: async (branch) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/manager/branch/timings`,
        {
          branchGot: branch,
        },
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  openBranch: async (branch) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/manager/branch/openBranch`,
        {
          branch,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  closeBranch: async (branch) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/manager/branch/closeBranch`,
        { branch },
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  updateCashOnHand: async (cash_on_hand) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/manager/branch/updateCashOnHand`,
        { cash_on_hand },
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getBranchOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/manager/branch/orders`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },
  
addCategory: async (categoryData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/manager/category/add`,
      categoryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Add category error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
},

updateCategory: async (categoryData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/manager/category/update`,
      categoryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Update category error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
},

deleteCategory: async (categoryId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/manager/category/delete/${categoryId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Delete category error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
},
// Add or update these functions in managerService.js

updateProduct: async (productData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/manager/product/update`,
      productData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Update product error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
},

deleteProduct: async (productId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/manager/product/delete`,
      {
        data: { productId },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Delete product error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || error.message };
  }
}
};

export default managerService;
