import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Get the base URL from the environment variable
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        try {
            const response = await axios.post(`${apiBaseUrl}/auth/login`, {
                email,
                password,
            });
            // Assuming the response contains the token
            const { access_token } = response.data;
            if (access_token) {
                // Save the token to localStorage
                localStorage.setItem('authToken', access_token);

                // Show success toast
                toast.success('Login successful! Redirecting to dashboard...');

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 200); // You can adjust the time as needed
            }
        } catch (error) {
            // Show error toast
            toast.error('Login failed. Please check your credentials.');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {/* ToastContainer will render the toast notifications */}
            <ToastContainer />
        </div>
    );
};

export default Login;
