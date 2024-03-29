import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

// Create Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1', // Adjust the URL according to your backend
});
export default function Navbar() {
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
    <div className="center-links">
    
    </div>
    <div className="right-links">
     
      <span className="signout-link" onClick={handleSignOut}>
        Log out
      </span>
    </div>
  </div>);
}
