import React from 'react';

interface CodeEditorHeaderProps{
    fileName: string;
    loading: boolean;
    onRethinkClick: () => void;
    onDeployClick: () => void;
}

const baseButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const CodeDiffHeaderStyle: React.CSSProperties ={
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
}

const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({fileName, loading, onRethinkClick, onDeployClick}) => {
    
    return (
        <div className='code-diff-header' style={CodeDiffHeaderStyle}>
            <h3>程式碼比對 - {fileName}</h3>
            <div>
                <button
                    onClick={onRethinkClick}
                    style={{
                        ...baseButtonStyle, 
                        backgroundColor: '#007bff',
                        marginRight: '10px'
                    }}
                    disabled={loading}
                >
                AI rethink
                </button>
                <button
                    onClick={onDeployClick}
                    style={{
                        ...baseButtonStyle,
                        backgroundColor: '#28a745',
                    }}
                    disabled={loading}
                >
                自動部屬
                </button>
            </div>

        </div>
    )
}

export default CodeEditorHeader;