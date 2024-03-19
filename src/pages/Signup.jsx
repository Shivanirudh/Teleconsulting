import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/Signup.css';
import logo from './../images/signup-logo.png';
import axios from 'axios';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(0); // Initialize phone as a number
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081/api/v1',
  });

  const handleSignUp = () => {
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      phone && // Make sure phone is not null or empty
      isChecked
    ) {
      console.log(firstName, lastName, email, password, phone, isChecked); // Check if data is correct
      axiosInstance.post('/auth/patient/register', JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        phoneNo: phone
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log(response.data);
          alert('Signup successful!');
          navigate('/patientlogin');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Signup failed!');
        });
    } else {
      alert('Please fill in all fields and agree to terms.');
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleTermsClick = () => {
    window.open('/terms', '_blank');
  };

  return (
    <div className="signup-outer-container">
      <div className="signup-container">
        <img src={logo} alt="Sign Up Logo" className="signup-logo" />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="number" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(parseInt(e.target.value))} /> {/* Ensure phone is a number */}
        <label className="terms-label" style={{ paddingBottom: '13px' }}>
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          <span>I have read and agree to the <span className="terms-link" onClick={handleTermsClick}>terms and agreement</span></span>
        </label>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default SignUp;
