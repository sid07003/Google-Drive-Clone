import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Drive from './Components/Drive';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import HomePage from './Components/HomePage';
import SharedWithMe from './Components/SharedWithMe';
import Folders from './Screens/Folders';
import Home from './Screens/Home';

export const context_data = createContext();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentFolder, setCurrentFolder] = useState();
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

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
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div id="App">
      {console.log(isAuthenticated)}
      <context_data.Provider value={{
        currentFolder, setCurrentFolder, creatingFolder, setCreatingFolder, showNotification, setShowNotification
        , notification, setNotification, notificationColor, setNotificationColor, setIsAuthenticated
      }}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/*" element={isAuthenticated && <AuthenticatedRoutes />} />
          </Routes>
        </Router>
      </context_data.Provider>
    </div>
  );
}

function AuthenticatedRoutes() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/myDrive" element={<Drive />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/shared-with-me" element={<SharedWithMe />} />
        <Route path="/folder/:folderId" element={<Folders />} />
      </Routes>
    </>
  );
}