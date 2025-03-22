import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category_id, setCategory] = useState('');  // Store selected category ID
    const [categories, setCategories] = useState([]);  // List of categories

    const navigate = useNavigate();

    // Handle product submission
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const newProduct = { name, description, price, category_id }; // Send category ID

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/products/`, newProduct);
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

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProductPage;
