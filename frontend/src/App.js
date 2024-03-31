import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Drive from './Components/Drive';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import HomePage from './Components/HomePage';
import SharedWithMe from './Components/SharedWithMe';

export const context_data = createContext();

export default function App() {
  const [currentFolder, setCurrentFolder] = useState();
  const [creatingFolder, setCreatingFolder] = useState(false);

  return (
    <div id="App">
      <context_data.Provider value={{ currentFolder, setCurrentFolder, creatingFolder, setCreatingFolder }}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<DefaultLayout />} />
          </Routes>
        </Router>
      </context_data.Provider>
    </div>
  );
}

function DefaultLayout() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/myDrive" element={<Drive />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/shared-with-me" element={<SharedWithMe />} />
      </Routes>
    </>
  );
}
