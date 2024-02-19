import React, { useState } from 'react';
import './../css/DoctorLogin.css';
import logo from './../images/doctor-logo.png';

const DoctorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

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
      alert('Login successful!');
    } else {
      alert('Invalid username, password, or OTP');
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <img src={logo} alt="Doctor Logo" className="doctor-logo" />
        <input type="email" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={!isOtpSent || isVerified} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!isOtpSent || isVerified} />
        <button onClick={handleGetOTP} disabled={isOtpSent}>Get OTP</button>
        <button onClick={handleLogin} disabled={!isOtpSent || isVerified}>Login</button>
      </div>
    </div>
  );
};

export default DoctorLogin;
