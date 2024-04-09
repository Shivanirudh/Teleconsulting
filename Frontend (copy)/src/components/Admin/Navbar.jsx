import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import '../../css/Admin/Navbar.css'

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
        {/* Add your center links here */}
      </div>
      <div className="right-links">
        <span className="signout-link" onClick={handleSignOut} style={{ 
          backgroundColor: 'red',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          transition: 'box-shadow 0.3s, color 0.3s',
          cursor: 'pointer',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
          }}>
          Log out
        </span>
      </div>
    </div>
  );
}
