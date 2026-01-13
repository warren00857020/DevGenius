// hooks/useFileUpload.ts
// 檔案上傳與解析
import { ChangeEvent } from 'react';
import { FileRecord } from '../types';
// 🆕 引入 Store
import { useFileStore } from '../store/useFileStore';

export function useFileUpload() {
  // 🆕 從 Store 取得 state 和 setter
  const setFiles = useFileStore((state) => state.setFiles);
  const setPendingFiles = useFileStore((state) => state.setPendingFiles);

  // 💡 說明：不再使用 useState，直接從 Store 拿 setter 方法

  const handleProjectUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const projectFiles: FileRecord[] = [];
    const fileReaders: Promise<void>[] = [];

    for (const file of uploadedFiles) {
      const reader = new FileReader();
      const promise = new Promise<void>((resolve) => {
        reader.onload = (e) => {
          const content = e.target?.result as string;
          projectFiles.push({
            fileName: file.webkitRelativePath,
            oldCode: content,
            newCode: '',
            loading: true,
            error: '',
          });
          resolve();
        };
      });
      reader.readAsText(file);
      fileReaders.push(promise);
    }

    Promise.all(fileReaders).then(() => {
      // 🆕 使用 Store 的 setter
      setFiles(projectFiles);
      setPendingFiles(projectFiles);
    });
  };

  // 💡 不再回傳 files 和 setFiles，因為已經在 Store 裡了
  // 需要用的組件可以直接從 Store 拿
  return { handleProjectUpload };
}
