import React, { useState } from 'react';
import logo from './../images/admin.jpg';
import './../css/AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import videobg from './../Animation/bg.mp4';
import axios from 'axios';
import config from '../Config';

const axiosInstance = axios.create({
  baseURL: `${config.apiUrl}/api/v1`,
});

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleGetOTP = () => {
    axiosInstance.post('/auth/generate/admin/otp', JSON.stringify({ email: email }), {
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
    axiosInstance.post('/auth/admin/authenticate', JSON.stringify({
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
        localStorage.setItem('token-type', 'admin'); // Store token type
        alert('Login successful!');
        navigate('/admindashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid email, password, or OTP');
      });
  };

  return (
    <div className="admin-login-container">
      <video autoPlay muted loop className="login-video-bg">
        <source src={videobg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-content-container">
        <img src={logo} alt="Admin Logo" className="admin-logo" />
        <input type="email" className="login-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {otpSent && (
          <>
            <input type="text" className="login-input" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <input type="password" className="login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </>
        )}
        <button className="login-button" onClick={handleGetOTP}>Get OTP</button>
        <button className="login-button" onClick={handleLogin}>Login</button>
        <a className="linkin-login" href="/aforgotpassword">Forgot Password?</a>
      </div>
    </div>
  );
};

export default AdminLogin;
