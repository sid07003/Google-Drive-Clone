import React, {useState} from 'react';
import "../SCSS/Sidebar.scss";

export default function Sidebar() {
    const [isSelected,setIsSelected]=useState(1);

    return (
        <div id="Sidebar">
            <div id="logo_title">
                <img src="../images/drive.webp" alt="drive" id="logo"></img>
                <div id="title">Drive</div>
            </div>
            <div id="new_file">
                <i className="fa-solid fa-plus" id="plus"></i>
                <div id="new">New</div>
            </div>
            <div id="library">
                <div className="home" style={{ backgroundColor: isSelected === 1 ? '#c2e7ff' : '' }} onClick={()=>{setIsSelected(1)}}>
                    <div className="home_content">
                        <i className="fa-solid fa-house" id="icon"></i>
                        <div style={{marginLeft:"10px"}}>Home</div>
                    </div>
                </div>
                <div className="home" style={{ backgroundColor: isSelected === 2 ? '#c2e7ff' : '' }} onClick={()=>{setIsSelected(2)}}>
                    <div className="home_content">
                        <i className="fa-solid fa-hard-drive" id="icon"></i>
                        <div style={{marginLeft:"10px"}}>My Drive</div>
                    </div>
                </div>
                <div className="home" style={{ backgroundColor: isSelected === 3 ? '#c2e7ff' : '',marginTop:"20px" }} onClick={()=>{setIsSelected(3)}}>
                    <div className="home_content">
                        <i className="fa-solid fa-user-group" id="icon"></i>
                        <div style={{marginLeft:"10px"}}>Shared with me</div>
                    </div>
                </div>
                <div className="home" style={{ backgroundColor: isSelected === 4 ? '#c2e7ff' : '' }} onClick={()=>{setIsSelected(4)}}>
                    <div className="home_content">
                        <i className="fa-regular fa-clock" id="icon"></i>
                        <div style={{marginLeft:"10px"}}>Recent</div>
                    </div>
                </div>
                <div className="home" style={{ backgroundColor: isSelected === 5 ? '#c2e7ff' : '' }} onClick={()=>{setIsSelected(5)}}>
                    <div className="home_content">
                        <i className="fa-regular fa-star" id="icon"></i>
                        <div style={{marginLeft:"10px"}}>Starred</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
