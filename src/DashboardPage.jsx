import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("authToken");

    // If no token, redirect to login
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Make the API call to the /me endpoint
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        // Set the user data in state
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard</h2>
      <p>Click below to view the products:</p>
      <p>
        <Link to="/products">Go to Products</Link>
      </p>
      <p>
        <Link to="/categories">Go to Categories</Link>
      </p>
      <p>
        <Link to="/user">Go to User</Link>
      </p>
      {userData ? (
        <div>
          <h3>User Info:</h3>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* You can display more user data here */}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default DashboardPage;
