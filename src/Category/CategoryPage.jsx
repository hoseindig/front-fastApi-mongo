import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);

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
            <h1>Categories</h1>
            <ul>
                <li><Link to="/add-category">Add New</Link></li>
                {categories.map((category) => (
                    <li key={category.id}>{category.name}  ({category.description})</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryPage;
