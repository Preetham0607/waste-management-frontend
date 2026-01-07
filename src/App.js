import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import CitizenRegister from "./CitizenRegister";
import CitizenLogin from "./CitizenLogin";
import CitizenDashboard from "./CitizenDashboard";
import VolunteerRegister from "./VolunteerRegister";
import VolunteerLogin from "./VolunteerLogin";
import VolunteerDashboard from "./VolunteerDashboard";
import Navbar from "./Navbar";
import Area from "./Area";
import RegisteredCitizens from "./RegisteredCitizens";
import CitizenComplaints from "./CitizenComplaints";
import VolunteerRegistered from "./VolunteerRegistered";
import VolunteerResolvedComplaints from "./VolunteerResolvedComplaints";
import { ThemeProvider } from "./ThemeContext";

function App() {
  return (
    <ThemeProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} >
        <Route path="area" element={< Area/>} />
        <Route path="registerdcitizens" element={< RegisteredCitizens/>} />
        <Route path="citizencomplaints" element={< CitizenComplaints/>} />
        <Route path="volunteersregistered" element={< VolunteerRegistered/>} />
        <Route path="volunteerresolvedcomplaints" element={< VolunteerResolvedComplaints/>} />
        </Route>

        <Route path="/citizen/register" element={<CitizenRegister />} />
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/volunteer/register" element={<VolunteerRegister />} />
        <Route path="/volunteer/login" element={<VolunteerLogin />} />
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
