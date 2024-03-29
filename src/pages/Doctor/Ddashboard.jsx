import React, { useState } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Doctor/ddashboard.css';


export default function DoctorDashboard() {
  // Function to generate dates for the next 7 days
  const getNextDates = () => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split('T')[0]);
    }

    return dates;
  };

  // Dummy data for demonstration purposes
  const appointments = [
    { date: getNextDates()[0], time: '09:00', patientName: 'John Doe' },
    { date: getNextDates()[4], time: '09:00',patientName: 'somebody someone'},
    { date: getNextDates()[1], time: '10:00', patientName: 'Alice Smith' },
    { date: getNextDates()[3], time: '14:00', patientName: 'Bob Johnson' },
    { date: getNextDates()[5], time: '09:00', patientName: 'John Doe' },
    { date: getNextDates()[7], time: '19:00',patientName: 'somebody someone'},
    { date: getNextDates()[6], time: '10:00', patientName: 'Alice Smith' },
    { date: getNextDates()[2], time: '14:00', patientName: 'Bob Johnson' },
    // Add more dummy appointment data as needed
  ];

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

  // Function to check if an appointment exists for a specific date and time
  const hasAppointment = (date, time) => {
    return appointments.some(appointment => appointment.date === date && appointment.time === time);
  };

  return (
    <div className="dashboard-container">
      <Navbar/>
      <div className='dashboard-content'>
        <SideNavbar/>
        <div className= 'main-content'>
          <h2>This week's appointments</h2>
          <table className="table table-bordered custom-table">
            <thead>
              <tr>
                <th>Date</th>
                {Array.from({ length: 11 }, (_, index) => index + 9).map(hour => (
                  <th key={hour} className="text-center costum-color">
                    {hour}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getNextDates().map(date => (
                <tr key={date}>
                  <td className="font-weight-bold">{date}</td>
                  {Array.from({ length: 11 }, (_, index) => index + 9).map(hour => {
                    const time = `${hour < 10 ? '0' : ''}${hour}:00`;
                    return (
                      <td
                        key={`${date}-${time}`}
                        className={`text-center ${hasAppointment(date, time) ? 'bg-success' : 'bg-secondary'}`}
                        style={{ width: '10%', minWidth: '50px' }} // Ensure all cells have uniform size
                      >
                        {hasAppointment(date, time) && (
                          <button className="btn btn-primary btn-sm custom-button" onClick={() => handleOpenModal({ date, time })}>
                            View 
                          </button>
                        )}
                      </td>
                    );
                  })}
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
                    <h5 className="modal-title">Appointment Details - {selectedAppointment.date}</h5>
                    <button type="button" className="close" onClick={handleCloseModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>Date: {selectedAppointment.date}</p>
                    <p>Time: {selectedAppointment.time}</p>
                    <p>Patient: {appointments.find(appointment => appointment.date === selectedAppointment.date && appointment.time === selectedAppointment.time).patientName}</p>
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
