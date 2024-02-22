import React from 'react';
import './../../css/Patient/PreviousAppointments.css';

function PreviousAppointments() {
  // Dummy data for previous appointments
  const previousAppointments = [
    { slNo: 1, date: '2023-01-15', doctorName: 'Dr. Smith' },
    { slNo: 2, date: '2023-02-28', doctorName: 'Dr. Johnson' },
    { slNo: 3, date: '2023-03-10', doctorName: 'Dr. Patel' },
    // Add more dummy data as needed
  ];

  return (
    <div className="previous-appointments-container">
      <h2>Previous Appointments</h2>
      <table className="previous-appointments-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Date</th>
            <th>Doctor Name</th>
          </tr>
        </thead>
        <tbody>
          {previousAppointments.map(appointment => (
            <tr key={appointment.slNo}>
              <td>{appointment.slNo}</td>
              <td>{appointment.date}</td>
              <td>{appointment.doctorName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PreviousAppointments;
