import { create } from "zustand";

interface UIState{
    // ===== State (狀態) =====
    isPromptModalOpen: boolean;
    processingMode: "single" | "multi";
    isRethinkModalOpen: boolean;
    logModal:{
      isOpen: boolean;
      selectedFileName:string;
    }

    // ===== Actions (操作方法) =====
    setIsPromptModalOpen : (isOpen: boolean) => void;
    setProcessingMode: (mode: "single" | "multi") => void;
    setIsRethinkModalOpen: (isOpen: boolean) => void;
    openLogModal: (fileName:string) => void;
    closeModal: ()=> void;

    //直接反轉
    togglePromptModal: () => void;
    toggleRethinkModal: () => void;

}

export const useUIStore = create<UIState>((set) => ({
    isPromptModalOpen: false,
    processingMode: "single",
    isRethinkModalOpen: false, 
    logModal: {
      isOpen: false,
      selectedFileName: '',
    },

    setIsPromptModalOpen: (isOpen) => set({isPromptModalOpen: isOpen}),
    setProcessingMode: (mode) => set({processingMode: mode}),
    setIsRethinkModalOpen: (isOpen) => set({ isRethinkModalOpen: isOpen }),
    openLogModal: (fileName) => set({logModal:{isOpen:true, selectedFileName:fileName}}),
    closeModal: () => set({logModal:{isOpen:false, selectedFileName:''}}),
    togglePromptModal: () => set((state) => ({
    isPromptModalOpen: !state.isPromptModalOpen
  })),
  
  toggleRethinkModal: () => set((state) => ({
    isRethinkModalOpen: !state.isRethinkModalOpen
  })),

}))