import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
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

  const handleDownload = async (appointment_id) => {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem('token');
  
      const response = await axios.get(
        `http://localhost:8081/api/v1/patient/fetch-prescription/${appointment_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob' // Ensure response type is blob to handle binary data
        }
      );
  
      if (response.status === 200) {
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });
  
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'prescription.pdf'); // Set desired file name
  
        // Programmatically click the link to trigger the download
        document.body.appendChild(link);
        link.click();
  
        // Remove the temporary link element
        document.body.removeChild(link);
      } else {
        console.error('Failed to fetch prescription:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching prescription:', error.message);
    }
  };
  
  return (
    <div className="previous-appointments-container">
      <h2>Previous Appointments</h2>
      <table className="previous-appointments-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Date</th>
            <th>Doctor Name</th>
            <th>Action</th> {/* Add a new column for the action */}
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{`${appointment.slot[2]}/${appointment.slot[1]}/${appointment.slot[0]}`}</td>
              <td>{`${appointment.doctor_id.first_name} ${appointment.doctor_id.last_name}`}</td>
              <td>
                <button className='bas-aps-but' onClick={() => handleDownload(appointment.appointment_id)}>Download</button>
              </td> {/* Button within a table cell */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PreviousAppointments;
