import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './../../css/Patient/LeftNavigationBar.css'; 

export default function SideNavbar() {
  const navigate = useNavigate(); // useNavigate hook to navigate
  const location = useLocation();

  // Define an array of paths where you want to display the SideNavbar
  const allowedPaths = ['/ddashboard', '/ddashboard/upload', '/ddashboard/join-meetings', '/ddashboard/chats', '/ddashboard/appointment'];

  // Check if the current location is in the allowed paths
  const shouldDisplayNavbar = allowedPaths.some(path => location.pathname.startsWith(path));

  // Function to handle navigation
  const handleNavigation = (route) => {
    navigate(route); // Navigate to the specified route
  };

  // Render the SideNavbar only if it should be displayed
  return shouldDisplayNavbar ? (
    <div className="left-navbar">
      <ul>
        <li onClick={() => handleNavigation('/ddashboard')}>Home</li>
        <li onClick={() => handleNavigation('/ddashboard/upload')}>Upload Schedule</li>                               
        <li onClick={() => handleNavigation('/ddashboard/docchat')}>Chats</li>
        <li onClick={() => handleNavigation('/ddashboard/appointment')}>PreviousAppointments</li>
      </ul>
    </div>
  ) : null;
}