import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const handleResponse = async (response) => {
  if (response.status >= 200 && response.status < 300) {
    return { data: response.data };
  } else {
    return { error: response.data.message };
  }
};  

const KitchenService = {
  getPendingOrders: async () => {
    try {
      console.log(BASE_URL);
      const response = await axios.get(`${BASE_URL}/kitchen/orders/pending`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response);
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },

  markOrderReady: async (orderId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/kitchen/order/${orderId}/ready`,
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
};

export default KitchenService;