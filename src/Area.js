import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Area() {
  const [areaName, setAreaName] = useState("");
  const [areas, setAreas] = useState([]);
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [editingAreaName, setEditingAreaName] = useState("");

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/areas");
      setAreas(res.data);
    } catch {
      alert("Failed to fetch areas");
    }
  };

  const addArea = async () => {
    if (!areaName.trim()) {
      alert("Enter area name");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/areas", {
        areaName,
        city: { cityId: 1 },
      });
      setAreaName("");
      fetchAreas();
    } catch {
      alert("Failed to add area");
    }
  };

  const startEdit = (area) => {
    setEditingAreaId(area.areaId);
    setEditingAreaName(area.areaName);
  };

  const cancelEdit = () => {
    setEditingAreaId(null);
    setEditingAreaName("");
  };

  const updateArea = async (id) => {
    if (!editingAreaName.trim()) return;

    try {
      await axios.put(`http://localhost:8080/api/areas/${id}`, {
        areaName: editingAreaName,
      });
      cancelEdit();
      fetchAreas();
    } catch {
      alert("Failed to update area");
    }
  };

  const deleteArea = async (id) => {
    if (!window.confirm("Are you sure you want to delete this area?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/areas/${id}`);
      fetchAreas();
    } catch {
      alert("Failed to delete area");
    }
  };

  return (
    <div className="container mt-4">
      {/* PAGE TITLE */}
      <h4 className="mb-4 fw-bold">Manage Areas</h4>

      {/* ADD AREA */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Add New Area (Mysore)</h5>

          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Area Name"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <input className="form-control" value="Mysore" disabled />
            </div>

            <div className="col-md-3 d-grid">
              <button className="btn btn-primary fw-bold" onClick={addArea}>
                Add Area
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AREA LIST */}
      <div className="row">
        {areas.map((a) => (
          <div className="col-md-4 mb-4" key={a.areaId}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                {editingAreaId === a.areaId ? (
                  <input
                    className="form-control mb-2"
                    value={editingAreaName}
                    onChange={(e) => setEditingAreaName(e.target.value)}
                  />
                ) : (
                  <h6 className="fw-bold">{a.areaName}</h6>
                )}

                <p className="text-muted mb-3">
                  City: {a.city?.cityName}
                </p>

                {editingAreaId === a.areaId ? (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateArea(a.areaId)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => startEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteArea(a.areaId)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
