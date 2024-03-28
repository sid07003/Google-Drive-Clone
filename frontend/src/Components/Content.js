import React, { useState, useContext, useEffect } from 'react'
import "../SCSS/Content.scss"
import { useNavigate, useParams } from 'react-router-dom'

import { context_data } from '../App';

export default function Content() {
  const navigate = useNavigate();
  const { page } = useParams();

  const [createFolder, setCreateFolder] = useState();
  const [folderName, setFolderName] = useState("");
  const { currentFolder, setCurrentFolder } = useContext(context_data);

  useEffect(() => {
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
        }
        else {
          console.log(page);
          setCurrentFolder(page);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  })

  return (
    <div id="Content">
      <div id="cover">
        <div id="create_area">
          <div id="newFolder">
            New Folder
          </div>
          <form style={{width:"100%",height:"40px"}}>
            <input id="folder_input" value={folderName} onChange={(e) => { setFolderName(e.target.value) }} placeholder="Enter your folder name" />
          </form>
          <div id="button_area">
            <div id="cancel_button">Cancel</div>
            <div id="create_button">Create</div>
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
          <i class="fa-solid fa-caret-down" id="dropdown_icon"></i>
        </div>
      </div>
      <div id="content_heading">
        <div id="content_name">Name</div>
        <div id="content_owner">Owner</div>
        <div id="content_owner">Last modified</div>
        <div id="content_owner">Actions</div>
      </div>
      <div id="empty">
        Currently no data ...
      </div>
    </div>
  )
}
