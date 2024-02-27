import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../../css/Patient/TopNavigationBar.css';
import axios from 'axios'; // Import Axios

// Create Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1', // Adjust the URL according to your backend
});

function TopNavigationBar({ patientName, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Send request to backend to logout using Axios
    axiosInstance.post('/auth/logout', null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      console.log(response.data.message); // Log the response from backend
      // Clear token from local storage
      localStorage.removeItem('token');
      // Redirect to the home page
      navigate('/');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="top-navbar">
      <span>Welcome, {patientName}</span>
      <div className="right-links">
        <Link to="/patienteditdetails" className="edit-details-link">
          Edit Details&nbsp;&nbsp;&nbsp;
        </Link>
        <span className="signout-link" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default TopNavigationBar;
