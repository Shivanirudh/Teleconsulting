import React, { useState } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";



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
    slots: Array.from({ length: 16 }, (_, index) => {
      const slotStartTime = 8 * 60 + (index * 60); // Convert hours to minutes
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
    <div>
  <Navbar/>
  <SideNavbar/>
    
    <div className="container mt-4" style={{ marginLeft: '250px', marginTop: '56px' ,marginBottom: '550px'}}>
     
      <h2>Doctor Dashboard</h2>
     
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            {scheduleData[0].slots.slice(0, -2).map((slot, index) => (
              <th key={index} className="text-center">
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
                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(slot)}>
                      View
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying appointment details */}
      {selectedAppointment && (
        <div className={`modal ${modalVisible ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: modalVisible ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Appointment Details</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Date: {selectedAppointment.date}</p>
                <p>Time: {`${selectedAppointment.startTime} - ${selectedAppointment.endTime}`}</p>
                <p>Patient: {selectedAppointment.patientName || ''}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={handleJoinMeeting}>
                  Join Meeting
                </button>
                <button type="button" className="btn btn-danger" onClick={handleCancelAppointment}>
                  Cancel Appointment
                </button>
                <button type="button" className="btn btn-info" onClick={handleViewPatientDetails}>
                  View Patient Details
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    
  );
}
