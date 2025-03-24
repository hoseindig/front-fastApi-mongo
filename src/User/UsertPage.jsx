import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  CircularProgress,
  Button,
  Box,
  Chip, // ✅ Import Chip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/users/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        const detail = error?.response?.data?.detail;
        console.error("Error deleting user:", error?.response?.data?.detail);
        toast.error(detail ? detail : "Failed to delete user.");
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin":
        return "error"; // Red
      case "admin":
        return "primary"; // Blue
      case "user":
      default:
        return "success"; // Green
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/add-user"
        sx={{ mb: 2 }}
      >
        ➕ Add New User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users available
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar
                      src={`${process.env.REACT_APP_API_BASE_URL}${user.profile_image}`}
                      alt={user.name}
                      onError={(e) => {
                        e.target.src = "/noimage.png";
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {user.name} {user.family}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.toUpperCase()}
                      color={getRoleColor(user.role)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        component={Link}
                        to={`/add-user/${user.id}`}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      {user.role !== "super_admin" && (
                        <IconButton
                          onClick={() => handleDelete(user.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserPage;
