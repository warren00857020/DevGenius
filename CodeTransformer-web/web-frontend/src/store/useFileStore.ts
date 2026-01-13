// store/useFileStore.ts
// 📦 檔案管理的 Zustand Store
// 負責管理：檔案列表、選中的檔案、檔案上傳等功能

import { create } from 'zustand';
import { FileRecord } from '../types';

// 🎯 定義 Store 的型別
interface FileState {
  // ===== State (狀態) =====
  files: FileRecord[];              // 所有檔案列表
  selectedFile: FileRecord | null;  // 當前選中的檔案
  pendingFiles: FileRecord[];       // 待處理的檔案

  // ===== Actions (操作方法) =====
  setFiles: (files: FileRecord[]) => void;
  setSelectedFile: (file: FileRecord | null) => void;
  setPendingFiles: (files: FileRecord[]) => void;

  // 選擇檔案（帶有額外邏輯）
  selectFile: (file: FileRecord) => void;

  // 更新特定檔案
  updateFile: (fileName: string, updates: Partial<FileRecord>) => void;

  // 清空所有檔案
  clearFiles: () => void;
}

// 🏗️ 創建 Store
export const useFileStore = create<FileState>((set) => ({
  // ===== 初始狀態 =====
  files: [],
  selectedFile: null,
  pendingFiles: [],

  // ===== 基本 Setter =====
  setFiles: (files) => set({ files }),

  setSelectedFile: (file) => set({ selectedFile: file }),

  setPendingFiles: (files) => set({ pendingFiles: files }),

  // ===== 複雜操作 =====

  // 選擇檔案（這是從 App.tsx 的 handleSelectFile 搬過來的）
  selectFile: (file) => set({
    selectedFile: file,
  }),

  // 更新特定檔案的內容
  updateFile: (fileName, updates) => set((state) => ({
    files: state.files.map((file) =>
      file.fileName === fileName
        ? { ...file, ...updates }
        : file
    ),
    // 如果更新的是選中的檔案，也要更新 selectedFile
    selectedFile: state.selectedFile?.fileName === fileName
      ? { ...state.selectedFile, ...updates }
      : state.selectedFile,
  })),

  // 清空所有檔案
  clearFiles: () => set({
    files: [],
    selectedFile: null,
    pendingFiles: [],
  }),
}));
