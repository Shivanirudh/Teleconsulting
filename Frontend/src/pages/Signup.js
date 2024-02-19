import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/Signup.css';
import logo from './../images/signup-logo.png';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (signupSuccess) {
      navigate('/patientlogin');
    }
  }, [signupSuccess, navigate]);

  const handleSignUp = () => {
    console.log("Handle sign up called");
    console.log(firstName, lastName, email, password, phone, username, otp, isChecked);
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      phone &&
      otp === '0000' &&
      isChecked
    ) {
      console.log("All conditions met for signup success");
      setSignupSuccess(true);
    }
  };
  

  const handleGetOTP = () => {
    const hardcodedOtp = '0000';
    setOtp(hardcodedOtp);
    setIsOtpSent(true);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleTermsClick = () => {
    window.open('/terms', '_blank');
  };

  return (
    <div className="container">
      <div className="signup-container">
        <img src={logo} alt="Sign Up Logo" className="signup-logo" />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={!isOtpSent || isVerified} />
        <label className="terms-label" style={{ paddingBottom: '13px' }}>
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
        <span>I have read and agree to the <span className="terms-link" onClick={handleTermsClick}>terms and agreement</span></span>
        </label>
        <button onClick={handleGetOTP} disabled={isOtpSent}>Get OTP</button>
        <button onClick={handleSignUp}>Sign Up</button>
        {signupSuccess && <p>Signup successful!</p>}
      </div>
    </div>
  );
};

export default SignUp;
