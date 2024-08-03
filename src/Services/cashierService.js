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
};

export default cashierService;
