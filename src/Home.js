import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">♻️ Waste Management System</h2>

      {/* Admin */}
      <div className="card p-3 mb-3">
        <h5>Admin</h5>
        <Link className="btn btn-primary m-1" to="/admin/login">
          Admin Login
        </Link>
      </div>

      {/* Citizen */}
      <div className="card p-3 mb-3">
        <h5>Citizen</h5>
        <Link className="btn btn-success m-1" to="/citizen/register">
          Citizen Register
        </Link>
        <Link className="btn btn-outline-success m-1" to="/citizen/login">
          Citizen Login
        </Link>
      </div>

      {/* Volunteer */}
      <div className="card p-3">
        <h5>Volunteer</h5>
        <Link className="btn btn-warning m-1" to="/volunteer/register">
          Volunteer Register
        </Link>
        <Link className="btn btn-outline-warning m-1" to="/volunteer/login">
          Volunteer Login
        </Link>
      </div>
       <footer className="text-center mt-5 text-muted">
        © 2025 Waste Management System
      </footer>
    </div>
  );
}
