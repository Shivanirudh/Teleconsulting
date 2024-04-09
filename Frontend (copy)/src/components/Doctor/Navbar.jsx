import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useHistory
import './../../css/Patient/TopNavigationBar.css'; // Adjust the path to your CSS file
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

  function TopNavigationBar({ patientName, onSignOut }) {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(localStorage.getItem('firstname'));
    const [lastName, setLastName] = useState(localStorage.getItem('lastname'));

    useEffect(() => {
      const fetchPatientData = async () => {
        try {
          const token = localStorage.getItem('token');
          
          const response = await axiosInstance.get('/doctor/',{
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
    
          const data = response.data;
          console.log(data);
          const { first_name, last_name } = data;
    
          // Update first name and last name
          setFirstName(first_name);
          setLastName(last_name);
    
          // Store updated first name and last name in local storage
          localStorage.setItem('firstname', first_name);
          localStorage.setItem('lastname', last_name);
        } catch (error) {
          console.error('Error fetching doctor data:', error);
        }
      };
    
      fetchPatientData();
    }, []);
  
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

    
  // const firstName = localStorage.getItem('firstname');
  // const lastName = localStorage.getItem('lastname');



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
