import React, { useState, useEffect } from 'react';
import './../../css/Patient/PreviousAppointments.css';

function PreviousAppointments({ appointments }) {
  // Filter appointments based on current time
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    const currentDateTime = new Date(); // Get current date and time
    const currentTime = currentDateTime.getTime(); // Get current time in milliseconds

    // Filter appointments to include only those that are in the past relative to current time
    const filtered = appointments.filter(appointment => {
      const slotTime = new Date(
        appointment.slot[0],
        appointment.slot[1] - 1,
        appointment.slot[2],
        appointment.slot[3],
        appointment.slot[4]
      ).getTime(); // Convert slot time to milliseconds

      return currentTime >= slotTime + 45 * 60 * 1000; // Check if current time is past appointment time + 45 minutes
    });

    setFilteredAppointments(filtered);
  }, [appointments]);

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
          {filteredAppointments.map((appointment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{`${appointment.slot[2]}/${appointment.slot[1]}/${appointment.slot[0]}`}</td>
              <td>{`${appointment.doctor_id.first_name} ${appointment.doctor_id.last_name}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PreviousAppointments;
