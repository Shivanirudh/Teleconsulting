import React, { useState, useEffect } from 'react';
import './../../css/Patient/BookedAppointments.css';
import './../../css/Patient/PreviousAppointments.css'; // Import CSS for PreviousAppointments

// Import PreviousAppointments component
import PreviousAppointments from './PreviousAppointments';

function BookedAppointments() {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('booked'); // 'booked' by default

  useEffect(() => {
    // Fetch booked appointments from API
    fetchBookedAppointments();
  }, []);

  // Function to fetch booked appointments from API
  const fetchBookedAppointments = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch('http://localhost:8081/api/v1/patient/list-appointments', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const currentDateTime = new Date(); // Get current date and time
        const currentTime = currentDateTime.getTime(); // Get current time in milliseconds

        const newBookedAppointments = [];
        const newPreviousAppointments = [];

        // Iterate through fetched appointments
        data.forEach((appointment) => {
          const slotTime = new Date(
            appointment.slot[0],
            appointment.slot[1] - 1,
            appointment.slot[2],
            appointment.slot[3],
            appointment.slot[4]
          ).getTime(); // Convert slot time to milliseconds

          // If current time is greater than or equal to slot time + 45 minutes, move appointment to previous appointments
          if (currentTime >= slotTime + 45 * 60 * 1000) {
            newPreviousAppointments.push(appointment);
          } else {
            newBookedAppointments.push(appointment);
          }
        });

        // Update state with new appointments
        setBookedAppointments(newBookedAppointments);
        setPreviousAppointments(newPreviousAppointments);
      })
      .catch((error) => console.error('Error fetching appointments:', error));
  };

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGoToMeeting = (appointmentId) => {
    // Logic to navigate to the meeting for the given appointment ID
    console.log('Navigating to meeting for appointment ID:', appointmentId);
  };

  return (
    <div className="booked-appointments-container">
      <div className="tab-buttons">
        <button onClick={() => handleTabChange('booked')} className={activeTab === 'booked' ? 'active' : ''}>
          Booked Appointments
        </button>
        <button onClick={() => handleTabChange('previous')} className={activeTab === 'previous' ? 'active' : ''}>
          Previous Appointments
        </button>
      </div>

      {activeTab === 'booked' ? (
        <div>
          <h2>Booked Appointments</h2>
          <table className="booked-appointments-table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookedAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.doctor_id.first_name} {appointment.doctor_id.last_name}</td>
                  <td>{appointment.slot[2]}/{appointment.slot[1]}/{appointment.slot[0]}</td>
                  <td>{appointment.slot[3]}:{appointment.slot[4]}</td>
                  <td>
                    <button className='bas-aps-but' onClick={() => handleGoToMeeting(appointment.appointmentId)}>Go to Meeting</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <PreviousAppointments appointments={previousAppointments} />
      )}
    </div>
  );
}

export default BookedAppointments;
