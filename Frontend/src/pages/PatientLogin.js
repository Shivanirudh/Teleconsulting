import React, { useState } from 'react';
import './../css/PatientLogin.css';
import logo from './../images/patient-login.png';

const PatientLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState('');

  const handleLogin = () => {
    // Hardcoded username and password for testing
    if (username === 'patient' && password === 'password') {
      setIsVerified(true);
      // Assume OTP generation and sending logic here
      // For demonstration, let's generate a random OTP
      const generatedOtp = Math.floor(1000 + Math.random() * 9000);
      setOtp(generatedOtp);
    }
  };

  const handleOtpVerification = () => {
    // Perform OTP verification logic here
    // For demonstration purposes, let's assume it's verified if OTP is correct
    // In a real application, you'd compare the input OTP with the generated OTP
    alert('OTP verified successfully!');
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
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <button className="signup-btn" onClick={handleSignUp}>Don't have an account? Register.</button>
        {isVerified && (
          <div className="otp-section">
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button onClick={handleOtpVerification}>Verify OTP</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLogin;
