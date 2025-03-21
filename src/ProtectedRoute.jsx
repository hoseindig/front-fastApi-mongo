import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('authToken'); // Replace with cookie check if needed
    if (!token) {
        // Redirect to login page if no token found
        return <Navigate to="/login" />;
    }

    return element; // Render the requested element if authenticated
};

export default ProtectedRoute;
