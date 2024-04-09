import React, { useState } from 'react';
import axios from 'axios';
import './../../css/ForgotPassword.css';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
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
        setOtpSent(true);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleResetPassword = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    axiosInstance.post('/auth/admin/forgotpassword', JSON.stringify({
      email: email,
      otp: otp,
      password: password,
      retype_password: retypePassword
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response.data);
        alert('Password Reset successful!');
        navigate('/adminlogin');
      })
      .catch(error => {
        console.error('Error:', error.response.data);
        alert('Password reset failed. Please try again.');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    handleGetOTP();
  };

  return (
    <div className="forgot-password-outer-container">
      <div className="forgot-password-container">
      <h2 className='heading'>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="forgot-password-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <button className="forgot-password-button" type="submit">Get OTP</button>
        </form>
        {otpSent && (
          <form onSubmit={(event) => handleResetPassword(event)}>
            <input
              type="text"
              className="forgot-password-input"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              className="forgot-password-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              className="forgot-password-input"
              placeholder="Retype Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
            />
            <br />
            <button className="forgot-password-button" type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
