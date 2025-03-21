import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');  // New state for category
    const navigate = useNavigate();

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const newProduct = { name, description, price, category };  // Include category in the new product data

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/products/`, newProduct);
            navigate('/products'); // Redirect to products page after successful submission
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

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

                {/* New category input */}
                <div>
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProductPage;
