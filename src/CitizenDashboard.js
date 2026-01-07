import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CitizenDashboard() {
  const citizen = JSON.parse(sessionStorage.getItem("citizen"));

  const [description, setDescription] = useState("");
  const [areaId, setAreaId] = useState("");
  const [areas, setAreas] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [image, setImage] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showImage, setShowImage] = useState(null);

  /* 🔹 NEW: SEARCH & FILTER */
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (!citizen) {
      window.location.href = "/citizen/login";
      return;
    }
    loadAreas();
    loadMyComplaints();
  }, []);

  const getDisplayTime = (complaint) => {
    return (
      complaint.postedAt ||
      complaint.createdAt ||
      complaint.timestamp ||
      new Date().toISOString()
    );
  };

  const loadAreas = async () => {
    const res = await axios.get("http://localhost:8080/api/areas");
    setAreas(res.data);
  };

  const loadMyComplaints = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/complaints/citizen/${citizen.citizenId}`
    );

    const complaintsWithTime = res.data.map((c) => ({
      ...c,
      postedAt: getDisplayTime(c),
    }));

    setMyComplaints(complaintsWithTime);
  };

  const postComplaint = async () => {
    if (!description || !areaId) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("areaId", areaId);
    formData.append("citizenId", citizen.citizenId);
    if (image) formData.append("image", image);

    await axios.post("http://localhost:8080/api/complaints", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Complaint Posted Successfully");
    setDescription("");
    setAreaId("");
    setImage(null);
    loadMyComplaints();
  };

  const updatePassword = async () => {
    await axios.put(
      `http://localhost:8080/api/citizens/${citizen.citizenId}/password`,
      { password: newPassword }
    );
    alert("Password Updated");
    setShowPasswordInput(false);
    setNewPassword("");
  };

  const logout = () => {
    if (window.confirm("Are You Sure Want to Logout?")) {
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  /* 🔹 FILTER LOGIC */
  const filteredComplaints = myComplaints.filter((c) => {
    const matchesSearch = c.description
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
      case "RESOLVED":
        return "badge bg-success";
      case "IN_PROGRESS":
        return "badge bg-primary";
      case "PENDING":
      default:
        return "badge bg-warning text-dark";
    }
  };

  return (
    <div className="container mt-4">
      <h3>Citizen Dashboard</h3>

      {/* Actions */}
      <div className="mb-3 d-flex justify-content-between gap-2">
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
        <button
          className="btn btn-info text-white"
          onClick={() => setShowPasswordInput(!showPasswordInput)}
        >
          Update Password
        </button>
      </div>

      {showPasswordInput && (
        <div className="mb-4">
          <input
            type="password"
            className="form-control mb-2"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={updatePassword}>
            Save
          </button>
        </div>
      )}

      {/* Post Complaint */}
      <h5>Post Complaint</h5>

      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="form-control mb-2"
        value={areaId}
        onChange={(e) => setAreaId(e.target.value)}
      >
        <option value="">-- Select Area --</option>
        {areas.map((a) => (
          <option key={a.areaId} value={a.areaId}>
            {a.areaName}
          </option>
        ))}
      </select>

      <input
        type="file"
        className="form-control mb-2"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="btn btn-danger mb-4" onClick={postComplaint}>
        Submit
      </button>

      {/* 🔹 SEARCH & FILTER */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* My Complaints – CARD VIEW */}
      <div className="row">
        {filteredComplaints.map((c) => (
          <div className="col-md-4 mb-4" key={c.complaintId}>
            <div className="card h-100 shadow">
              {/* IMAGE */}
              {c.image ? (
                <img
                  src={`data:image/jpeg;base64,${c.image}`}
                  alt="Complaint"
                  style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setShowImage(c.image)}
                />
              ) : (
                <div
                  style={{
                    height: "200px",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No Image
                </div>
              )}

              <div className="card-body">
                <h6>Complaint #{c.complaintId}</h6>

                <span className={getStatusBadge(c.status)}>
                  {c.status}
                </span>

                <p className="mt-2">{c.description}</p>

                <small className="text-muted">
                  Posted on: {new Date(c.postedAt).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* IMAGE MODAL */}
      {showImage && (
        <div
          onClick={() => setShowImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={`data:image/jpeg;base64,${showImage}`}
            alt="Full View"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </div>
  );
}
