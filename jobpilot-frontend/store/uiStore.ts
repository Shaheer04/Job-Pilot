import { create } from "zustand";

interface UIState {
  isAddJobModalOpen: boolean;
  openAddJobModal: () => void;
  closeAddJobModal: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toast: { message: string; isVisible: boolean } | null;
  showToast: (message: string) => void;
  hideToast: () => void;
  jobSearchTerm: string;
  setJobSearchTerm: (term: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAddJobModalOpen: false,
  openAddJobModal: () => set({ isAddJobModalOpen: true }),
  closeAddJobModal: () => set({ isAddJobModalOpen: false }),
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toast: null,
  showToast: (message: string) => {
    set({ toast: { message, isVisible: true } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  hideToast: () => set({ toast: null }),
  jobSearchTerm: "",
  setJobSearchTerm: (term) => set({ jobSearchTerm: term }),
}));
