import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/users/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/category/`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Product deleted successfully!");
        setProducts(products.filter((product) => product.id !== id)); // Remove from UI
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <Typography variant="h4">Users</Typography>
      <Link to="/add-user">➕ Add New Users</Link>
      <div>
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <h3>
                  {product.name} {product.family}
                </h3>
                <p>mobile: {product.mobile}</p>
                <p>email: {product.email}</p>
                {product.profile_image ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${product.profile_image}`}
                    alt="Product"
                    width="50"
                    onError={(e) => {
                      e.target.src = "/noimage.png";
                    }}
                  />
                ) : (
                  <p>No Image</p>
                )}
                <p>
                  <Link
                    to={`/add-user/${product.id}`}
                    style={{ marginRight: "10px" }}
                  >
                    ✏️ Edit
                  </Link>
                  <button onClick={() => handleDelete(product.id)}>
                    🗑️ Delete
                  </button>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserPage;
