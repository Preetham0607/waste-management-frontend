import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegisteredVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    const res = await axios.get("http://localhost:8080/api/volunteers");
    setVolunteers(res.data);
  };

  const filteredVolunteers = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.mobile.includes(search) ||
      v.area?.areaName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Registered Volunteers</h4>
        <span className="text-muted">
          Total: {filteredVolunteers.length}
        </span>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, mobile or area"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* VOLUNTEER LIST */}
      <div className="row">
        {filteredVolunteers.length === 0 ? (
          <div className="text-muted">No volunteers found.</div>
        ) : (
          filteredVolunteers.map((v) => (
            <div className="col-md-4 mb-4" key={v.volunteerId}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {/* NAME */}
                  <h6 className="fw-bold mb-1">{v.name}</h6>

                  {/* MOBILE */}
                  <div className="text-muted mb-2">
                    Mobile: {v.mobile}
                  </div>

                  {/* AREA */}
                  <span className="badge bg-secondary mb-3">
                    {v.area?.areaName}
                  </span>

                  <hr />

                  {/* ID */}
                  <div className="text-muted small">
                    Volunteer ID: {v.volunteerId}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
