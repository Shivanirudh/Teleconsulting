import React, { useState } from 'react';
import './../css/PatientLogin.css';
import logo from './../images/patient-login.png';
import { useNavigate } from 'react-router-dom';
import videobg from './../Animation/bg.mp4';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleGetOTP = () => {
    axiosInstance.post('/auth/generate/patient/otp', JSON.stringify({ email: email }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        alert("OTP has been sent to your email.");
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleLogin = () => {
    axiosInstance.post('/auth/patient/authenticate', JSON.stringify({
      email: email,
      otp: otp,
      password: password,
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        navigate('/patientdashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid email, password, or OTP');
      });
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="patient-login-container">
      <video autoPlay muted loop className="login-video-bg">
        <source src={videobg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-content-container">
        <img src={logo} alt="Patient Logo" className="patient-logo" />
        <input type="email" className="login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" className="login-input" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <input type="password" className="login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="login-button" onClick={handleGetOTP}>Get OTP</button>
        <button className="login-button" onClick={handleLogin}>Login</button>
        <button className="signup-btn" onClick={handleSignUp}>Don't have an account? Register.</button>
      </div>
    </div>
  );
};

export default PatientLogin;