import React, { useState, useContext, useEffect } from 'react'
import "../SCSS/Content.scss"
import { useNavigate } from 'react-router-dom'

import { context_data } from '../App';

export default function Drive() {
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState([]);
  const [dataType, setDataType] = useState("all_data");
  const [showTypeOptions, setShowTypeOptions] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [foldersData, setFoldersData] = useState([]);
  const [filesData, setFilesData] = useState([]);

  const { creatingFolder, setCreatingFolder, setCurrentFolder, showNotification, setShowNotification, notification, setNotification,
    notificationColor, setNotificationColor } = useContext(context_data);

  useEffect(() => {
    setCurrentFolder("myDrive");
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
        setFilesData(data.filesData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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

  const filtingData = (dataType) => {
    setDataType(dataType);
    setShowTypeOptions(false);

    const filteredData = filesData.filter((e) => e.type === dataType);

    setFilteredData(filteredData);
  }

  const showFile = (path) => {
    window.open(path, '_blank');
  }

  const openFolder = (Id) => {
    navigate("/folder/" + Id);
  }

  const toggleIsStarred = (index, dataType) => {
    const updatedFilesData = [...filesData];
    updatedFilesData[index].isStarred = !updatedFilesData[index].isStarred;
    setFilesData(updatedFilesData);
  }

  const folderToggleIsStarred = (index) => {
    const updatedFoldersData = [...foldersData];
    updatedFoldersData[index].isStarred = !updatedFoldersData[index].isStarred;
    setFoldersData(updatedFoldersData);
  }


  return (
    <div id="Content">
      <div id="typeOptions" style={showTypeOptions ? { visibility: "visible" } : { visibility: "hidden" }}>
        <div className="options" style={{ backgroundColor: dataType === "documents" ? '#c2e7ff' : '' }}>
          <img src="../images/textFileIcon.png" alt="drive" id="ppt" style={{ height: "20px" }} />
          <div style={{ color: "black", marginLeft: "8px" }} onClick={() => { filtingData("documents") }}>Documents</div>
        </div>
        <div className="options" style={{ backgroundColor: dataType === "presentation" ? '#c2e7ff' : '' }}>
          <img src="../images/pptIcon.png" alt="drive" id="ppt" style={{ height: "20px" }} />
          <div style={{ color: "black", marginLeft: "8px" }} onClick={() => { filtingData("presentation") }}>Presentations</div>
        </div>
        <div className="options" style={{ backgroundColor: dataType === "image" ? '#c2e7ff' : '' }}>
          <img src="../images/photoIcon.png" alt="drive" id="ppt" style={{ height: "20px" }} />
          <div style={{ color: "black", marginLeft: "8px" }} onClick={() => { filtingData("image") }}>Images</div>
        </div>
        <div className="options" style={{ backgroundColor: dataType === "pdf" ? '#c2e7ff' : '' }}>
          <img src="../images/pdfIcon.png" alt="drive" id="ppt" style={{ height: "20px" }} />
          <div style={{ color: "black", marginLeft: "8px" }} onClick={() => { filtingData("pdf") }}>PDFs</div>
        </div>
        <div className="options" style={{ backgroundColor: dataType === "folder" ? '#c2e7ff' : '' }}>
          <img src="../images/folderIcon.png" alt="drive" id="ppt" style={{ height: "20px" }} />
          <div style={{ color: "black", marginLeft: "8px" }} onClick={() => { setDataType("folder"); setShowTypeOptions(false) }}>Folders</div>
        </div>
        <div className="options" style={{ backgroundColor: dataType === "audio" ? '#c2e7ff' : '' }}>
          <img src="../images/songIcon.png" alt="drive" id="ppt" style={{ height: "20px" }} />
          <div style={{ color: "black", marginLeft: "8px" }} onClick={() => { filtingData("audio") }}>Audio</div>
        </div>
        <div className="options" style={{ backgroundColor: dataType === "all_data" ? '#c2e7ff' : '' }}>
          <div style={{ color: "black", marginLeft: "8px" }} onClick={() => { setDataType("all_data"); setShowTypeOptions(false) }}>All Files</div>
        </div>
      </div>
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
        <div id="dropdown" onClick={() => { setShowTypeOptions(!showTypeOptions) }}>
          <div id="dropdown_type">
            Type
          </div>
          {
            showTypeOptions
              ?
              <i className="fa-solid fa-caret-up" id="dropdown_icon"></i>
              :
              <i className="fa-solid fa-caret-down" id="dropdown_icon"></i>
          }
        </div>
      </div>
      <div id="content_heading">
        <div className="star"></div>
        <div id="content_name">Name</div>
        <div id="content_owner">Owner</div>
        <div id="content_owner">Last modified</div>
        <div className="star"></div>
      </div>

      {
        dataType === "all_data"
          ?
          foldersData.length === 0 && filesData.length === 0
            ?
            <div id="empty">
              Currently no data ...
            </div>
            :
            <>
              {foldersData.map((element, index) => (
                <div key={index} id="files" onDoubleClick={() => { openFolder(element._id) }}>
                  <div className='star'>
                    {
                      element.isStarred
                        ?
                        <i className="fa-solid fa-star" style={{ color: "#FFD43B" }} id="action" onClick={() => { folderToggleIsStarred(index) }}></i>
                        :
                        <i className="fa-regular fa-star" id="action" onClick={() => { folderToggleIsStarred(index) }}></i>
                    }
                  </div>
                  <div id="file_name" style={{ display: "flex", alignItems: "center" }}>
                    <img src="../images/folderIcon.png" alt="drive" id="folder" style={{ height: "25px" }} />
                    <div style={{ marginLeft: "20px", fontWeight: "500" }}>{element.name}</div>
                  </div>
                  <div className="file_owner">me</div>
                  <div className="file_owner">{new Date(element.created_at).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="star" style={{ cursor: "pointer" }} >
                    <i className="fa-solid fa-ellipsis-vertical" id="action"></i>
                  </div>
                </div>
              ))}
              {
                filesData.map((element, index) => (
                  <div key={index} id="files" onDoubleClick={() => { showFile(element.path) }}>
                    <div className='star'>
                      {
                        element.isStarred
                          ?
                          <i className="fa-solid fa-star" style={{ color: "#FFD43B" }} id="action" onClick={() => { toggleIsStarred(index, element.type) }}></i>
                          :
                          <i className="fa-regular fa-star" id="action" onClick={() => { toggleIsStarred(index, element.type) }}></i>
                      }
                    </div>
                    <div id="file_name" style={{ display: "flex", alignItems: "center" }}>
                      {element.type === 'image' ? (
                        <img src="../images/photoIcon.png" alt="drive" id="image" style={{ height: "25px" }} />
                      ) : element.type === 'pdf' ? (
                        <img src="../images/pdfIcon.png" alt="drive" id="pdf" style={{ height: "25px" }} />
                      ) : element.type === 'presentation' ? (
                        <img src="../images/pptIcon.png" alt="drive" id="ppt" style={{ height: "25px" }} />
                      ) : element.type === 'text' ? (
                        <img src="../images/textFileIcon.png" alt="drive" id="textFile" style={{ height: "25px" }} />
                      ) : (
                        <img src="../images/songIcon.png" alt="drive" id="audo" style={{ height: "25px" }} />
                      )}
                      <div style={{ marginLeft: "20px", fontWeight: "500" }}>{element.name}</div>
                    </div>
                    <div className="file_owner">me</div>
                    <div className="file_owner">{new Date(element.uploaded_at).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div className="star" style={{ cursor: "pointer" }} >
                      <i className="fa-solid fa-ellipsis-vertical" id="action"></i>
                    </div>
                  </div>
                ))
              }
            </>
          :
          dataType === "folder"
            ?
            foldersData.length === 0
              ?
              <div id="empty">
                Currently no data ...
              </div>
              :
              foldersData.map((element, index) => (
                <div key={index} id="files" onDoubleClick={() => { openFolder(element._id) }}>
                  <div className='star'>
                    {
                      element.isStarred
                        ?
                        <i className="fa-solid fa-star" style={{ color: "#FFD43B" }} id="action" onClick={() => { toggleIsStarred(index, element.type) }}></i>
                        :
                        <i className="fa-regular fa-star" id="action" onClick={() => { toggleIsStarred(index, element.type) }}></i>
                    }
                  </div>
                  <div id="file_name" style={{ display: "flex", alignItems: "center" }}>
                    <img src="../images/folderIcon.png" alt="drive" id="folder" style={{ height: "25px" }} />
                    <div style={{ marginLeft: "20px", fontWeight: "500" }}>{element.name}</div>
                  </div>
                  <div className="file_owner">me</div>
                  <div className="file_owner">{new Date(element.created_at).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="star" style={{ cursor: "pointer" }} >
                    <i className="fa-solid fa-ellipsis-vertical" id="action"></i>
                  </div>
                </div>
              ))
            :
            filteredData.length === 0
              ?
              <div id="empty">
                Currently no data ...
              </div>
              :
              filteredData.map((element, index) => (
                <div key={index} id="files" onDoubleClick={() => { showFile(element.path) }}>
                  <div className='star'>
                    {
                      element.isStarred
                        ?
                        <i className="fa-solid fa-star" style={{ color: "#FFD43B" }} id="action" onClick={() => { toggleIsStarred(index, element.type) }}></i>
                        :
                        <i className="fa-regular fa-star" id="action" onClick={() => { toggleIsStarred(index, element.type) }}></i>
                    }
                  </div>
                  <div id="file_name" style={{ display: "flex", alignItems: "center" }}>
                    {element.type === 'image' ? (
                      <img src="../images/photoIcon.png" alt="drive" id="image" style={{ height: "25px" }} />
                    ) : element.type === 'pdf' ? (
                      <img src="../images/pdfIcon.png" alt="drive" id="pdf" style={{ height: "25px" }} />
                    ) : element.type === 'presentation' ? (
                      <img src="../images/pptIcon.png" alt="drive" id="ppt" style={{ height: "25px" }} />
                    ) : element.type === 'text' ? (
                      <img src="../images/textFileIcon.png" alt="drive" id="textFile" style={{ height: "25px" }} />
                    ) : (
                      <img src="../images/songIcon.png" alt="drive" id="audo" style={{ height: "25px" }} />
                    )}
                    <div style={{ marginLeft: "20px", fontWeight: "500" }}>{element.name}</div>
                  </div>
                  <div className="file_owner">me</div>
                  <div className="file_owner">{new Date(element.uploaded_at).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="star" style={{ cursor: "pointer" }} >
                    <i className="fa-solid fa-ellipsis-vertical" id="action"></i>
                  </div>
                </div>
              ))
      }
    </div>
  )
}
