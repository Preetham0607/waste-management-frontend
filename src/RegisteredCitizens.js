import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegisteredCitizens() {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCitizens();
  }, []);

  const loadCitizens = async () => {
    const res = await axios.get("http://localhost:8080/api/citizens/all");
    setCitizens(res.data);
  };

  const filteredCitizens = citizens.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.area?.areaName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* PAGE TITLE */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Registered Citizens</h4>
        <span className="text-muted">
          Total: {filteredCitizens.length}
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

      {/* CITIZEN LIST */}
      <div className="row">
        {filteredCitizens.length === 0 ? (
          <div className="text-muted">No citizens found.</div>
        ) : (
          filteredCitizens.map((c) => (
            <div className="col-md-4 mb-4" key={c.citizenId}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {/* NAME */}
                  <h6 className="fw-bold mb-1">{c.name}</h6>

                  {/* MOBILE */}
                  <div className="text-muted mb-2">
                    Mobile: {c.mobile}
                  </div>

                  {/* AREA */}
                  <span className="badge bg-secondary mb-3">
                    {c.area?.areaName}
                  </span>

                  <hr />

                  {/* ID */}
                  <div className="text-muted small">
                    Citizen ID: {c.citizenId}
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
