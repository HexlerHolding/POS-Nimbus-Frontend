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
};

export default managerService;
