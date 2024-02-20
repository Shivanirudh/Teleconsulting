import React from 'react';
import '../css/TopNavigationBar.css'; // Adjust the path to your CSS file

function TopNavigationBar({ patientName, onEditProfile, onSignOut }) {
  return (
    <div className="top-navbar">
      <span>Welcome, {patientName}</span>
      <div className="right-links">
        <span className="edit-details-link" onClick={onEditProfile}>
          Edit Details&nbsp;&nbsp;&nbsp;
        </span>
        <span className="signout-link" onClick={onSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default TopNavigationBar;
