import React, { useState } from 'react';
import logo from './../images/doctor-logo.png';
import './../css/DoctorLogin.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import axios from 'axios';
import config from '../Config';

const axiosInstance = axios.create({
  baseURL: `${config.apiUrl}/api/v1`,
});

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleGetOTP = () => {
    axiosInstance.post('/auth/generate/doctor/otp', JSON.stringify({ email: email }), {
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
        localStorage.setItem('token-type', 'doctor'); // Store token type
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
          <input
            type="email"
            className="dc-login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {otpSent && (
            <>
              <input
                type="text"
                className="dc-login-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                className="dc-login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          <button className="dc-login-button" onClick={handleGetOTP}>
            Get OTP
          </button>
          {otpSent && (
            <button className="dc-login-button" onClick={handleLogin}>
              Login
            </button>
          )}
          {!otpSent && (
            <button className="dc-login-button" disabled>
              Login
            </button>
          )}
          <a className="linkin-login" href="/dforgotpassword">Forgot Password?</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorLogin;
