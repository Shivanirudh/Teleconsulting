import React, { useState, useEffect } from 'react';
import SideNavbar from "../../components/Doctor/sidenavbar";
import Navbar from "../../components/Doctor/Navbar";
import '../../css/Patient/Dashboard.css'
import { Link, useNavigate } from 'react-router-dom';

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  //const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all appointments from API
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch('http://localhost:8081/api/v1/doctor/all-appointments', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const newAppointments = data.map(appointment => {
          // Convert slot to date object
          const slot = new Date(
            appointment.slot[0],
            appointment.slot[1] - 1,
            appointment.slot[2],
            appointment.slot[3],
            appointment.slot[4]
          );

          // Format date and time
          appointment.date = `${appointment.slot[0]}-${appointment.slot[1]}-${appointment.slot[2]}`;
          appointment.slot[4] = appointment.slot[4] === 0 ? '00' : appointment.slot[4];
          appointment.time = `${appointment.slot[3]}:${appointment.slot[4]}`;

          // Combine patient first name and last name
          appointment.patientName = appointment.patient_id.first_name + ' ' + appointment.patient_id.last_name;

          return appointment;
        });

        // Update state with new appointments
        setAppointments(newAppointments);
      })
      .catch((error) => console.error('Error fetching appointments:', error));
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchByDate, setSearchByDate] = useState(false);
  
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
    // alert('Join Meeting');
    const currentDateTime = new Date();

    // Convert current date and time into an array format similar to appointment.slot
    const currentTimeArray = [
        currentDateTime.getFullYear(),
        currentDateTime.getMonth() + 1, // Months are zero-based, so add 1
        currentDateTime.getDate(),
        currentDateTime.getHours(),
        currentDateTime.getMinutes(),
    ];
    console.log(selectedAppointment.slot);
    console.log(currentTimeArray);
    
    setSelectedAppointment(selectedAppointment);

    // Compare current time array with appointment.slot
    // const isTimeForMeeting = currentTimeArray.every((value, index) => value === appointment.slot[index]);
    const isTimeForMeeting = currentTimeArray.every((value, index) => value === currentTimeArray[index]);
    if (isTimeForMeeting) {
        // Navigate to meeting page
        //selectedAppointment["doctor_id"]["doctor_id"] = doctor.doctor_id;
        navigate('/dchats', { state: { selectedAppointment: selectedAppointment } });
    } else {
        // Alert the user that it is not time for the meeting yet
        alert("It is not time for the meeting yet.");
    }
  };
	
  const [searchTerm, setSearchTerm] = useState('');
  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appointment =>
    (searchByDate ? appointment.date.toLowerCase().includes(searchQuery.toLowerCase()) : appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to handle viewing appointment details
  const handleViewDetails = (appointmentId) => {
    // Implement logic to view details, e.g., navigate to a new page or show a modal
    alert(`Viewing details for appointment ${appointmentId}`);
  };
  
  // Function to handle canceling the appointment
  const handleCancelAppointment = () => {
    // Implement your logic for canceling the appointment
    alert('Cancel Appointment');
  };

  return (
    <div >
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
            <Link to= {`/details?id=${selectedAppointment.appointment_id}`} > <button className="btn btn-info custom-button2" >
              View Patient
            </button> </Link>
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
