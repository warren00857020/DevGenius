import React from "react";

interface HeaderProps{
    title?: string
}

const Header:React.FC<HeaderProps> = ({title="AI 維運懶人包 tu_tu_tu_du"}) =>{
    return(
        <div className="title-container">
            <h2>{title}</h2>
        </div>
    );
};

export default Header;