import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./LoginPage";
import Dashboard from "./DashboardPage";
import ProductPage from "./ProductPage";
import AddProductPage from "./AddProductPage";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute
import CategoryPage from "./CategoryPage"; // Import the CategoryPage
import AddCategoryPage from "./AddCategoryPage"; // Import AddCategoryPage
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
              <p>
                <Link to="/products">Go to Product Page</Link>
              </p>
              <p>
                <Link to="/categories">Go to Categories</Link>
              </p>
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
        {/* Category routes */}
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
