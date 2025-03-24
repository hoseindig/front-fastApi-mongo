import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const { productId } = useParams(); // Get product ID from the URL (if editing)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category_id, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

    const fetchProduct = async () => {
      debugger;
      if (productId) {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            window.location.href = "/login";
            return;
          }
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          /*  await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );*/
          const product = response.data;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category_id);
          setFileId(product.image_id); // Load existing image ID
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchCategories();
    if (productId) fetchProduct();
  }, [productId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/files/upload/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFileId(data.file_url);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Upload failed: " + data.detail);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const productData = {
      name,
      description,
      price,
      category_id,
      image_id: fileId,
    };

    try {
      if (productId) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/products/`,
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Product added successfully!");
      }
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product.");
    }
  };

  return (
    <div>
      <h1>{productId ? "Edit Product" : "Add New Product"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category_id}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">
          {productId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        {fileId && <p>File ID: {fileId}</p>}
      </div>

      {fileId ? (
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}${fileId}`}
          alt="Product"
          width="200"
          onError={(e) => {
            e.target.src = "/noimage.png";
          }}
        />
      ) : (
        <p>No Image</p>
      )}
    </div>
  );
};

export default AddProductPage;
