// hooks/useAIRethink.ts
import { unifiedOperation } from '../testApiService';
import { FileRecord } from '../types';
import { useProcessStore } from '../store/useProcessStore';
import { useFileStore } from '../store/useFileStore';

export function useAIRethink() {
  const selectedFile = useFileStore((state) => state.selectedFile);
  const updateFile = useFileStore((state) => state.updateFile);
  const setIsUpdating = useProcessStore((state) => state.setIsUpdating);
  const setProgress = useProcessStore((state) => state.setProgress);
  
  const handleConfirmRethink = async (prompt: string) => {
    if (!selectedFile) return;

    if (!prompt.trim()) {
      alert("請輸入 Prompt！");
      return;
    }
    setIsUpdating(true);
    setProgress(0);

    const fileToSend = `### AI Rethink Request:\n\n${prompt}\n\n### File: ${selectedFile.fileName}\n\n${selectedFile.newCode}`;
    try {
      const result = await unifiedOperation(fileToSend);
      if (result.result) {
        updateFile(selectedFile.fileName, {
          newCode: result.result.converted_code || selectedFile.newCode,
          advice: result.result.suggestions,
          loading: false,
        });
      }
    } catch (error) {
      console.error("AI Rethink 發生錯誤:", error instanceof Error ? error.message : error);
      updateFile(selectedFile.fileName, {
        error: "AI Rethink 失敗",
        loading: false,
      });
    } finally {
      setProgress(1);
      setIsUpdating(false);
    }
  };

  return { handleConfirmRethink };
}
