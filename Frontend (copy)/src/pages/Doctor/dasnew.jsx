import React, { useState } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Doctor/ddashboard.css';
import DoctorDashboard from "./Ddashboard";
import PreviousAppointments from "./Appointment";

export default function Dashboard() {
  const [showBookedAppointments, setShowBookedAppointments] = useState(true);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className='dashboard-content'>
        <SideNavbar />
        <div className='main-content'>
          <div className="tab-buttons">
            <button onClick={() => setShowBookedAppointments(true)}>Booked Appointments</button>
            <button onClick={() => setShowBookedAppointments(false)}>Previous Appointments</button>
          </div>
          {showBookedAppointments ? <DoctorDashboard /> : <PreviousAppointments />}
        </div>
      </div>
    </div>
  );
}
