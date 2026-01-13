import React from "react"
import { useUIStore } from '../store/useUIStore';


const baseButtonStyle = {
    padding: '8px 12px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
}

const ModeToggle: React.FC = () =>{
    const processingMode = useUIStore((state) =>state.processingMode);
    const setProcessingMode = useUIStore((state) =>state.setProcessingMode);

    const getButtonStyle = (isActive: boolean) => ({
        ...baseButtonStyle,  
        backgroundColor: isActive ? '#007bff' : '#ccc',
        marginRight: '5px',  
    });
    return(
        <div className="mode-toggle" style={{ marginBottom: '10px', textAlign: 'center' }}>
            <button
                onClick={() => setProcessingMode('single')}
                style={getButtonStyle(processingMode==='single')}
            >
                獨立檔案
            </button>
            <button
                onClick={() => setProcessingMode('multi')}
                style={getButtonStyle(processingMode === 'multi')}
            >
                關聯檔案
            </button>
        </div>
        
    )
        
    

    
};

export default ModeToggle;