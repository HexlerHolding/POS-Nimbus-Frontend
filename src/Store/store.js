import { create } from 'zustand';

const useStore = create(set => ({
  userRole: (localStorage.getItem('role')) || null,
  setUserRole: (userRole) => set({ userRole }),
}));

export default useStore;