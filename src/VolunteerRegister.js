import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VolunteerRegister() {
  const [form, setForm] = useState({ name: "", mobile: "", areaId: "", password: "" });
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch areas on mount
  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/areas");
      setAreas(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load areas");
    }
  };

  const register = async () => {
    if (!form.name || !form.mobile || !form.areaId || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8080/api/volunteers?areaId=${form.areaId}`,
        {
          name: form.name,
          mobile: form.mobile,
          password: form.password,
        }
      );
      alert("Registration successful");
      setForm({ name: "", mobile: "", areaId: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div className="card shadow-lg border-0" style={{ width: "400px" }}>
        <div className="card-header bg-warning text-white text-center">
          <h4 className="mb-0 fw-bold">🧑‍🤝‍🧑 Volunteer Registration</h4>
        </div>

        <div className="card-body p-4">
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Mobile */}
          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter mobile number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          {/* Area Dropdown */}
          <div className="mb-3">
            <label className="form-label">Select Area</label>
            <select
              className="form-select"
              value={form.areaId}
              onChange={(e) => setForm({ ...form, areaId: e.target.value })}
            >
              <option value="">-- Select Area --</option>
              {areas.map((a) => (
                <option key={a.areaId} value={a.areaId}>
                  {a.areaName}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Register Button */}
          <div className="d-grid">
            <button
              className="btn btn-warning"
              onClick={register}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
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
