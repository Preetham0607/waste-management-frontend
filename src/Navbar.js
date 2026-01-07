import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserShield,
  FaUser,
  FaHandsHelping,
  FaSignOutAlt,
  FaTachometerAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { ThemeContext } from "./ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    if(window.confirm("are you sure want to logout?")){
    sessionStorage.clear();
    navigate("/");
  }};

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === "dark" ? "navbar-dark bg-dark" : "navbar-dark bg-success"
      } shadow`}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaHandsHelping className="me-2" />
          Waste Management System
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Theme Toggle */}
            <li className="nav-item me-3">
              <button
                className="btn btn-outline-light"
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </button>
            </li>

            {/* Guest */}
            {!role && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    <FaHome className="me-1" /> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/login">
                    <FaUserShield className="me-1" /> Admin
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/citizen/login">
                    <FaUser className="me-1" /> Citizen
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/volunteer/login">
                    <FaHandsHelping className="me-1" /> Volunteer
                  </Link>
                </li>
              </>
            )}

            {/* Admin */}
            {role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    <FaTachometerAlt className="me-1" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard/area">
                    Manage Areas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard/registerdcitizens">
                    Citizens
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard/citizencomplaints">
                    Complaints
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard/volunteersregistered">
                    Volunteers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard/volunteerresolvedcomplaints">
                    Resolved
                  </Link>
                </li>
              </>
            )}

            {/* Citizen */}
            {role === "CITIZEN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/citizen/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/citizen/complaint">
                    Raise Complaint
                  </Link>
                </li>
              </>
            )}

            {/* Volunteer */}
            {role === "VOLUNTEER" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/volunteer/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/volunteer/complaints">
                    Assigned Complaints
                  </Link>
                </li>
              </>
            )}

            {/* Logout */}
            {role && (
              <li className="nav-item ms-3">
                <button className="btn btn-danger" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
