import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TestPanelProps{
    advice?: string;                           // 後端建議（可選）
    isTesting: boolean;                        // 是否正在測試
    testProgress: string[];                    // 測試進度訊息
    fileLogs: { [fileName: string]: string };  // 檔案 logs
    onTestClick: () => void;                   // 測試按鈕點擊
    onLogClick: (fileName: string) => void;    // Log 連結點擊
}

// 測試按鈕樣式
const testButtonStyle: React.CSSProperties = {
  marginTop: '15px',
  padding: '10px 15px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  width: '100%',
};

// 進度區域樣式
const progressContainerStyle: React.CSSProperties = {
  marginTop: '15px',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #ddd',
  borderRadius: '5px',
};

// Log 連結樣式
const logLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#007bff',
};

const TestPanel: React.FC<TestPanelProps> = ({
  advice,
  isTesting,
  testProgress,
  fileLogs,
  onTestClick,
  onLogClick,
}) => {
  return (
    <aside className="advice-panel">
      {/* 1️⃣ 後端建議區 */}
      <h3>後端建議</h3>
      {advice ? (
        <ReactMarkdown>{advice}</ReactMarkdown>
      ) : (
        <p>尚無建議</p>
      )}

      {/* 2️⃣ 測試按鈕 */}
      <button
        onClick={onTestClick}
        style={testButtonStyle}
        disabled={isTesting}
      >
        {isTesting ? '測試中...' : '測試專案'}
      </button>

      {/* 3️⃣ 測試進度 */}
      <div style={progressContainerStyle}>
        <strong>測試進度:</strong>
        <ul>
          {testProgress.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>

      {/* 4️⃣ Log 檔案列表 */}
      {Object.keys(fileLogs).map((fileName) => (
        <div key={fileName} style={{ marginBottom: '5px' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogClick(fileName);
            }}
            style={logLinkStyle}
          >
            <span role="img" aria-label="log">📄</span> {fileName}
          </a>
        </div>
      ))}
    </aside>
  );
};

export default TestPanel;