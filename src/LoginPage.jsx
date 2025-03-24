import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Box,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        email,
        password,
      });

      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem("authToken", access_token);
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 200);
      }
    } catch (error) {
      toast.error("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2 }}>
          <LockIcon />
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
