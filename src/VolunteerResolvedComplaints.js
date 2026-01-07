import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VolunteerResolvedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadResolvedComplaints();
  }, []);

  const loadResolvedComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/complaints/all");
      const resolved = res.data
        .filter((c) => c.cleanupImage !== null || c.status === "RESOLVED")
        .map((c, index) => ({
          ...c,
          postedAt: new Date(Date.now() - index * 3600 * 1000),
        }));
      setComplaints(resolved);
    } catch {
      alert("Failed to load resolved complaints");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/complaints/status/${id}?status=${status}`
      );
      loadResolvedComplaints();
    } catch {
      alert("Failed to update status");
    }
  };

  const openImage = (url) => {
    window.open(url, "_blank");
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.area?.areaName.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintId.toString().includes(search)
  );

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Resolved Complaints (Volunteers)</h4>
        <span className="text-muted">
          Total: {filteredComplaints.length}
        </span>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID, description, area or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="text-muted">No resolved complaints found.</div>
      ) : (
        <div className="row">
          {filteredComplaints.map((c) => (
            <div className="col-md-6 mb-4" key={c.complaintId}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {/* HEADER */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">
                      Complaint #{c.complaintId}
                    </h6>
                    <span
                      className={`badge ${
                        c.status === "RESOLVED"
                          ? "bg-success"
                          : c.status === "IN_PROGRESS"
                          ? "bg-info text-dark"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* META */}
                  <div className="text-muted small mb-2">
                    Posted On: {c.postedAt.toLocaleString()}
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mb-2">
                    <strong>Description:</strong><br />
                    {c.description}
                  </p>

                  <p className="text-muted mb-3">
                    Area: {c.area?.areaName}
                  </p>

                  {/* IMAGES */}
                  <div className="row text-center mb-3">
                    <div className="col">
                      <div className="small text-muted mb-1">
                        Citizen Image
                      </div>
                      {c.image ? (
                        <img
                          src={`http://localhost:8080/api/complaints/image/${c.complaintId}`}
                          alt="citizen"
                          className="img-thumbnail"
                          width="90"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            openImage(
                              `http://localhost:8080/api/complaints/image/${c.complaintId}`
                            )
                          }
                        />
                      ) : (
                        <div className="text-muted small">Not Uploaded</div>
                      )}
                    </div>

                    <div className="col">
                      <div className="small text-muted mb-1">
                        Cleanup Image
                      </div>
                      {c.cleanupImage ? (
                        <img
                          src={`http://localhost:8080/api/cleanup/image/${c.complaintId}`}
                          alt="cleanup"
                          className="img-thumbnail"
                          width="90"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            openImage(
                              `http://localhost:8080/api/cleanup/image/${c.complaintId}`
                            )
                          }
                        />
                      ) : (
                        <div className="text-muted small">Not Uploaded</div>
                      )}
                    </div>
                  </div>

                  <hr />

                  {/* STATUS UPDATE */}
                  <div>
                    <label className="form-label fw-bold">
                      Update Status
                    </label>
                    <select
                      className="form-select"
                      value={c.status}
                      onChange={(e) =>
                        updateStatus(c.complaintId, e.target.value)
                      }
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
