import axios from "axios";
import { BASE_URL } from "./url";
// const BASE_URL = process.env.BASE_URL;

const handleResponse = async (response) => {
  if (response.status >= 200 && response.status < 300) {
    //all possible valid (success) status codes
    return { data: response.data };
  } else {
    return { error: response.data.errorMessage };
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
      const response = await axios.get(`${BASE_URL}/admin/branches`,{
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
