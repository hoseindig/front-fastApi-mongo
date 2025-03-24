import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddUserPage = () => {
  const { userId } = useParams(); // Get user ID from the URL (if editing)
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [family, setFamily] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [file, setFile] = useState(null);
  const [profile_image, setProfile_image] = useState(null);
  const [fileId, setFileId] = useState("");

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
          setProfile_image(user.profile_image);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to fetch user data.");
        }
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/files/upload/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFileId(data.file_url);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Upload failed: " + data.detail);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    }
  };

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
      password,
      profile_image: fileId,
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <h1>
        {userId ? "Edit User" : "Add New User"}
        {profile_image ? (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${profile_image}`}
            alt="Product"
            width="50"
            style={{ borderRadius: "50%", width: "20px", height: "20px" }}
            onError={(e) => {
              e.target.src = "/noimage.png";
            }}
          />
        ) : (
          <p>No Image</p>
        )}
      </h1>
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
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        {fileId && <p>File ID: {fileId}</p>}
      </div>

      {fileId ? (
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}${fileId}`}
          alt="Product"
          width="200"
          onError={(e) => {
            e.target.src = "/noimage.png";
          }}
        />
      ) : (
        <p>No Image</p>
      )}
    </div>
  );
};

export default AddUserPage;
