import React, { useState } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Doctor/ddashboard.css';
import DoctorDashboard from "./Ddashboard";
import PreviousAppointments from "./Appointment";
import AllAppointments from "./AllAppointments";

export default function Dashboard() {
  const [showBookedAppointments, setShowBookedAppointments] = useState(true);
  const [showPrevAppointments, setShowPrevAppointments] = useState(false);

  const handlePrev = () => {
  	setShowBookedAppointments(false);
  	setShowPrevAppointments(true)
  };
  
  const handleAll = () => {
  	setShowBookedAppointments(false);
  	setShowPrevAppointments(false);
  };
  
  
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className='dashboard-content'>
        <SideNavbar />
        <div className='main-content'>
          <div className="tab-buttons">
            <button onClick={() => setShowBookedAppointments(true)}>Upcoming Appointments</button>
            <button onClick={handlePrev}>Previous Appointments</button>
            <button onClick={handleAll}>All Appointments</button>
          </div>
          {showBookedAppointments ? <DoctorDashboard /> : showPrevAppointments ? <PreviousAppointments /> : <AllAppointments />}
        </div>
      </div>
    </div>
  );
}
