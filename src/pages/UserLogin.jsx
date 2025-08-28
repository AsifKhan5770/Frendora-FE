import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from '../utils/api';

const UserLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await apiFetch("users/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful!");
      setTimeout(() => navigate("/"), 1000); // redirect to home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5 pt-5 d-flex justify-content-center align-items-center">
      <div className="card" style={{ width: "400px", padding: "20px" }}>
        <h2 className="text-center mb-4">Login to Frendora</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="btn btn-primary w-100" type="submit">
            Log In
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;