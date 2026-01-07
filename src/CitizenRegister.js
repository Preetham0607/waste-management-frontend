import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CitizenRegister() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/areas");
      setAreas(res.data);
    } catch (err) {
      alert("Failed to load areas");
    }
  };

  const register = async () => {
    if (!name || !mobile || !password || !areaId) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/citizens/add", {
        name,
        mobile,
        password,
        area: { areaId },
      });

      alert("Registered Successfully");

      setName("");
      setMobile("");
      setPassword("");
      setAreaId("");
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white text-center">
              <h4>Citizen Registration</h4>
            </div>

            <div className="card-body">
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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

              {/* Area */}
              <div className="mb-3">
                <label className="form-label">Select Area</label>
                <select
                  className="form-select"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                >
                  <option value="">-- Select Area --</option>
                  {areas.map((area) => (
                    <option key={area.areaId} value={area.areaId}>
                      {area.areaName}
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
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Button */}
              <div className="d-grid">
                <button className="btn btn-success" onClick={register}>
                  Register
                </button>
              </div>
            </div>

            <div className="card-footer text-center text-muted">
              © Waste Management System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
