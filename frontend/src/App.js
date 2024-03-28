import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Content from './Components/Content';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Home from './Screens/Home';

export const context_data = createContext();

export default function App() {
  const [currentFolder, setCurrentFolder] = useState();

  return (
    <div id="App">
      <context_data.Provider value={{ currentFolder, setCurrentFolder }}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/:page/*" element={<DefaultLayout />} />
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
        <Route path="/" element={<Content />} />
      </Routes>
    </>
  );
}
