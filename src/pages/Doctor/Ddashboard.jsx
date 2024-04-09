import React, { useState, useEffect } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Doctor/ddashboard.css';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  // Function to generate dates for the next 7 days
  // const getNextDates = () => {
  //   const today = new Date();
  //   const dates = [];

  //   for (let i = 0; i < 7; i++) {
  //     const nextDate = new Date(today);
  //     nextDate.setDate(today.getDate() + i);
  //     dates.push(nextDate.toISOString().split('T')[0]);
  //   }

  //   return dates;
  // };

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
          const slotYear = slot.getFullYear();
          const slotMonth = slot.getMonth();
          const slotDate = slot.getDate();
          // If slot is on the same date as current date or it is within the next 7 days, move appointment to appointments
          if ((currentDateTime.getFullYear() === slotYear && currentDateTime.getMonth() === slotMonth && currentDateTime.getDate === slotDate) || (slotTime <= currentTime +  7 * 24 * 60 * 60 * 1000)){
            newAppointments.push(appointment);
          } 
        });

        // Update state with new appointments
        setAppointments(newAppointments);
      })
      .catch((error) => console.error('Error fetching appointments:', error));
  };

  // Dummy data for demonstration purposes
  // const appointments = [
  //   { id:1,date: getNextDates()[0], time: '09:00', patientName: 'John Doe' },
  //   { id:2,date: getNextDates()[4], time: '09:00', patientName: 'somebody someone' },
  //   { id:3,date: getNextDates()[1], time: '10:00', patientName: 'Alice Smith' },
  //   { id:4,date: getNextDates()[3], time: '14:00', patientName: 'Bob Johnson' },
  //   { id:5,date: getNextDates()[5], time: '09:00', patientName: 'John Doe' },
  //   { id:6,date: getNextDates()[6], time: '19:00', patientName: 'somebody someone' },
  //   { id:7,date: getNextDates()[6], time: '10:00', patientName: 'Alice Smith' },
  //   { id:8,date: getNextDates()[2], time: '14:00', patientName: 'Bob Johnson' },
  //   // Add more dummy appointment data as needed
  // ];

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




  // State for search input
  const [searchTerm, setSearchTerm] = useState('');

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className='dashboard-content'>
        <SideNavbar />
        <div className='main-content'>
          <div className="appointments-list-header">
            <h2>This week's appointments</h2>
            <input
              type="text"
              placeholder="Search by patient name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="appointments-list col">
            <table className="table " style={{border: 'none'}}>
              <thead>
                <tr style={{border: 'none'}}>
                  <th style={{border: 'none'}}>Date</th>
                  <th style={{border: 'none'}}>Time</th>
                  <th style={{border: 'none'}}>Name of Patient</th>
                  <th style={{border: 'none'}}>Actions</th>
                </tr>
              </thead>
              <tbody  >
                {filteredAppointments.map((appointment, index) => (
                  <tr key={index} style={{border: 'none'}}>
                    <td style={{border: 'none'}}>{appointment.date}</td>
                    <td style={{border: 'none'}}>{appointment.time}</td>
                    <td style={{border: 'none'}}>{appointment.patientName}</td>
                    <td style={{border: 'none'}}>
                      <button className="btn btn-primary btn-sm custom-button" onClick={() => handleOpenModal(appointment)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedAppointment && (
        <div
          className={`modal ${modalVisible ? 'show' : ''}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: modalVisible ? 'block' : 'none' }}
        >
          <div className="modal-dialog modal-sm custom-box"> {/* Add modal-sm for smaller size */}
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
                <p>Patient: {selectedAppointment.patientName}</p>
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
  );
}
