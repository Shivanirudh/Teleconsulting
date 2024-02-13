// TopNavigationBar.js
import React from 'react';
import '../css/TopNavigationBar.css'; // Adjust the path to your CSS file

function TopNavigationBar({ patientName }) {
  return (
    <div className="top-navbar">
      <span>Welcome, {patientName}</span>
      <div className="notification-icon">Notification Icon</div>
    </div>
  );
}

export default TopNavigationBar;
