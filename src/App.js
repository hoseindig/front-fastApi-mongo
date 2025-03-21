import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an auth token in localStorage
    const token = localStorage.getItem("authToken");
    // If no token exists, redirect to the login page
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/" element={<h1>Welcome to the app!</h1>} />
    </Routes>
  );
};

export default App;
