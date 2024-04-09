import React from 'react';
import { useNavigate } from 'react-router-dom';

import './../../css/Patient/LeftNavigationBar.css'; 

export default function SideNavbar() {
  const navigate = useNavigate(); // useNavigate hook to navigate
 
  // Check if the current location is in the allowed paths


  // Function to handle navigation
  const handleNavigation = (route) => {
    navigate(route); // Navigate to the specified route
  };

  // Render the SideNavbar only if it should be displayed
  return (
    <div className="left-navbar">
      <ul>
        <li onClick={() => handleNavigation('/admindashboard')}>Home</li>
        <li onClick={() => handleNavigation('/adminpatient')}>Patient</li>                               
        <li onClick={() => handleNavigation('/admindoctor')}>Doctor</li>
        <li onClick={() => handleNavigation('/adminhospital')}>Hospital</li>
       
      </ul>
    </div>
  );
}
