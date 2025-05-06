import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

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
      // Extract shopId and userId from response
      if (response.status >= 200 && response.status < 300) {
        const { shopId, userId } = response.data;
        // Return these with the response for store updates
        return { 
          data: {
            ...response.data,
            shopId: shopId || response.data._id, // Fallback to _id if shopId is not provided
            userId: userId || shopId // For admin, userId might be the same as shopId
          } 
        };
      }
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },
  managerLogin: async (name, password, shopName, branch) => {
    try {
      console.log("AuthService sending:", {
        username: name,
        shopName,
        branchName: branch
      });
      const response = await axios.post(
        `${BASE_URL}/auth/manager/login`,
        {
          username: name,
          password,
          shopName,
          branchName: branch,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      console.log(response);
      // Extract needed IDs from response
      if (response.status >= 200 && response.status < 300) {
        const { shopId, branchId, userId } = response.data;
        return { 
          data: {
            ...response.data,
            shopId: shopId,
            branchId: branchId,
            userId: userId || response.data._id // Manager's ID
          } 
        };
      }
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },
  cashierLogin: async (name, password, shopName, branch) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/cashier/login`,
        {
          username: name,
          password,
          shopName,
          branchName: branch,
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
      return "error";
    }
  },
  kitchenLogin: async (name, password, shopName, branch) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/kitchen/login`,
        {
          username: name,
          password,
          shopName,
          branchName: branch,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(response);
      // Extract needed IDs from response
      if (response.status >= 200 && response.status < 300) {
        const { shopId, branchId, userId } = response.data;
        return { 
          data: {
            ...response.data,
            shopId: shopId,
            branchId: branchId,
            userId: userId || response.data._id // Kitchen user's ID
          } 
        };
      }
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },
  logout: async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      // Make sure to clear all user data from the store on logout
      localStorage.removeItem('userId');
      localStorage.removeItem('shopId');
      localStorage.removeItem('branchId');
      localStorage.removeItem('shopName');
      localStorage.removeItem('branchName');
  
      console.log(response);
      return handleResponse(response);
    } catch (error) {
      return "error";
    }
  },
  getShopNames: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/shops`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log(response);
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
  },
  getBranches: async (shopName) => {
    try {
      console.log("shopName", shopName);
      const response = await axios.get(
        `${BASE_URL}/auth/branches/${shopName}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
  },
};

export default AuthService;