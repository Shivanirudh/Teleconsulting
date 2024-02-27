import React, {useState} from 'react';
import logo from './../images/admin.jpg';
import './../css/AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import videobg from './../Animation/bg.mp4'
import axios from 'axios'; // Import Axios

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1', // Adjust the URL according to your backend
});

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleGetOTP = () => {
    axiosInstance.post('/auth/generate/admin/otp', JSON.stringify({ email: email }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        alert("OTP has been sent to your email.");
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
        alert('Login successful!');
        navigate('/admindashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Invalid email, password, or OTP');
      });
  };


    return (
        <div className="container">
          <video autoPlay muted loop className="video-bg">
            <source src={videobg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="login-container">
            <img src={logo} alt="Patient Logo" className="patient-logo" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleGetOTP}>Get OTP</button>
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      );
};

export default AdminLogin;