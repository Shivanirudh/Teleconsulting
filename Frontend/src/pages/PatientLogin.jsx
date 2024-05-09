import React, { useState } from 'react';
import './../css/PatientLogin.css';
import logo from './../images/patient-login.png';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import axios from 'axios';
import config from '../Config';

const axiosInstance = axios.create({
  baseURL: `${config.apiUrl}/api/v1`,
});

const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false); // State to track OTP sent status
  const navigate = useNavigate();

  const handleGetOTP = () => {
    axiosInstance.post('/auth/generate/patient/otp', JSON.stringify({ email: email }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        alert("OTP has been sent to your email.");
        setOtpSent(true); // Set otpSent to true if OTP is sent successfully
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
        localStorage.setItem('token-type', 'patient'); // Store token type
        localStorage.setItem('firstname', response.data.firstName);
        localStorage.setItem('lastname', response.data.lastName);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('userId', response.data.userId);
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
          <input
            type="email"
            className="ani-login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="ani-login-button" onClick={handleGetOTP}>
            Get OTP
          </button>
          {otpSent && (
            <>
              <input
                type="text"
                className="ani-login-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                className="ani-login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="ani-login-button" onClick={handleLogin}>
                Login
              </button>
            </>
          )}
          {!otpSent && (
            <button className="ani-login-button" disabled>
              Login
            </button>
          )}
          <a className="linkin-login" href="/patientsignup">
            Don't have an account? Register.
          </a>
          <br />
          <a className="linkin-login" href="/pforgotpassword">Forgot Password?</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientLogin;
