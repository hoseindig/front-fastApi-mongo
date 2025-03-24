import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./DashboardPage";
import ProductsPage from "./Product/ProductPage";
import UsersPage from "./User/UsertPage";
import AddUserPage from "./User/AddUserPage";
import AddProductPage from "./Product/AddProductPage";
import LoginPage from "./LoginPage";

function App() {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Routes>
      {/* Login Page (No Layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes (With Admin Layout) */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <AdminLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/add-product" element={<AddProductPage />} />
                <Route
                  path="/add-product/:productId"
                  element={<AddProductPage />}
                />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/add-user/:userId" element={<AddUserPage />} />
                <Route path="/add-user" element={<AddUserPage />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
