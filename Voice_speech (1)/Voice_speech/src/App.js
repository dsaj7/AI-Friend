import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/register/Signup.jsx";
import Home from "./components/homepage/Home.jsx";
import Login from "./components/register/Login.jsx";
import Forgotpass from "./components/register/Forgotpass.jsx";
import Password from "./components/register/Password.jsx";
import Voice from "./components/voice/Voice.jsx";
import Otpfile from "./components/register/Otpfile.jsx";


const App = () => {
  const [showVoice, setShowvoice] = useState(true);

  const toggleVoice = () => {
    setShowvoice((prevState) => !prevState);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            showVoice ? (
              <Home onOpenVoice={toggleVoice} />
            ) : (
              <Voice onClose={toggleVoice} />
            )
          }
        />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Forgotpass" element={<Forgotpass />} />
        <Route path="/Password" element={<Password />} />
        <Route path="/Otpfile" element={<Otpfile />} />
      </Routes>
    </Router>
  );
};

export default App;
