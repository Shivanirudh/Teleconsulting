// BookedAppointments.js

import React from 'react';
import './../../css/Patient/BookedAppointments.css';

function BookedAppointments() {
  // Dummy data for booked appointments
  const bookedAppointments = [
    { id: 1, doctorName: 'Dr. Smith', date: '2024-02-20', time: '10:00 AM' },
    { id: 2, doctorName: 'Dr. Johnson', date: '2024-02-21', time: '11:30 AM' },
    { id: 3, doctorName: 'Dr. Patel', date: '2024-02-22', time: '02:00 PM' },
    // Add more dummy data as needed
  ];

  // Function to handle going to the meeting
  const handleGoToMeeting = (appointmentId) => {
    // Logic to navigate to the meeting for the given appointment ID
    console.log('Navigating to meeting for appointment ID:', appointmentId);
  };

  return (
    <div className="booked-appointments-container">
      <h2>Booked Appointments</h2>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookedAppointments.map(appointment => (
            <tr key={appointment.id}>
              <td>{appointment.doctorName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>
                <button onClick={() => handleGoToMeeting(appointment.id)}>Go to Meeting</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookedAppointments;
