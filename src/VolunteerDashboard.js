import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VolunteerDashboard() {
  const volunteer = JSON.parse(sessionStorage.getItem("volunteer"));

  const [complaints, setComplaints] = useState([]);
  const [cleanImages, setCleanImages] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // 🔹 NEW
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (!volunteer || !volunteer.area) {
      alert("Volunteer not logged in");
      window.location.href = "/volunteer/login";
      return;
    }
    loadComplaints();
    // eslint-disable-next-line
  }, []);

  const loadComplaints = async () => {
    try {
      const areaId = volunteer.area.areaId || volunteer.area.area_id;
      const res = await axios.get(
        `http://localhost:8080/api/complaints/area/${areaId}`
      );

      const mapped = res.data.map((c) => ({
        ...c,
        complaintId: c.complaintId || c.complaint_id,
        // 🔹 fallback resolved time (frontend safe)
        resolvedAt:
          c.resolvedAt ||
          (c.status === "COMPLETED"
            ? new Date().toISOString()
            : null),
      }));

      setComplaints(mapped);
    } catch (err) {
      console.error(err);
      alert("Failed to load complaints");
    }
  };

  const handleFileChange = (complaintId, file) => {
    setCleanImages({ ...cleanImages, [complaintId]: file });
  };

  const handleUpload = async (complaintId) => {
    const file = cleanImages[complaintId];
    if (!file) {
      alert("Select image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cleanupImage", file);

      await axios.post(
        `http://localhost:8080/api/cleanup/${complaintId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Cleanup image uploaded");
      loadComplaints();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleStatusChange = async (complaintId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/complaints/status/${complaintId}?status=${status}`
      );
      loadComplaints();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  // 🔹 FILTER LOGIC
  const filteredComplaints = complaints.filter((c) => {
    const textMatch =
      c.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      String(c.complaintId).includes(searchText) ||
      c.citizen?.name?.toLowerCase().includes(searchText.toLowerCase());

    const statusMatch =
      statusFilter === "ALL" || c.status === statusFilter;

    return textMatch && statusMatch;
  });

  const getBadgeClass = (status) => {
    if (status === "COMPLETED") return "bg-success";
    if (status === "IN_PROGRESS") return "bg-primary";
    return "bg-warning text-dark";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Volunteer Dashboard</h3>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {/* 🔹 SEARCH & FILTER */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, description or citizen name"
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

      {filteredComplaints.length === 0 ? (
        <p>No complaints found</p>
      ) : (
        <div className="row">
          {filteredComplaints.map((c) => (
            <div className="col-md-4 mb-4" key={c.complaintId}>
              <div className="card h-100 shadow">

                {/* Citizen Image */}
                <div style={{ height: "200px", overflow: "hidden" }}>
                  {c.image ? (
                    <img
                      src={`data:image/jpeg;base64,${c.image}`}
                      alt="Citizen"
                      className="w-100 h-100"
                      style={{ objectFit: "cover", cursor: "pointer" }}
                      onClick={() =>
                        setPreviewImage(
                          `data:image/jpeg;base64,${c.image}`
                        )
                      }
                    />
                  ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                      No Citizen Image
                    </div>
                  )}
                </div>

                <div className="card-body">
                  <h6 className="card-title">
                    Complaint #{c.complaintId}
                  </h6>

                  <span className={`badge ${getBadgeClass(c.status)} mb-2`}>
                    {c.status}
                  </span>

                  <p className="mb-1">
                    <strong>Citizen:</strong>{" "}
                    {c.citizen?.name || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Description:</strong><br />
                    {c.description}
                  </p>

                  {/* 🔹 RESOLVED TIME */}
                  {c.status === "COMPLETED" && (
                    <p className="text-success mb-2">
                      <strong>Resolved On:</strong>{" "}
                      {new Date(c.resolvedAt).toLocaleString()}
                    </p>
                  )}

                  {/* Cleanup Image */}
                  <div className="mb-2">
                    <strong>Cleanup Image:</strong><br />
                    {c.status === "COMPLETED" ? (
                      <img
                        src={`http://localhost:8080/api/cleanup/image/${c.complaintId}`}
                        alt="Cleanup"
                        width="80"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setPreviewImage(
                            `http://localhost:8080/api/cleanup/image/${c.complaintId}`
                          )
                        }
                      />
                    ) : (
                      "Not Uploaded"
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={(e) =>
                      handleFileChange(
                        c.complaintId,
                        e.target.files[0]
                      )
                    }
                  />

                  <button
                    className="btn btn-primary btn-sm w-100 mb-2"
                    onClick={() => handleUpload(c.complaintId)}
                  >
                    Upload Cleanup Image
                  </button>

                  <select
                    className="form-select"
                    value={c.status}
                    onChange={(e) =>
                      handleStatusChange(
                        c.complaintId,
                        e.target.value
                      )
                    }
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
