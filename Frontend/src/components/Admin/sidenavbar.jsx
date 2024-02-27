// SideNavbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function SideNavbar() {
  return (
    <div className="position-fixed bg-dark text-light" style={{ height: '100%', width: '250px' }}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/admindashboard">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/adminpatient">
            Patient
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-light" to="/admindoctor">
            Doctor
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
