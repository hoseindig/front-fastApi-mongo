import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from API (simulated here)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products/`);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

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
                                <h3> name :{product.name}</h3>
                                <p> description :{product.description}</p>
                                <p> category :{product.category}</p>
                                <p>Price: ${product.price}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
