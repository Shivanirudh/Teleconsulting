// SideNavbar.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SideNavbar() {
  const location = useLocation();

  // Define an array of paths where you want to display the SideNavbar
  const allowedPaths = ['/ddashboard', '/ddashboard/upload', '/ddashboard/join-meetings', '/ddashboard/chats', '/ddashboard/appointment'];

  // Check if the current location is in the allowed paths
  const shouldDisplayNavbar = allowedPaths.some(path => location.pathname.startsWith(path));

  // Render the SideNavbar only if it should be displayed
  return shouldDisplayNavbar ? (
    <div className="position-fixed bg-dark text-light" style={{ height:'1000px' , width: '250px',marginTop:'30px'}}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/ddashboard">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/ddashboard/upload">
            Upload Schedule
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/ddashboard/join-meetings">
            Join Meetings
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/ddashboard/chats">
            Chats
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/ddashboard/appointment">
            View Previous Appointments
          </NavLink>
        </li>
      </ul>
    </div>
  ) : null;
}

