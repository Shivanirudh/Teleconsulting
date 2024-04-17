import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TopNavigationBar from '../../components/Doctor/Navbar';
import SideNavbar from '../../components/Doctor/sidenavbar';

const PatientDetails = (props) => {
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);

  const [patientDetails, setPatientDetails] = useState({});
  const [doctorId, setDoctorId] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  // Dummy data for patient details
  // const patientDetails = {
  //   name: 'John Doe',
  //   bloodGroup: 'O+',
  //   // Add more patient details as needed
  // };

  // Dummy data for previous appointments
  const previousAppointments = [
    { id: 1, doctor: 'Dr. Smith', date: '2023-01-15', reason: 'Checkup' },
    { id: 2, doctor: 'Dr. Johnson', date: '2022-12-20', reason: 'Follow-up' },
    // Add more appointments as needed
  ];

  useEffect(() => {
    // Fetch booked appointments from API
    fetchPatientDetails();
  }, []);

  const fetchPatientDetails = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/appointment/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.patient_id.date_of_birth = `${data.patient_id.dob[2]}-${data.patient_id.dob[1]}-${data.patient_id.dob[0]}`;
        data.patient_id.patientName = data.patient_id.first_name + ' ' + data.patient_id.last_name;
        setPatientDetails(data.patient_id);
        setDoctorId(data.doctor_id.doctor_id);
      })
      .catch((error) => console.error('Error fetching details:', error));
  };


  const handleViewDocuments = () => {
    // Logic to handle viewing documents
    setDocumentsModalOpen(true);
  };

  const handleViewAppointments = () => {
    // Logic to handle viewing appointments
    setAppointmentsModalOpen(true);
  };

  return (
    <div className='dashboard-container'>
      <TopNavigationBar/>
      <div className='dashboard-content'>
        <SideNavbar/>
        <div className='main-content'>
    <div className="patient-details">
      <h2>Patient Details</h2>
      <div className="patient-info">
        <p><strong>Name:</strong> {patientDetails.patientName}</p>
        <p><strong>Date of Birth:</strong> {patientDetails.date_of_birth}</p>
        <p><strong>Age:</strong> {patientDetails.age}</p>
        <p><strong>Email ID:</strong> {patientDetails.email}</p>
        <p><strong>Phone number:</strong> +91 {patientDetails.phone_number}</p>
        <p><strong>Height:</strong> {patientDetails.height} cm</p>
        <p><strong>Weight:</strong> {patientDetails.weight} kg</p>
        <p><strong>Blood Group:</strong> {patientDetails.blood_type}</p>
        {/* Render other patient details here */}
      </div>
      <div className="actions">
      <Link to={`/doc?id=${patientDetails.patient_id}&docId=${doctorId}`}><button className='custom-button'>View Documents</button></Link>
        <button className='custom-button' onClick={handleViewAppointments}>View Previous Appointments</button>
      </div>
      
      
      {/* Modal for viewing previous appointments */}
      {appointmentsModalOpen && (
        <div className="modal">
          <h3>Previous Appointments</h3>
          <ul>
            {previousAppointments.map(appointment => (
              <li key={appointment.id}>
                <p><strong>Doctor:</strong> {appointment.doctor}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
              </li>
            ))}
          </ul>
          <button onClick={() => setAppointmentsModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
  );
};

export default PatientDetails;