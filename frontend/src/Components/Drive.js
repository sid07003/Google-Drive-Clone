import React, { useState, useContext, useEffect } from 'react'
import "../SCSS/Content.scss"
import { useNavigate } from 'react-router-dom'

import { context_data } from '../App';

export default function Drive() {
  const navigate = useNavigate();

  const [folderName, setFolderName] = useState("");
  const [foldersData, setFoldersData] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

  const { creatingFolder, setCreatingFolder, setCurrentFolder } = useContext(context_data);

  useEffect(() => {
    setCurrentFolder("my drive")
    authenticateAndFetchData();
  }, []);

  const authenticateAndFetchData = () => {
    fetch("http://localhost:3001/checkAuth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
        } else {
          fetchData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchData = () => {
    fetch("http://localhost:3001/fetchAllData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        setFoldersData(data.foldersData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const createFolder = () => {
    fetch("http://localhost:3001/createFolder", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ folderName: folderName, parent: null }),
      credentials: "include"
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 400) {
          setShowNotification(true);
          setNotification("Error: Folder already exists");
          setNotificationColor("red");
          setFolderName("");
          setTimeout(() => {
            setShowNotification(false);
          }, 2000);
          return;
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        setFolderName("");
        setCreatingFolder(false);
        setShowNotification(true);
        setNotification("Folder Successfully created");
        setNotificationColor("rgb(21, 255, 0)");
        setFolderName("");
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
      });
  }


  return (
    <div id="Content">
      <div id="home_page_notifications" style={showNotification ? { visibility: "visible", color: `${notificationColor}`, outline: `2px solid ${notificationColor}` } : { visibility: "hidden" }}>
        {notification}
      </div>
      <div id="cover" style={creatingFolder ? { visibility: "visible" } : { visibility: "hidden" }}>
        <div id="create_area">
          <div id="newFolder">
            New Folder
          </div>
          <form style={{ width: "100%", height: "40px" }}>
            <input id="folder_input" value={folderName} onChange={(e) => { setFolderName(e.target.value) }} placeholder="Enter your folder name" />
          </form>
          <div id="button_area">
            <div id="cancel_button" onClick={() => { setCreatingFolder(false) }}>Cancel</div>
            <div id="create_button" onClick={createFolder}>Create</div>
          </div>
        </div>
      </div>
      <div id="heading">
        <p style={{ marginLeft: "15px" }}>Home</p>
      </div>
      <div id="important_elements">
        <div id="dropdown">
          <div id="dropdown_type">
            Type
          </div>
          <i className="fa-solid fa-caret-down" id="dropdown_icon"></i>
        </div>
      </div>
      <div id="content_heading">
        <div id="content_name">Name</div>
        <div id="content_owner">Owner</div>
        <div id="content_owner">Last modified</div>
        <div id="content_owner">Actions</div>
      </div>
      {
        foldersData.length !== 0
          ?
          foldersData.map((element, index) => (
            <div key={index} id="files">
              <div id="file_name" style={{ display: "flex", alignItems: "center" }}>
                <i className="fa-solid fa-folder" style={{ color: "#444746", fontSize: "20px" }}></i>
                <div style={{ marginLeft: "20px" }}>{element.name}</div>
              </div>
              <div className="file_owner">me</div>
              <div className="file_owner">{new Date(element.created_at).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div className="file_owner" style={{ cursor: "pointer" }} >
                <i className="fa-solid fa-ellipsis-vertical" id="action"></i>
              </div>
            </div>
          ))
          :
          <div id="empty">
            Currently no data ...
          </div>
      }
    </div>
  )
}
