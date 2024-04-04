import React, { useState } from 'react';
import './../../css/Patient/BookedAppointments.css';
import './../../css/Patient/PreviousAppointments.css'; // Import CSS for PreviousAppointments

// Import PreviousAppointments component
import PreviousAppointments from './PreviousAppointments';

function BookedAppointments() {
  // Dummy data for booked appointments
  const [bookedAppointments, setBookedAppointments] = useState([
    { id: 1, doctorName: 'Dr. Smith', date: '2024-02-20', time: '10:00 AM' },
    { id: 2, doctorName: 'Dr. Johnson', date: '2024-02-21', time: '11:30 AM' },
    { id: 3, doctorName: 'Dr. Patel', date: '2024-02-22', time: '02:00 PM' },
    // Add more dummy data as needed
  ]);

  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState('booked'); // 'booked' by default

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
  <button
    onClick={() => handleTabChange('booked')}
    className={activeTab === 'booked' ? 'active' : ''}
  >
    Booked Appointments
  </button>
  <button
    onClick={() => handleTabChange('previous')}
    className={activeTab === 'previous' ? 'active' : ''}
  >
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
              {bookedAppointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.doctorName}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                  <button className='bas-aps-but'onClick={() => handleGoToMeeting(appointment.id)}>Go to Meeting</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <PreviousAppointments />
      )}
    </div>
  );
}

export default BookedAppointments;
