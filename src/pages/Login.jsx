import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

let Login = () => {
  let navigate = useNavigate();

  let [formData, setFormData] = useState({ email: "", password: "" });

  let [error, setError] = useState("");
  let [success, setSuccess] = useState("");

  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let res = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess("Login successful!");
      // save user in localStorage (optional)
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => navigate("/"), 2000); // redirect to homepage/dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="card" role="main" aria-label="Login to Frendora">
      <div className="brand" aria-hidden="true">
        <h1>Frendora</h1>
      </div>

      <form autoComplete="on" noValidate onSubmit={handleSubmit}>
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

        <div className="actions">
          <button className="btn" type="submit">
            Log In
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <p className="links">
          <Link to="#">Forgot password?</Link>
        </p>

        <p className="helper">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;