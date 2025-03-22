import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category_id, setCategory] = useState('');  // Store selected category ID
    const [categories, setCategories] = useState([]);  // List of categories
    const [file, setFile] = useState(null);
    const [fileId, setFileId] = useState('');
    const navigate = useNavigate();

    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload file function
    const uploadFile = async () => {
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/files/upload/`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setFileId(data.file_id);
                toast.success("File uploaded successfully!");
            } else {
                toast.error("Upload failed: " + data.detail);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file");
        }
    };

    // Handle product submission
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const newProduct = { name, description, price, category_id, image_id: fileId };

        const token = localStorage.getItem("authToken"); // Get token from localStorage
        if (!token) {
            window.location.href = "/login"; // Redirect to login if no token
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/products/`,
                newProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                }
            );
            toast.success('Product added successfully!');
            navigate('/products');  // Redirect to products page
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product.');
        }
    };

    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            <h1>Add New Product</h1>
            <form onSubmit={handleAddProduct}>
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

                {/* Category dropdown */}
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
                <div>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={uploadFile}>Upload</button>
                    {fileId && <p>File ID: {fileId}</p>}
                </div>
                {fileId ? (
                    <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/files/image/${fileId}.jpg`}
                        alt="Product"
                        width="200"
                        onError={(e) => { e.target.src = "/noimage.png"; }} // Fallback image in case of an error
                    />
                ) : (

                    <p>No Image
                    </p>
                )}

                <button type="submit">Add Product</button>
            </form>


        </div>
    );
};

export default AddProductPage;
