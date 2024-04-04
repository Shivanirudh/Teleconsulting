import React, { useState } from 'react';
import logo from './../images/doctor-logo.png';
import './../css/DoctorLogin.css';
import videobg from './../Animation/bg.mp4';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
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
        localStorage.setItem('firstname', response.data.firstName);
        localStorage.setItem('lastname', response.data.lastName);
        alert('Login successful!');
        navigate('/ddashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid email, password, or OTP');
      });
  };

  return (
    <div>
      <Header />
      <div className="doctor-login-page">

        <div className="dc-login-container">
          <img src={logo} alt="Doctor Logo" className="dc-doctor-logo" />
          <input type="email" className="dc-login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" className="dc-login-input" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <input type="password" className="dc-login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="dc-login-button" onClick={handleGetOTP}>Get OTP</button>
          <button className="dc-login-button" onClick={handleLogin}>Login</button>
          <a className="linkin-login" href="/dforgotpassword">Forgot Password?</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorLogin;
