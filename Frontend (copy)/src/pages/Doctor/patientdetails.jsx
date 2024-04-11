import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNavigationBar from '../../components/Doctor/Navbar';
import SideNavbar from '../../components/Doctor/sidenavbar';

const PatientDetails = () => {
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);

  // Dummy data for patient details
  const patientDetails = {
    name: 'John Doe',
    bloodGroup: 'O+',
    // Add more patient details as needed
  };

  // Dummy data for previous appointments
  const previousAppointments = [
    { id: 1, doctor: 'Dr. Smith', date: '2023-01-15', reason: 'Checkup' },
    { id: 2, doctor: 'Dr. Johnson', date: '2022-12-20', reason: 'Follow-up' },
    // Add more appointments as needed
  ];

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
        <p><strong>Name:</strong> {patientDetails.name}</p>
        <p><strong>Blood Group:</strong> {patientDetails.bloodGroup}</p>
        {/* Render other patient details here */}
      </div>
      <div className="actions">
      <Link to="/doc"><button className='custom-button'>View Documents</button></Link>
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
