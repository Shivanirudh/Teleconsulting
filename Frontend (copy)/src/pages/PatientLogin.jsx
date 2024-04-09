import React, { useState } from 'react';
import './../css/PatientLogin.css';
import logo from './../images/patient-login.png';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
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
    console.log(JSON.stringify({ email: email }));
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
        localStorage.setItem('firstname', response.data.firstName);
        localStorage.setItem('lastname', response.data.lastName);
        localStorage.setItem('email', response.data.email);
        alert('Login successful!');
        navigate('/patientdashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid email, password, or OTP');
      });
  };

  return (
    <div>
      <Header />
      <div className="ani-patient-login-container">
        <div className="ani-login-content-container">
          <img src={logo} alt="Patient Logo" className="ani-patient-logo" />
          <input type="email" className="ani-login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" className="ani-login-input" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <input type="password" className="ani-login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="ani-login-button" onClick={handleGetOTP}>Get OTP</button>
          <button className="ani-login-button" onClick={handleLogin}>Login</button>
          <a className="linkin-login" href="/patientsignup">Don't have an account? Register.</a><br />
          <a className="linkin-login" href="/pforgotpassword">Forgot Password?</a>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default PatientLogin;
