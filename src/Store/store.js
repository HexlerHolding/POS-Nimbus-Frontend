import { create } from "zustand";

const useStore = create((set) => ({
  userRole: localStorage.getItem("role") || null,
  userId: localStorage.getItem("userId") || null,
  shopId: localStorage.getItem("shopId") || null,
  branchId: localStorage.getItem("branchId") || null,
  shopName: localStorage.getItem("shopName") || "",
  branchName: localStorage.getItem("branchName") || "",

  setUserRole: (userRole) => {
    localStorage.setItem("role", userRole);
    set({ userRole });
  },

  setUserId: (userId) => {
    localStorage.setItem("userId", userId);
    set({ userId });
  },

  setShopId: (shopId) => {
    localStorage.setItem("shopId", shopId);
    set({ shopId });
  },

  setBranchId: (branchId) => {
    localStorage.setItem("branchId", branchId);
    set({ branchId });
  },

  setUserShopName: (shopName) => {
    localStorage.setItem("shopName", shopName);
    set({ shopName });
  },

  setBranchName: (branchName) => {
    localStorage.setItem("branchName", branchName);
    set({ branchName });
  },

  clearUserData: () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("shopId");
    localStorage.removeItem("branchId");
    localStorage.removeItem("shopName");
    localStorage.removeItem("branchName");

    set({
      userRole: null,
      userId: null,
      shopId: null,
      branchId: null,
      shopName: "",
      branchName: "",
    });
  },
}));

export default useStore;
