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
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">E-Consultation</Link>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-outline-light" onClick={handleSignOut}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
