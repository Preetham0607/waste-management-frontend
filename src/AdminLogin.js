import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/api/admins/login", {
        username,
        password,
      });

      if (res.data) {
        sessionStorage.setItem("role", "ADMIN");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#fdfdfeff" }}
    >
      <div className="card shadow-lg border-0" style={{ width: "400px" }}>
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0 fw-bold">🔐 Admin Login</h4>
        </div>

        <div className="card-body p-4">
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <div className="d-grid">
            <button
              className="btn btn-primary"
              onClick={login}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>

        <div className="card-footer text-center text-muted">
          © Waste Management System
        </div>
      </div>
    </div>
  );
}
