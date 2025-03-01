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

const cashierService = {
  addOrder: async (order) => {
    try {
      console.log(order);
      const response = await axios.post(
        `${BASE_URL}/cashier/order/add`,
        order,
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashier/orders`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getActiveOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashier/orders/active`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getPendingOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashier/orders/pending`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashier/products`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  markOrderCompleted: async (orderId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/cashier/order/${orderId}/complete`,
        {},
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  markOrderCancelled: async (orderId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/cashier/order/${orderId}/cancel`,
        {},
        {
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getTaxes: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashier/taxes`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  getBranchStatus: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashier/branch/status`, {
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },
  getCashierProfile: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cashier/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error getting cashier profile:", error);
      return { error: error.response?.data?.message || error.message };
    }
  },
  
  /**
   * Update cashier profile information
   * @param {Object} profileData - Profile data to update (currently only password)
   * @returns {Promise} - Response with updated cashier data
   */
  updateCashierProfile: async (profileData) => {
    try {
      console.log("Updating cashier profile:", profileData);
      const response = await axios.put(
        `${BASE_URL}/cashier/profile/update`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating cashier profile:", error);
      return { error: error.response?.data?.message || error.message };
    }
  }
};

export default cashierService;
