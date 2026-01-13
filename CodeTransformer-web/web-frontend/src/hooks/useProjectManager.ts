// hooks/useProjectManager.ts
import { useState } from 'react';
import { useFileUpload } from './useFileUpload';
import { useBackendOperations } from './useBackendOperations';
import { useDeploymentOperations } from './useDeploymentOperations';
import { useAIRethink } from './useAIRethink';
// 🆕 引入 Store
import { useFileStore } from '../store/useFileStore';
import { useProcessStore } from '../store/useProcessStore';

export function useProjectManager() {
  // 🆕 從 Store 取得檔案相關資料
  const files = useFileStore((state) => state.files);
  const pendingFiles = useFileStore((state) => state.pendingFiles);

  const setIsUpdating = useProcessStore((state) => state.setIsUpdating);
  const setProgress = useProcessStore((state) => state.setProgress);
  const incrementProgress = useProcessStore((state) => state.incrementProgress);

  // 其他 state（暫時還用 useState，後續可以繼續重構）
  const [advice, setAdvice] = useState<string>('');

  // 檔案上傳相關
  const { handleProjectUpload } = useFileUpload();
  // 與後端溝通的功能
  const { sendFilesToBackend, sendFilesToMultiBackend } = useBackendOperations();
  // AI Rethink
  const { handleConfirmRethink } = useAIRethink();
  // 部署相關
  const {
    handleGenerateConfigs,
    handleTestProject,
  } = useDeploymentOperations();

  // 處理 Prompt 確認
  const handleConfirmPrompt = async (prompt: string, processingMode: string) => {
    if (!prompt.trim()) {
      alert("請輸入 Prompt！");
      return;
    }
    setProgress(0);
    setIsUpdating(true);

    try {
      if (processingMode === "single") {
        await Promise.all(
          files.map(async (file) => {
            await sendFilesToBackend(file, prompt);
            incrementProgress();
          })
        );
      } else if (processingMode === "multi") {
        await sendFilesToMultiBackend(files, prompt);
        setProgress(files.length);
      }
    } catch (error) {
      console.error("更新檔案時發生錯誤：", error);
    }
    setIsUpdating(false);
  };

  return {
    pendingFiles,
    advice,
    setAdvice,
    handleProjectUpload,
    sendFilesToBackend,
    sendFilesToMultiBackend,
    handleConfirmPrompt,
    handleConfirmRethink,
    handleGenerateConfigs,
    handleTestProject,
  };
}
