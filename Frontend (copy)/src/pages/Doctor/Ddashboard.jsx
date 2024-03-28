import React, { useState } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Doctor/ddashboard.css';


export default function DoctorDashboard() {
  // Function to generate dates for the next 5 days
  const getNextDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split('T')[0]);
    }

    return dates;
  };

  // Dummy data for demonstration purposes
  const scheduleData = getNextDates().map(date => ({
    date,
    slots: Array.from({ length: 13}, (_, index) => {
      const slotStartTime = 9* 60 + (index * 60); // Convert hours to minutes
      const slotEndTime = slotStartTime + 45;
      const formattedStartTime = new Date(2022, 1, 1, Math.floor(slotStartTime / 60), slotStartTime % 60);
      const formattedEndTime = new Date(2022, 1, 1, Math.floor(slotEndTime / 60), slotEndTime % 60);

      return {
        startTime: formattedStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: formattedEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patientName: index % 2 === 0 ? `Patient ${index + 1}` : null,
      };
    }),
  }));

  // State to manage the modal visibility and appointment details
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Function to handle opening the modal and setting selected appointment
  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Function to handle joining the meeting
  const handleJoinMeeting = () => {
    // Implement your logic for joining the meeting
    alert('Join Meeting');
  };

  // Function to handle canceling the appointment
  const handleCancelAppointment = () => {
    // Implement your logic for canceling the appointment
    alert('Cancel Appointment');
  };

  // Function to handle viewing patient details
  const handleViewPatientDetails = () => {
    // Implement your logic for viewing patient details
    alert('View Patient Details');
  };

  return (
    <div className="dashboard-container">
  <Navbar/>
  <div className='dashboard-content'>
  <SideNavbar/>
    
    <div className= 'main-content'>
     
      <h2>Doctor Dashboard</h2>
     
      <table className="table table-bordered custom-table">
        <thead>
          <tr>
            <th>Date</th>
            {scheduleData[0].slots.slice(0, -2).map((slot, index) => (
              <th key={index} className="text-center costum-color">
                {slot.startTime}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData.map(dateData => (
            <tr key={dateData.date}>
              <td className="font-weight-bold">{dateData.date}</td>
              {dateData.slots.slice(0, -2).map(slot => (
                <td
                  key={`${dateData.date}-${slot.startTime}`}
                  className={`text-center ${slot.patientName ? 'bg-light' : 'bg-secondary'}`}
                >
                  {slot.patientName && (
                    <button className="btn btn-primary btn-sm custom-button" onClick={() => handleOpenModal(slot)}>
                      View
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAppointment && (
  <div
    className={`modal ${modalVisible ? 'show' : ''}`}
    tabIndex="-1"
    role="dialog"
    style={{ display: modalVisible ? 'block' : 'none' }}
  >
    <div className="modal-dialog modal-sm custom-box">  {/* Add modal-sm for smaller size */}
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Appointment Details - {selectedAppointment.date}</h5> {/* Include date in title */}
          <button type="button" className="close" onClick={handleCloseModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>Time: {`${selectedAppointment.startTime} - ${selectedAppointment.endTime}`}</p>
          <p>Patient: {selectedAppointment.patientName || ''}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-success custom-button2" onClick={handleJoinMeeting}>
            Join Meeting
          </button>
          
          <button type="button" className="btn btn-info custom-button2" onClick={handleViewPatientDetails}>
            View Patient 
          </button>
          <button type="button" className="btn btn-danger" onClick={handleCancelAppointment}>
            Cancel Appointment
          </button>
          
        </div>
      </div>
    </div>
  </div>
)}
  
     
    
    </div>
    </div>
    </div>
    
  );
}
