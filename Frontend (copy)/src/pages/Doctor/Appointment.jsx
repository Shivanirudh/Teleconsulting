import React, { useState, useEffect } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Patient/Dashboard.css'

export default function PreviousAppointments() {
  const [appointments, setAppointments] = useState([]);
  // Dummy data for demonstration purposes
  // const appointmentData = [
  //   { id: 1, date: '2022-02-10', time: '10:00 AM', patientName: 'John Doe' },
  //   { id: 2, date: '2022-02-11', time: '02:30 PM', patientName: 'Jane Smith' },
  //   // Add more appointment data as needed
  // ];

  useEffect(() => {
    // Fetch booked appointments from API
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch('http://localhost:8081/api/v1/doctor/list-appointments', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const currentDateTime = new Date(); // Get current date and time
        const currentTime = currentDateTime.getTime(); // Get current time in milliseconds

        const newAppointments = [];

        // Iterate through fetched appointments
        data.forEach((appointment) => {
          const slot = new Date(
            appointment.slot[0],
            appointment.slot[1] - 1,
            appointment.slot[2],
            appointment.slot[3],
            appointment.slot[4]
          );
          const slotTime = slot.getTime(); // Convert slot time to milliseconds
          // If current time is greater than or equal to slot time + 45 minutes, move appointment to appointments
          if (currentTime >= slotTime + 45 * 60 * 1000) {
            newAppointments.push(appointment);
          } 
        });
        console.log(newAppointments);
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
