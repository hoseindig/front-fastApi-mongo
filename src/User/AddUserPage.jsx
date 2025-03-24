import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddUserPage = () => {
  const { userId } = useParams(); // Get user ID from the URL (if editing)
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            window.location.href = "/login";
            return;
          }
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const user = response.data;
          setName(user.name);
          setFamily(user.family);
          setEmail(user.email);
          setMobile(user.mobile);
          setRole(user.role);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to fetch user data.");
        }
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const userData = {
      name,
      family,
      email,
      mobile,
      role,
    };

    try {
      if (userId) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("User updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/users/`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("User added successfully!");
      }
      navigate("/users");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user.");
    }
  };

  return (
    <div>
      <h1>{userId ? "Edit User" : "Add New User"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">First Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="family">Last Name:</label>
          <input
            type="text"
            id="family"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            required
          />
        </div>

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
          <label htmlFor="mobile">Mobile:</label>
          <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit">{userId ? "Update User" : "Add User"}</button>
      </form>
    </div>
  );
};

export default AddUserPage;
