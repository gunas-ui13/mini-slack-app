import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  // 1. State to hold form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // 2. Update state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page from reloading
    try {
      // Send data to Backend
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      console.log("Registered:", res.data);
      alert("Registration Successful! Please Login.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data || "Registration failed"));
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}