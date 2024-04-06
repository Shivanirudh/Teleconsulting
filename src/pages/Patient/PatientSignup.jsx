import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../css/Signup.css';
import logo from './../../images/signup-logo.png';
import axios from 'axios';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081/api/v1',
  });

  const handleGetOTP = () => {
    axiosInstance.post('/auth/patient/register/otp', JSON.stringify({ email: email }), {
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

  const handleSignUp = () => {
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      phoneNumber &&
      age &&
      gender &&
      bloodType &&
      dob &&
      height &&
      weight &&
      isChecked
    ) {
      const dobWithTime = dob + 'T18:18:11';

      axiosInstance
        .post(
          '/auth/patient/register',
          {
            patient: {
              first_name: firstName,
              last_name: lastName,
              email: email,
              password: password,
              phone_number: phoneNumber,
              age: age,
              gender: gender,
              blood_type: bloodType,
              dob: dobWithTime,
              height: height,
              weight: weight
            },
            otp: otp
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response) => {
          console.log(response.data);
          alert('Signup successful!');
          navigate('/patientlogin');
        })
        .catch((error) => {
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
        {!otpSent && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="get-otp-button" onClick={handleGetOTP}>
              Get OTP
            </button>
          </>
        )}
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {/* Add the rest of your input fields here */}
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <div className="line-gap"></div> {/* Line gap */}
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
            >
              <option value="">Select Blood Type</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
            </select>
            <div className="line-gap"></div> {/* Line gap */}
            <input
              type="text"
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <input
              type="number"
              placeholder="Height(cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight(kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </>
        )}
        {/* Your existing input fields */}
        <div className="terms-label">
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          <span>
            &nbsp; &nbsp;I have read and agree to the{' '}
            <span className="terms-link" onClick={handleTermsClick}>
              terms and condition
            </span>
          </span>
        </div>
        <button className="sign-kardunga" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
