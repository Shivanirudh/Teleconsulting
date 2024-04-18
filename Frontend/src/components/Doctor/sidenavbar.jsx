import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './../../css/Patient/LeftNavigationBar.css'; 

export default function SideNavbar() {
  const navigate = useNavigate(); // useNavigate hook to navigate
  const location = useLocation();

  // Define an array of paths where you want to display the SideNavbar
  
  // Function to handle navigation
  const handleNavigation = (route) => {
    navigate(route); // Navigate to the specified route
  };

  // Render the SideNavbar only if it should be displayed
  return (
    <div className="left-navbar">
      <ul>
        <li onClick={() => handleNavigation('/ddashboard')}>Home</li>
        <li onClick={() => handleNavigation('/ddashboard/upload')}>Upload Schedule</li>                               
        <li onClick={() => handleNavigation('/ddashboard/docchat')}>Chats</li>
        {/* <li onClick={() => handleNavigation('/ddashboard/appointment')}>PreviousAppointments</li> */}
        <li onClick={()=> handleNavigation('/condoc')}>Documents</li>
      </ul>
    </div>
  )
}