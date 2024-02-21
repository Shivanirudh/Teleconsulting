import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/TopNavigationBar.css'; // Adjust the path to your CSS file

function TopNavigationBar({ patientName, onSignOut }) {
  return (
    <div className="top-navbar">
      <span>Welcome, {patientName}</span>
      <div className="right-links">
        <Link to="/editdetails" className="edit-details-link">
          Edit Details&nbsp;&nbsp;&nbsp;
        </Link>
        <span className="signout-link" onClick={onSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default TopNavigationBar;
