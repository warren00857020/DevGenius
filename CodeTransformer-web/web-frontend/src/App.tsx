import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileRecord } from './types';

import './App.css';

import PromptModal from './components/PromptModal';
import LogModal from './components/LogModal';
import Sidebar from './components/Sidebar';
import CodeDiff from './components/CodeDiff';
import FileList from './components/FileList';
import RaceCarLoading from './components/RaceCarLoading';
import ModeToggle from './components/ModeToggle';
import Header from './components/Header';
import CodeEditorHeader from './components/CodeEditorHeader';
import TestPanel from './components/TestPanel';

import { useProjectManager } from './hooks/useProjectManager';

import { useFileStore } from './store/useFileStore';
import { useUIStore } from './store/useUIStore';
import { useProcessStore } from './store/useProcessStore';

const App: React.FC = () => {

  const files = useFileStore((state) => state.files);
  const selectedFile = useFileStore((state) => state.selectedFile);
  const selectFile = useFileStore((state) => state.selectFile);
  const updateFile = useFileStore((state) => state.updateFile);  

  const isPromptModalOpen = useUIStore((state) => state.isPromptModalOpen);
  const setIsPromptModalOpen = useUIStore((state) => state.setIsPromptModalOpen);
  const processingMode = useUIStore((state) => state.processingMode);
  const setProcessingMode = useUIStore((state) => state.setProcessingMode);
  const isRethinkModalOpen = useUIStore((state) => state.isRethinkModalOpen);
  const setIsRethinkModalOpen = useUIStore((state) => state.setIsRethinkModalOpen);
  const logModal = useUIStore((state) => state.logModal);
  const openLogModal = useUIStore((state) => state.openLogModal);
  const closeLogModal = useUIStore((state) => state.closeModal);

  // Process 相關的 state（只拿在 App.tsx 中需要使用的）
  const isUpdating = useProcessStore((state) => state.isUpdating);
  const isTesting = useProcessStore((state) => state.isTesting);
  const progress = useProcessStore((state) => state.progress);
  const testProgress = useProcessStore((state) => state.testProgress);
  const fileLogs = useProcessStore((state) => state.fileLogs);
  
  const {
    setAdvice,
    handleProjectUpload,
    handleConfirmPrompt,
    handleConfirmRethink,
    handleGenerateConfigs,
    handleTestProject,
  } = useProjectManager();

  // 🆕 當使用者點選檔案列表時更新選取檔案（使用新的 store 方法）
  const handleSelectFile = (fileRecord: FileRecord) => {
    selectFile(fileRecord);  // 使用 store 的 selectFile 方法
    setAdvice(fileRecord.advice || '尚無建議');
  };

  return (
    <div className="main-wrapper">
      {isUpdating && (
        <div className="loading-overlay">
          <RaceCarLoading progress={progress} total={files.length} />
        </div>
      )}

      {/* AI Rethink 的 Prompt Modal */}
      {isRethinkModalOpen && (
        <PromptModal
          isOpen={isRethinkModalOpen}
          onClose={() => setIsRethinkModalOpen(false)}
          onConfirm={handleConfirmRethink}
        />
      )}

      {/* 檔案上傳後的 Prompt Modal */}
      {isPromptModalOpen && (
        <PromptModal
          isOpen={isPromptModalOpen}
          onClose={() => setIsPromptModalOpen(false)}
          onConfirm={(prompt) => {
            handleConfirmPrompt(prompt, processingMode);
            setIsPromptModalOpen(false);
          }}
        />
      )}

      {/* 顯示 log Modal */}
      <LogModal 
        isOpen={logModal.isOpen}
        onClose={closeLogModal}
        log={fileLogs[logModal.selectedFileName] || ''}
        fileName={logModal.selectedFileName}
      />

      <Header title="AI 維運懶人包 tu_tu_tu_du" />
      <div className="app-container">
        <Sidebar>
          <ModeToggle />
          <input
            type="file"
            className="upload-button"
            onChange={(e) => {
              handleProjectUpload(e);
              setIsPromptModalOpen(true);
            }}
            ref={(input) => input && (input.webkitdirectory = true)}
          />
          <FileList />
        </Sidebar>
        <main className="main-content">
          {selectedFile ? (
            <>
              <CodeEditorHeader 
                fileName={selectedFile.fileName}
                loading={selectedFile.loading}
                onRethinkClick={() => setIsRethinkModalOpen(true)}
                onDeployClick={handleGenerateConfigs}
              />
              <CodeDiff
                fileName={selectedFile?.fileName || ""}
                oldCode={selectedFile?.oldCode || ""}
                newCode={selectedFile?.newCode || ""}
                loading={selectedFile?.loading || false}
                error={selectedFile?.error || ""}
                onCodeChange={(updatedCode) => {
                  if (selectedFile?.fileName) {
                    updateFile(selectedFile.fileName, { newCode: updatedCode });
                  }
                }}
              />
            </>
          ) : (
            <p className="placeholder-text">請上傳專案並選擇修改過的檔案來查看變更</p>
          )}
        </main>
  
        <TestPanel 
          advice={selectedFile?.advice}
          isTesting={isTesting}
          testProgress={testProgress}
          fileLogs={fileLogs}
          onTestClick={handleTestProject}
          onLogClick={openLogModal}
        />
      </div>
    </div>
  );
};

export default App;