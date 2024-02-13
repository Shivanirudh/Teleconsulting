// LeftNavigationBar.js
import React from 'react';
import '../css/LeftNavigationBar.css'; // Adjust the path to your CSS file

function LeftNavigationBar({ navigateTo }) {
  return (
    <div className="left-navbar">
      <ul>
        <li onClick={() => navigateTo('previous-appointments')}>Previous Appointments</li>
        <li onClick={() => navigateTo('permission-documents')}>Permission of Documents</li>
        <li onClick={() => navigateTo('audio-video-channel')}>Audio Video Channel</li>
        <li onClick={() => navigateTo('current-appointments')}>Booked Appointments</li>
      </ul>
    </div>
  );
}

export default LeftNavigationBar;
