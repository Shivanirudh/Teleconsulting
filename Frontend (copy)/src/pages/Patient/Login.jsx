import React from 'react';
import logo from './../../images/logo.jpeg'; // Import your logo image
import './../../css/Patient/login.css'; // You can define your styles in a separate CSS file
import Footer from './Footer.jsx';

function Login() {
  return (
    <div className="main-container">
      {/* Big container */}
      <div className="big-container">
        <h1>Welcome to E-Consultation</h1>
      </div>
      
      {/* Container with logo and site name */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h2>E-Consultation</h2>
      </div>
      
      {/* Container for login */}
      <div className="login-wrapper">
        <div className="login-container">
          <h2>Doctor Login</h2>
          <button className="login-button">Doctor Login</button>
        </div>
        
        {/* Container for login */}
        <div className="login-container">
          <h2>Patient Login</h2>
          <button className="login-button">Patient Login</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Login;
