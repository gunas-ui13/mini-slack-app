import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      // 1. Save the Token and User ID in the browser's memory
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("username", res.data.username);

      console.log("Login Success:", res.data);
      alert("Login Successful!");
      
      // 2. Go to the Chat Page
      navigate("/chat");
      
    } catch (err) {
      console.error(err);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit} className="auth-form">
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
        <button type="submit">Login</button>
      </form>
      <p className="auth-link">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}