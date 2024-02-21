import React, { useState } from 'react';
import './../css/PatientLogin.css';
import logo from './../images/patient-login.png';

const PatientLogin = () => {
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
    if (username === 'patient@example.com' && password === 'password' && otp === '0000') {
      alert('Login successful!');
    } else {
      alert('Invalid username, password, or OTP');
    }
  };

  const handleSignUp = () => {
    // Redirect to SignUp page
    window.location.href = '/signup';
  };

  return (
    <div className="container">
      <div className="login-container">
        <img src={logo} alt="Patient Logo" className="patient-logo" />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={!isOtpSent} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleGetOTP} disabled={isOtpSent}>Get OTP</button>
        <button onClick={handleLogin}>Login</button>
        <button className="signup-btn" onClick={handleSignUp}>Don't have an account? Register.</button>
      </div>
    </div>
  );
};

export default PatientLogin;
