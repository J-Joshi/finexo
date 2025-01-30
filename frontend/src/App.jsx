import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Correct import
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;
