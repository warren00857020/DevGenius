// hooks/useBackendOperations.ts
import { unifiedOperation, processMultiFiles } from '../testApiService';
//import { unifiedOperation, processMultiFiles } from '../apiService';
import { FileRecord } from '../types';
import { useFileStore } from '../store/useFileStore';

export function useBackendOperations() {
  const updateFile = useFileStore((state) => state.updateFile);

  const sendFilesToBackend = async (file: FileRecord, prompt: string) => {
    const fileToSend = `### User Prompt:\n${prompt}\n\n### File: ${file.fileName}\n\n${file.oldCode}`;
    try {
      const result = await unifiedOperation(fileToSend);
      if (result.result) {
        updateFile(file.fileName, {
          newCode: result.result.converted_code || file.newCode,
          advice: result.result.suggestions,
          loading: false,
        });
      }
    } catch (error) {
      updateFile(file.fileName, {
        error: "AI Rethink 失敗",
        loading: false,
      });
    }
  };

  const sendFilesToMultiBackend = async (files: FileRecord[], prompt: string) => {
    const filesToSend = files.map(file => ({
      file_name: file.fileName.split('/').pop() || 'unknown.txt',
      content: file.oldCode,
    }));

    try {
      const result = await processMultiFiles(prompt, filesToSend);
      if (result.files && Array.isArray(result.files)) {
        // ✅ 用迴圈逐個更新
        files.forEach(file => {
          const fileNameOnly = file.fileName.split('/').pop();
          const fileResult = result.files.find((res: any) => res.file_name === fileNameOnly);
          
          if (fileResult) {
            updateFile(file.fileName, {
              newCode: fileResult.content,
              advice: Array.isArray(fileResult.suggestions)
                ? fileResult.suggestions.join("\n")
                : fileResult.suggestions,
              loading: false,
            });
          }
        });
      }
    } catch (error) {
      files.forEach(file => {
        updateFile(file.fileName, {
          error: "批次處理失敗",
          loading: false,
        });
      });
    }
  };

  return { sendFilesToBackend, sendFilesToMultiBackend };
}
