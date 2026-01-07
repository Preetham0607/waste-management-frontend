import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CitizenLogin() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const login = async () => {
    if (!mobile || !password) {
      alert("Please enter both Mobile and Password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/citizens/login",
        null,
        { params: { mobile, password } }
      );

      if (res.data) {
        sessionStorage.setItem("citizen", JSON.stringify(res.data));
        alert("Login Successful");
        nav("/citizen/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid Mobile or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div className="card shadow-lg border-0" style={{ width: "400px" }}>
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0 fw-bold">👤 Citizen Login</h4>
        </div>

        <div className="card-body p-4">
          {/* Mobile */}
          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
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
