import React, { useState } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Patient/Dashboard.css'

export default function PreviousAppointments() {
  // Dummy data for demonstration purposes
  const appointmentData = [
    { id: 1, date: '2022-02-10', time: '10:00 AM', patientName: 'John Doe' },
    { id: 2, date: '2022-02-11', time: '02:30 PM', patientName: 'Jane Smith' },
    // Add more appointment data as needed
  ];

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByDate, setSearchByDate] = useState(false);

  // Filter appointments based on search query
  const filteredAppointments = appointmentData.filter(appointment =>
    (searchByDate ? appointment.date.toLowerCase().includes(searchQuery.toLowerCase()) : appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to handle viewing appointment details
  const handleViewDetails = (appointmentId) => {
    // Implement logic to view details, e.g., navigate to a new page or show a modal
    alert(`Viewing details for appointment ${appointmentId}`);
  };

  return (
    <div className="dashboard-container">
      <Navbar/>
    <div className="dashboard-content">
      <SideNavbar/>
    <div className="main-content">
    
      <h2>Previous Appointments</h2>

      {/* Search bar */}
      <div className="mb-3 custom-box">
        <input
          type="text"
          className="form-control"
          placeholder={searchByDate ? "Search by date (YYYY-MM-DD)" : "Search by patient name"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input"
            checked={searchByDate}
            onChange={() => setSearchByDate(!searchByDate)}
          />
          Search by date
        </label>
      </div>

      {/* List of appointments */}
      <ul className="list-group custom-box">
        {filteredAppointments.map(appointment => (
          <li key={appointment.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time}</p>
                <p>Patient: {appointment.patientName}</p>
              </div>
              <button className="btn btn-primary custom-button" onClick={() => handleViewDetails(appointment.id)}>
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
    </div>
  );
}
