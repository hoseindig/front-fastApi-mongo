import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCategoryPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');  // State for description
    const navigate = useNavigate();

    const handleAddCategory = async (e) => {
        e.preventDefault();

        const newCategory = { name, description };

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/category/`, newCategory);
            toast.success('Add Category successful! ');
            navigate('/categories'); // Redirect to categories page after successful submission
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <div>
            <h1>Add New Category</h1>
            <form onSubmit={handleAddCategory}>
                <div>
                    <label htmlFor="name">Category Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Category Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Add Category</button>
            </form>
        </div>
    );
};

export default AddCategoryPage;
