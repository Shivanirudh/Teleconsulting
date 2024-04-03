import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../../css/Patient/TopNavigationBar.css';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

function TopNavigationBar({ patientName, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    axiosInstance.post('/auth/logout', null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      console.log(response.data.message);
      localStorage.removeItem('token');
      localStorage.removeItem('firstname');
      localStorage.removeItem('lastname');
      navigate('/');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const firstName = localStorage.getItem('firstname');
  const lastName = localStorage.getItem('lastname');

  return (
    <div className="top-navbar">
      <div className="center-links">
        <span className="welcome-text">Welcome, {firstName} {lastName}</span>
      </div>
      <div className="right-links">
        <Link to="/patienteditdetails" className="edit-details-button">
          Edit Details
        </Link>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default TopNavigationBar;
