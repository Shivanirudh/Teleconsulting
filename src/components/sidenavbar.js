// SideNavbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function SideNavbar() {
  return (
    <div className="position-fixed bg-dark text-light" style={{ height: '100%', width: '250px' }}>
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
          <NavLink className="nav-link text-light" to="/join-meetings">
            Join Meetings
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/chats">
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
  );
}
