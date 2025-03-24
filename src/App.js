import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./LoginPage";
import Dashboard from "./DashboardPage";
import ProductPage from "./Product/ProductPage";
import AddProductPage from "./Product/AddProductPage";
import ProtectedRoute from "./ProtectedRoute";
import CategoryPage from "./Category/CategoryPage";
import AddCategoryPage from "./Category/AddCategoryPage";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import UserPage from "./User/UsertPage";
import AddUserPage from "./User/AddUserPage";

const App = () => {
  const location = useLocation(); // Get the current route
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // If no token and not on the login page, redirect to login
    if (!token && location.pathname !== "/login") {
      window.location.href = "/login";
      return;
    }

    // Fetch user data if token exists
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data); // Store user data
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login"; // Redirect on unauthorized access
        }
      }
    };

    if (token) fetchUserData();
  }, [location.pathname]); // Re-run when the route changes

  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Welcome to the app!</h1>
              <p>
                <Link to="/products">Go to Product Page</Link>
              </p>
              <p>
                <Link to="/categories">Go to Categories</Link>
              </p>
              <p>
                <Link to="/users">Go to User</Link>
              </p>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/users"
          element={<ProtectedRoute element={<UserPage />} />}
        />
        <Route
          path="/add-user"
          element={<ProtectedRoute element={<AddUserPage />} />}
        />
        <Route
          path="/add-user/:userId?"
          element={<ProtectedRoute element={<AddUserPage />} />}
        />

        <Route
          path="/products"
          element={<ProtectedRoute element={<ProductPage />} />}
        />
        <Route
          path="/add-product"
          element={<ProtectedRoute element={<AddProductPage />} />}
        />
        <Route
          path="/add-product/:productId?"
          element={<ProtectedRoute element={<AddProductPage />} />}
        />

        <Route
          path="/categories"
          element={<ProtectedRoute element={<CategoryPage />} />}
        />
        <Route
          path="/add-category"
          element={<ProtectedRoute element={<AddCategoryPage />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
