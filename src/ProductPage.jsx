import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);  // List of categories

    // Fetch products from API (simulated here)
    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem("authToken"); // Get the token from localStorage
            if (!token) {
                // Redirect to login if no token
                window.location.href = "/login";
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
                // Handle unauthorized access (401 error)
                if (error.response && error.response.status === 401) {
                    window.location.href = "/login"; // Redirect to login page
                }
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <div>
            <h1>Product List</h1>
            <div>
                {products.length === 0 ? (
                    <>
                        <p>No products available</p>
                        <li><Link to="/add-product">Add New</Link></li>
                    </>
                ) : (
                    <ul>
                        <li><Link to="/add-product">Add New</Link></li>
                        {products.map((product) => (
                            <li key={product.id}>
                                <h3> Name: {product.name}</h3>
                                <p> Description: {product.description}</p>
                                <p> Category: {categories.find(x => x.id === product.category_id)?.name}</p>
                                <p> Price: ${product.price}</p>
                                {product.image_id ? (
                                    <img
                                        src={`${process.env.REACT_APP_API_BASE_URL}${product.image_id}`}
                                        alt="Product"
                                        width="50"
                                        onError={(e) => { e.target.src = "/noimage.png"; }} // Fallback image in case of an error
                                    />
                                ) : (
                                    <p>No Image</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
