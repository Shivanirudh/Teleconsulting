// LeftNavigationBar.js
import React from 'react';


function LeftNavigationBar({ navigateTo }) {
  return (
    <div className="left-navbar">
      <ul>
        <li onClick={() => navigateTo('home')}>Home</li>

        <li onClick={() => navigateTo('booked-appointments')}>Booked Appointments</li>
        <li onClick={() => navigateTo('my-documents')}>My Documents</li>


        <li onClick={() => navigateTo('audio-video-channel')}>Audio Video Channel</li>

        <li onClick={() => navigateTo('previous-appointments')}>Previous Appointments</li>
      </ul>
    </div>
  );
}

export default LeftNavigationBar;
