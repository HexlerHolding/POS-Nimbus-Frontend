import axios from "axios";
import { BASE_URL } from "./url";
// const BASE_URL = process.env.BASE_URL;

const handleResponse = async (response) => {
  if (response.status >= 200 && response.status < 300) {
    return { data: response.data };
  } else {
    return { error: response.data.message };
  }
};

const AuthService = {
  adminLogin: async (shopName, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/admin/login`,
        {
          shopName,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(response);
      return handleResponse(response);
    } catch (error) {
      return { error: error.message };
    }
  },
};

export default AuthService;
