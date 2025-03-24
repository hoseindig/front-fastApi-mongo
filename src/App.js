import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./DashboardPage";
import ProductsPage from "./Product/ProductPage";
import UsersPage from "./User/UsertPage";

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
