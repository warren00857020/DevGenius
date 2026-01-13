# CodeTransformer Web Frontend

React + TypeScript 前端應用，提供 AI 輔助的程式碼轉換與部署介面。

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置正式版本
npm run build
```

## 🛠️ 技術棧

- **React 18** - UI 框架
- **TypeScript** - 型別安全
- **Zustand** - 狀態管理
- **Monaco Editor** - 程式碼編輯器
- **Vite** - 建置工具
- **React Markdown** - Markdown 渲染

## 📁 專案架構

```
src/
├── components/           # React 元件
│   ├── Header.tsx               # 頁面標題元件
│   ├── ModeToggle.tsx           # 處理模式切換
│   ├── CodeEditorHeader.tsx    # 程式碼編輯器標題與操作按鈕
│   ├── TestPanel.tsx            # 測試面板
│   ├── FileList.tsx             # 檔案列表
│   ├── CodeDiff.tsx             # 程式碼比對元件
│   ├── PromptModal.tsx          # Prompt 輸入視窗
│   ├── LogModal.tsx             # Log 顯示視窗
│   └── ...
├── hooks/               # 自定義 Hooks
│   ├── useProjectManager.ts      # 主要專案管理邏輯
│   ├── useAIRethink.ts           # AI 重新思考功能
│   ├── useBackendOperations.ts   # 後端 API 整合
│   ├── useDeploymentOperations.ts # 部署相關操作
│   ├── useFileUpload.ts          # 檔案上傳處理
│   └── ...
├── store/               # Zustand 狀態管理
│   ├── useFileStore.ts      # 檔案狀態
│   ├── useUIStore.ts        # UI 狀態
│   └── useProcessStore.ts   # 處理流程狀態
├── types/               # TypeScript 型別定義
├── utils/               # 工具函數
└── App.tsx              # 主應用元件
```

## 🏗️ 狀態管理架構

本專案使用 **Zustand** 進行全域狀態管理，分為三個獨立的 Store：

### 📦 useFileStore - 檔案狀態管理
管理檔案相關狀態：
- `files: FileRecord[]` - 所有上傳的檔案
- `selectedFile: FileRecord | null` - 當前選中的檔案
- `pendingFiles: FileRecord[]` - 等待處理的檔案

**主要方法：**
- `setFiles()` - 設定檔案列表
- `selectFile()` - 選擇檔案
- `updateFile()` - 更新單一檔案資料

### 🎨 useUIStore - UI 狀態管理
管理 UI 顯示狀態：
- `isPromptModalOpen: boolean` - Prompt 視窗開關
- `processingMode: 'single' | 'multi'` - 處理模式（獨立/關聯檔案）
- `isRethinkModalOpen: boolean` - AI Rethink 視窗開關
- `logModal: { isOpen: boolean, selectedFileName: string }` - Log 視窗狀態

**主要方法：**
- `setIsPromptModalOpen()` - 控制 Prompt 視窗
- `setProcessingMode()` - 切換處理模式
- `openLogModal()` - 開啟 Log 視窗
- `closeModal()` - 關閉視窗

### ⚙️ useProcessStore - 處理流程狀態管理
管理處理流程狀態：
- `isUpdating: boolean` - 是否正在更新
- `isTesting: boolean` - 是否正在測試
- `progress: number` - 處理進度
- `testProgress: string[]` - 測試進度訊息
- `fileLogs: Record<string, string>` - 檔案 Log 記錄

**主要方法：**
- `setIsUpdating()` - 設定更新狀態
- `incrementProgress()` - 遞增進度（避免閉包陷阱）
- `addTestProgress()` - 新增測試進度訊息
- `addFileLog()` - 新增檔案 Log

## ✨ 主要功能

### 1. 專案上傳
- 支援整個資料夾上傳
- 自動偵測檔案變更
- 批次處理多個檔案

### 2. 雙模式處理

#### 獨立檔案模式 (Single)
- 並行處理多個獨立檔案
- 每個檔案獨立轉換
- 適合無相依關係的檔案

#### 關聯檔案模式 (Multi)
- 同時處理相關檔案群組
- 保持檔案間的相依關係
- 適合需要連動修改的檔案

### 3. 程式碼比對
- 使用 Monaco Editor 實現的 Diff 檢視
- 並排顯示原始碼與轉換後程式碼
- 支援即時編輯
- 語法高亮顯示

### 4. AI Rethink
- 對已轉換的程式碼進行再次優化
- 提供改進建議
- 支援自定義 Prompt

### 5. 自動部署
- 整合 GKE 部署流程
- 自動生成 Dockerfile
- 自動生成 Kubernetes 部署配置
- 一鍵部署到雲端

### 6. 測試整合
- 自動執行單元測試
- 顯示測試結果
- 查看詳細 Log
- 即時顯示測試進度

## 📋 組件設計原則

### Props vs Store 使用指南

本專案遵循以下設計原則：

#### ✅ 使用 Props 的情況（推薦）
**展示型元件 (Presentational Components)**
- 優點：可重用、易測試、獨立於業務邏輯
- 範例：`Header`, `CodeEditorHeader`, `TestPanel`

```typescript
// ✅ 好的設計 - 使用 Props
const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({
  fileName,
  loading,
  onRethinkClick,
  onDeployClick
}) => {
  // 元件邏輯...
}

// 使用時
<CodeEditorHeader
  fileName={selectedFile.fileName}
  loading={selectedFile.loading}
  onRethinkClick={() => setIsRethinkModalOpen(true)}
  onDeployClick={handleGenerateConfigs}
/>
```

#### ⚠️ 使用 Store 的情況（特定場景）
**容器型元件 (Container Components)**
- 適合：與特定業務邏輯緊密結合的元件
- 範例：`ModeToggle`（處理模式切換功能專屬）

```typescript
// ⚠️ 特定場景 - 直接使用 Store
const ModeToggle: React.FC = () => {
  const processingMode = useUIStore((state) => state.processingMode);
  const setProcessingMode = useUIStore((state) => state.setProcessingMode);
  // ...
}
```

#### 🎯 Custom Hooks 使用 Store
**業務邏輯層**
- Hooks 負責業務邏輯，直接使用 Store
- 範例：`useProjectManager`, `useAIRethink`

```typescript
export function useAIRethink() {
  const selectedFile = useFileStore((state) => state.selectedFile);
  const updateFile = useFileStore((state) => state.updateFile);
  // 業務邏輯...
}
```

## 🐛 重構記錄

詳見 [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)

### 主要改進

#### ✅ 狀態管理重構
- **Before**: 使用分散的 `useState`，Props drilling 問題嚴重
- **After**: 使用 Zustand 集中式狀態管理
- **Benefits**:
  - 更好的狀態同步
  - 減少 Props 傳遞
  - 提高可維護性

#### ✅ 元件拆分
- **Before**: App.tsx 超過 200 行，職責不清
- **After**: 拆分為 Header, ModeToggle, CodeEditorHeader, TestPanel
- **Benefits**:
  - 提高可重用性
  - 更清晰的職責劃分
  - 更容易測試

#### ✅ 修復閉包陷阱
- **Issue**: `Promise.all` 中使用 `setProgress(progress + 1)` 導致進度錯誤
- **Fix**: 使用 `incrementProgress()` 函數式更新
- **Impact**: 確保並行處理時進度正確更新

#### ✅ 優化 Props 傳遞
- **Before**: 大量 Props 透過多層元件傳遞
- **After**: 元件優先使用 Props，Hooks 使用 Store
- **Benefits**: 平衡可重用性與便利性

## 🔧 開發注意事項

### 避免閉包陷阱

在 async 函數中避免使用閉包捕獲的狀態值：

```typescript
// ❌ 錯誤：閉包陷阱
const [progress, setProgress] = useState(0);

await Promise.all(
  files.map(async (file) => {
    await processFile(file);
    setProgress(progress + 1);  // ⚠️ progress 被閉包捕獲，永遠是初始值
  })
);

// ✅ 正確：使用函數式更新
await Promise.all(
  files.map(async (file) => {
    await processFile(file);
    setProgress(prev => prev + 1);  // ✅ 總是取得最新值
  })
);

// ✅ 更好：使用 Zustand 的 increment 函數
// Store 定義
incrementProgress: () => set((state) => ({
  progress: state.progress + 1
}))

// 使用
await Promise.all(
  files.map(async (file) => {
    await processFile(file);
    incrementProgress();  // ✅ 最佳實踐
  })
);
```

### 狀態更新模式

使用 Zustand 的 functional update 模式：

```typescript
// ✅ 正確：Functional update
set((state) => ({
  progress: state.progress + 1
}))

// ✅ 正確：複雜更新
set((state) => ({
  files: state.files.map(file =>
    file.fileName === fileName
      ? { ...file, ...updates }
      : file
  )
}))

// ❌ 錯誤：直接使用外部變數
const newProgress = progress + 1;
set({ progress: newProgress })  // ⚠️ 可能有閉包問題
```

### TypeScript 類型注意事項

```typescript
// ✅ 使用 TypeScript primitive types（小寫）
interface Props {
  name: string;      // ✅ 正確
  isActive: boolean; // ✅ 正確
  count: number;     // ✅ 正確
}

// ❌ 避免使用 JavaScript 物件類型（大寫）
interface Props {
  name: String;      // ❌ 錯誤
  isActive: Boolean; // ❌ 錯誤
  count: Number;     // ❌ 錯誤
}
```

## 📦 部署

### Docker 部署

專案包含 Dockerfile，支援容器化部署：

```bash
# 建置 Docker image
docker build -t codetransformer-web .

# 執行容器
docker run -p 5173:5173 codetransformer-web
```

### 環境變數

建立 `.env` 檔案設定環境變數：

```env
# API 端點
VITE_API_URL=http://localhost:8000

# 其他設定
VITE_APP_TITLE=AI 維運懶人包
```

## 🤝 開發工作流程

### 1. 開發新功能

```bash
# 建立新分支
git checkout -b feature/new-feature

# 開發並測試
npm run dev

# 提交變更
git add .
git commit -m "feat: add new feature"

# 推送到遠端
git push origin feature/new-feature
```

### 2. Commit Message 規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 類型：**
- `feat`: 新功能
- `fix`: Bug 修復
- `refactor`: 重構
- `docs`: 文檔更新
- `style`: 格式調整
- `test`: 測試相關
- `chore`: 建置/工具相關

**範例：**
```
feat(store): add Zustand state management stores

Replace scattered useState with centralized stores to improve:
- State synchronization across components
- Code maintainability and testability
- Separation of concerns
```

## 🧪 測試

```bash
# 執行測試（如果有配置）
npm run test

# 執行測試覆蓋率
npm run test:coverage
```

## 📊 效能優化

- 使用 React.memo 減少不必要的重新渲染
- Monaco Editor 延遲載入
- 圖片資源優化
- Code splitting

## 🔒 安全性

- 避免 XSS 攻擊
- API 請求加密
- 敏感資訊不提交至 Git

## 📝 授權

本專案為團隊內部使用專案。

## 👥 貢獻者

- 前端開發：[你的名字]
- 架構設計：[團隊成員]

## 📞 聯絡方式

如有問題或建議，請聯絡開發團隊。

---

**最後更新日期**: 2025-01-13
