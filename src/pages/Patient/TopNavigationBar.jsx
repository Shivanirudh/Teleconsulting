import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useHistory
import './../../css/Patient/TopNavigationBar.css'; // Adjust the path to your CSS file

function TopNavigationBar({ patientName, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <div className="top-navbar">
      <span>Welcome, {patientName}</span>
      <div className="right-links">
        <Link to="/patienteditdetails" className="edit-details-link">
          Edit Details&nbsp;&nbsp;&nbsp;
        </Link>
        <span className="signout-link" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default TopNavigationBar;
