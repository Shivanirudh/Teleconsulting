import React, { useState } from 'react';
import logo from '../../images/doctor-logo.png';
import '../../css/DoctorLogin.css';
import videobg from '../../Animation/bg.mp4';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleGetOTP = () => {
    // Assume OTP generation and sending logic here
    // For demonstration, let's set a hardcoded OTP
    const hardcodedOtp = '0000';
    setOtp(hardcodedOtp);
    setIsOtpSent(true);
  };

  const handleLogin = () => {
    // Perform login logic here
    if (otp === '' || password === '') {
      alert('Please enter OTP and password');
      return;
    }
    // Hardcoded username and password for testing
    if (username === 'doctor@example.com' && password === 'password' && otp === '0000') {
      navigate("/ddashboard");
    } else {
      alert('Invalid username, password, or OTP');
    }
  };

  return (
    <div className="doctor-login-page">
      <video autoPlay muted loop className="login-video-bg">
        <source src={videobg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-container">
        <img src={logo} alt="Doctor Logo" className="doctor-logo" />
        <input type="email" className="login-input" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" className="login-input" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={!isOtpSent} />
        <input type="password" className="login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!isOtpSent} />
        <button className="login-button" onClick={handleGetOTP} disabled={isOtpSent}>Get OTP</button>
        <button className="login-button" onClick={handleLogin} disabled={!isOtpSent}>Login</button>
      </div>
    </div>
  );
};

export default DoctorLogin;
