import React from "react";
import { useLocation } from "react-router-dom";
import Area from "./Area";
import RegisteredCitizens from "./RegisteredCitizens";
import CitizenComplaints from "./CitizenComplaints";
import VolunteerRegistered from "./VolunteerRegistered";
import VolunteerResolvedComplaints from "./VolunteerResolvedComplaints";

export default function AdminDashboard() {
  const location = useLocation();

  const isMainDashboard = location.pathname === "/admin/dashboard";
  const isArea = location.pathname.includes("/admin/dashboard/area");
  const isCitizens = location.pathname.includes(
    "/admin/dashboard/registerdcitizens"
  );
  const isComplaints = location.pathname.includes(
    "/admin/dashboard/citizencomplaints"
  );
  const isVolunteersRegistered = location.pathname.includes(
    "/admin/dashboard/volunteersregistered"
  );
  const isVolunteerResolved = location.pathname.includes(
    "/admin/dashboard/volunteerresolvedcomplaints"
  );

  return (
    <div className="container mt-4">
      <h3>Admin Dashboard</h3>

      {isMainDashboard && (
        <>
          <Area />
          <RegisteredCitizens />
          <CitizenComplaints />
          <VolunteerRegistered />
          <VolunteerResolvedComplaints />
        </>
      )}

      {isArea && <Area />}
      {isCitizens && <RegisteredCitizens />}
      {isComplaints && <CitizenComplaints />}
      {isVolunteersRegistered && <VolunteerRegistered />}
      {isVolunteerResolved && <VolunteerResolvedComplaints />}
    </div>
  );
}
