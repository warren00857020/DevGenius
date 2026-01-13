import { create } from 'zustand';

interface ProcessState{
    isUpdating: boolean; // 正在更新檔案
    isTesting: boolean; // 正在測試
    progress: number; // 處理進度
    testProgress: string[]; // 測試進度訊息
    testResult: string | null; // 測試結果

    fileLogs: {[fileName:string]:string};

    setIsUpdating: (isUpdating: boolean) => void;
    setIsTesting: (isTesting: boolean) => void;
    setProgress: (progress: number) => void;
    setTestProgress: (progress: string[]) => void;
    setTestResult: (result: string | null) => void;
    setFileLogs: (logs: { [fileName: string]: string }) => void;
    
    incrementProgress: () => void;  // 進度 +1 的便利方法
    addTestProgress: (message: string) => void;  // 新增一筆測試訊息
    addFileLog: (fileName: string, log: string) => void;  // 新增單一檔案 log

    startProcessing: () => void;
    finishProcessing: () => void;
    reset: () => void;  // 重置所有狀態
}


export const useProcessStore = create<ProcessState>((set)=>({
    isUpdating: false,
    isTesting: false,
    progress: 0,
    testProgress: [],
    testResult: null,

    fileLogs: {},

    setIsUpdating: (isUpdating) => set({ isUpdating }),
    setIsTesting: (isTesting) => set({ isTesting }),
    setProgress: (progress) => set({ progress }),
    setTestProgress: (testProgress) => set({ testProgress }),
    setTestResult: (testResult) => set({ testResult }),
    setFileLogs: (fileLogs) => set({ fileLogs }),

    incrementProgress: () => set((state)=>({
        progress: state.progress + 1
    })),
    addTestProgress: (message) => set((state)=>({
        testProgress: [...state.testProgress, message]
    })),
    addFileLog: (fileName, log) => set((state)=>({
        fileLogs: {...state.fileLogs, [fileName]:log}
    })),

    startProcessing: () => set({
        isTesting: true,
        progress: 0,
        testProgress: ["開始測試專案…"],
        testResult: "專案在 GKE 測試中…",
        isUpdating: true,
    }),
    finishProcessing: () => set({
        isTesting: false,
        isUpdating: false,
    }),
    reset: () => set({
    isUpdating: false,
    isTesting: false,
    progress: 0,
    testProgress: [],
    testResult: null,
    fileLogs: {},
  }),


}));