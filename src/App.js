import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./LoginPage";
import Dashboard from "./DashboardPage";
import ProductPage from "./ProductPage";
import AddProductPage from "./AddProductPage";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer />

      <Routes>
        {/* Homepage with a link to products */}
        <Route
          path="/"
          element={
            <div>
              <h1>Welcome to the app!</h1>
              {/* Add a Link to the products page */}
              <Link to="/products">Go to Product Page</Link>
            </div>
          }
        />

        {/* Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protect product routes */}
        <Route
          path="/products"
          element={<ProtectedRoute element={<ProductPage />} />}
        />
        <Route
          path="/add-product"
          element={<ProtectedRoute element={<AddProductPage />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
