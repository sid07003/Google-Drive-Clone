import React, { useEffect, useState } from 'react'
import "../SCSS/Navbar.scss"
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [showUserStatus, setShowUserStatus] = useState(false);

    const logout = () => {
        fetch("http://localhost:3001/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials:"include"
        })
            .then((res) => {
                navigate("/login");
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div id="Navbar">
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
                <div id="search_bar_area">
                    <i className="fa-solid fa-magnifying-glass" id="search_icon"></i>
                    <input type="text" placeholder="Search in Drive" id="searchbar" />
                </div>
            </div>

            <div id="loginsignup" style={showUserStatus ? { visibility: "visible", textDecoration: "none" } : { visibility: "hidden", textDecoration: "none" }} onClick={logout}>
                <div>Logout</div>
            </div>

            <div id="user" onClick={() => { setShowUserStatus(!showUserStatus) }}>
                <i className="fa-solid fa-user" id="user_icon"></i>
            </div>
        </div>
    )
}
