import React, { useState } from 'react';
import logo from './../images/doctor-logo.png';
import './../css/DoctorLogin.css';
import videobg from './../Animation/bg.mp4'

const DoctorLogin = () => {
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
      // navigate('/doctordashboard');
      alert('Login Successfull');
    } else {
      alert('Invalid username, password, or OTP');
    }
  };

  return (
    <div className="container">
      <video autoPlay muted loop className="video-bg">
        <source src={videobg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-container">
        <img src={logo} alt="Doctor Logo" className="doctor-logo" />
        <input type="email" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={!isOtpSent} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!isOtpSent} />
        <button onClick={handleGetOTP} disabled={isOtpSent}>Get OTP</button>
        <button onClick={handleLogin} disabled={!isOtpSent}>Login</button>
      </div>
    </div>
  );
};

export default DoctorLogin;
