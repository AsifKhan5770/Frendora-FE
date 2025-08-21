import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

let Signup = () => {
  let navigate = useNavigate();

  let [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  let [error, setError] = useState("");
  let [success, setSuccess] = useState("");

  // Handle input changes
  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  let handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic password match check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      let res = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      let data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 2000); // redirect after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="card" role="main" aria-label="Sign up for Frendora">
      <div className="brand" aria-hidden="true">
        <h1>Frendora</h1>
      </div>

      <form autoComplete="on" noValidate onSubmit={handleSubmit}>
        <label className="field">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <div className="actions">
          <button className="btn" type="submit">
            Sign Up
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <p className="helper">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
};

export default Signup;