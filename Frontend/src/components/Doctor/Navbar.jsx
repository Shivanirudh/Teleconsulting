import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useHistory
import './../../css/Patient/TopNavigationBar.css'; // Adjust the path to your CSS file
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

  console.log('First Name:', firstName);
  console.log('Last Name:', lastName);


  return (
    <div className="top-navbar">
      <div className="center-links">
        <span className="welcome-text">Welcome, {firstName} {lastName}</span>
      </div>
      <div className="right-links">
        <Link to="/deditdetails" className="edit-details-button">
          Edit Details
        </Link>
        <span className="signout-button" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default TopNavigationBar;
