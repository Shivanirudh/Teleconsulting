import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from './../images/logo.jpeg';
import './../css/login.css';
import Footer from '../components/Footer.jsx';

function Login() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to navigate to DoctorLogin page
  const handleDoctorLogin = () => {
    navigate('/doctorlogin'); // Navigate to DoctorLogin page
  };

  // Function to navigate to PatientLogin page
  const handlePatientLogin = () => {
    navigate('/patientlogin'); // Navigate to PatientLogin page
  };

  return (
    <div className="main-container">
      <div className="big-container">
        <h1>Welcome to E-Consultation</h1>
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h2>E-Consultation</h2>
      </div>
      <div className="login-wrapper">
        <div className="login-container">
          <h2>Doctor Login</h2>
          {/* On button click, call handleDoctorLogin function */}
          <button className="login-button" onClick={handleDoctorLogin}>Doctor Login</button>
        </div>
        <div className="login-container">
          <h2>Patient Login</h2>
          {/* On button click, call handlePatientLogin function */}
          <button className="login-button" onClick={handlePatientLogin}>Patient Login</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Login;
