import { create } from 'zustand';

const useStore = create((set) => ({
  activeSubject: null,
  setActiveSubject: (subject) => set({ activeSubject: subject }),
  clearActiveSubject: () => set({ activeSubject: null }),
}));

export default useStore;
