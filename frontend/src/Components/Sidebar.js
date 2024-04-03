import React, { useState, useContext, useEffect } from 'react';
import "../SCSS/Sidebar.scss";
import { context_data } from '../App';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    const [isSelected, setIsSelected] = useState(0);
    const [showOptions, setShowOption] = useState(false);

    const { creatingFolder, setCreatingFolder, currentFolder, setShowNotification,
        setNotification, setNotificationColor } = useContext(context_data);

    const handleFileChange = (e) => {
        e.preventDefault();
        setShowOption(false);

        const files = e.target.files;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        if (currentFolder === 'myDrive' || currentFolder === 'home' || currentFolder === 'shared-with-me' || currentFolder === 'recent' || currentFolder === 'starred') {
            fetch("http://localhost:3001/uploadFile", {
                method: "POST",
                headers: {
                },
                body: formData,
                credentials: "include"
            })
                .then((res) => {
                    if (res.status === 400) {
                        setNotification("File not supported");
                        setNotificationColor("red");
                        setShowNotification(true);
                        setTimeout(() => {
                            setShowNotification(false);
                        }, 2000);
                    }
                    else {
                        setNotification("File uploaded successully");
                        setNotificationColor("rgb(21, 255, 0)");
                        setShowNotification(true);
                        setTimeout(() => {
                            setShowNotification(false);
                        }, 2000);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            formData.append('currentFolder', currentFolder);

            fetch("http://localhost:3001/uploadFileInFolder", {
                method: "POST",
                headers: {
                },
                body: formData,
                credentials: "include"
            })
                .then((res) => {
                    if (res.status === 400) {
                        setNotification("File not supported");
                        setNotificationColor("red");
                        setShowNotification(true);
                        setTimeout(() => {
                            setShowNotification(false);
                        }, 2000);
                    }
                    else {
                        setNotification("File uploaded successully");
                        setNotificationColor("rgb(21, 255, 0)");
                        setShowNotification(true);
                        setTimeout(() => {
                            setShowNotification(false);
                        }, 2000);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    useEffect(() => {
        if (currentFolder === 'home') {
            setIsSelected(1);
        }
        else if (currentFolder === 'myDrive') {
            setIsSelected(2);
        }
        else if (currentFolder === 'shared-with-me') {
            setIsSelected(3);
        }
        else if (currentFolder === 'recent') {
            setIsSelected(4);
        }
        else if (currentFolder === 'starred') {
            setIsSelected(5);
        }
    }, [currentFolder])

    return (
        <div id="Sidebar">
            <input
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="fileInput"
                multiple
            ></input>
            <div id="background-cover" style={creatingFolder ? { visibility: "visible" } : { visibility: "hidden" }}></div>
            <div id="logo_title">
                <img src="../images/drive.webp" alt="drive" id="logo"></img>
                <div id="title">Drive</div>
            </div>
            <div id="new_file" onClick={() => { setShowOption(true) }}>
                <i className="fa-solid fa-plus" id="plus"></i>
                <div id="new">New</div>
            </div>
            <div id="showOptions" style={showOptions ? { visibility: "visible" } : { visibility: "hidden" }}>
                <i className="fa-solid fa-xmark"
                    style={{ position: "absolute", right: "10px", fontSize: "20px", top: "5px", cursor: "pointer" }}
                    onClick={() => { setShowOption(false) }}></i>

                <div className="options" onClick={() => { setCreatingFolder(true); setShowOption(false) }}>
                    <i className="fa-solid fa-folder-plus" style={{ paddingLeft: "10px" }}></i>
                    <div style={{ paddingLeft: "10px" }}>New Folder</div>
                </div>
                <div className="options" onClick={() => { document.getElementById("fileInput").click() }}>
                    <i className="fa-solid fa-upload" style={{ paddingLeft: "10px" }}></i>
                    <div style={{ paddingLeft: "10px" }}>File upload</div>
                </div>
                <div id="options_special">
                    <i className="fa-solid fa-upload" style={{ paddingLeft: "10px" }}></i>
                    <div style={{ paddingLeft: "10px" }}>Folder upload</div>
                </div>
            </div>
            <div id="library">
                <Link to={"/home"} className="home" style={{ backgroundColor: isSelected === 1 ? '#c2e7ff' : '' }} onClick={() => { setIsSelected(1) }}>
                    <div className="home_content">
                        <i className="fa-solid fa-house" id="icon"></i>
                        <div style={{ marginLeft: "10px" }}>Home</div>
                    </div>
                </Link>
                <Link to={"/mydrive"} className="home" style={{ backgroundColor: isSelected === 2 ? '#c2e7ff' : '' }} onClick={() => { setIsSelected(2) }}>
                    <div className="home_content">
                        <i className="fa-solid fa-hard-drive" id="icon"></i>
                        <div style={{ marginLeft: "10px" }}>My Drive</div>
                    </div>
                </Link>
                <Link to={"/shared-with-me"} className="home" style={{ backgroundColor: isSelected === 3 ? '#c2e7ff' : '', marginTop: "20px" }} onClick={() => { setIsSelected(3) }}>
                    <div className="home_content">
                        <i className="fa-solid fa-user-group" id="icon"></i>
                        <div style={{ marginLeft: "10px" }}>Shared with me</div>
                    </div>
                </Link>
                <div className="home" style={{ backgroundColor: isSelected === 4 ? '#c2e7ff' : '' }} onClick={() => { setIsSelected(4) }}>
                    <div className="home_content">
                        <i className="fa-regular fa-clock" id="icon"></i>
                        <div style={{ marginLeft: "10px" }}>Recent</div>
                    </div>
                </div>
                <div className="home" style={{ backgroundColor: isSelected === 5 ? '#c2e7ff' : '' }} onClick={() => { setIsSelected(5) }}>
                    <div className="home_content">
                        <i className="fa-regular fa-star" id="icon"></i>
                        <div style={{ marginLeft: "10px" }}>Starred</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
