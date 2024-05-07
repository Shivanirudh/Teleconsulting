import React, { useState, useEffect } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Patient/Dashboard.css'
import { Link } from 'react-router-dom';

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch all appointments from API
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch('http://localhost:8081/api/v1/doctor/all-appointments', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const newAppointments = data.map(appointment => {
          // Convert slot to date object
          const slot = new Date(
            appointment.slot[0],
            appointment.slot[1] - 1,
            appointment.slot[2],
            appointment.slot[3],
            appointment.slot[4]
          );

          // Format date and time
          appointment.date = `${appointment.slot[0]}-${appointment.slot[1]}-${appointment.slot[2]}`;
          appointment.slot[4] = appointment.slot[4] === 0 ? '00' : appointment.slot[4];
          appointment.time = `${appointment.slot[3]}:${appointment.slot[4]}`;

          // Combine patient first name and last name
          appointment.patientName = appointment.patient_id.first_name + ' ' + appointment.patient_id.last_name;

          return appointment;
        });

        // Update state with new appointments
        setAppointments(newAppointments);
      })
      .catch((error) => console.error('Error fetching appointments:', error));
  };

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByDate, setSearchByDate] = useState(false);

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appointment =>
    (searchByDate ? appointment.date.toLowerCase().includes(searchQuery.toLowerCase()) : appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to handle viewing appointment details
  const handleViewDetails = (appointmentId) => {
    // Implement logic to view details, e.g., navigate to a new page or show a modal
    alert(`Viewing details for appointment ${appointmentId}`);
  };

  return (
    <div className='dashboard-container'>
      <Navbar />
      <div className= 'dashboard-content'>
        <SideNavbar />
        <div className="main-content">
          <h2>All Appointments</h2>

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
                  <Link to={`/details?id=${appointment.appointment_id}`}>
                    <button className="btn btn-primary custom-button">
                      View Details
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
