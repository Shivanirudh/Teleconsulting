import React, { useState } from 'react';
import logo from './../images/doctor-logo.png';
import './../css/DoctorLogin.css';
import videobg from './../Animation/bg.mp4'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

// Create Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1', // Adjust the URL according to your backend
});

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleGetOTP = () => {
    axiosInstance.post('/auth/generate/doctor/otp', JSON.stringify({ email: email }), {
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
    axiosInstance.post('/auth/doctor/authenticate', JSON.stringify({
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
        navigate('/ddashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid email, password, or OTP');
      });
  };

  return (
    <div className="container">
      <video autoPlay muted loop className="video-bg">
        <source src={videobg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-container">
        <img src={logo} alt="Doctor Logo" className="doctor-logo" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleGetOTP}>Get OTP</button>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default DoctorLogin;
