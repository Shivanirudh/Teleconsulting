// LeftNavigationBar.js
import React from 'react';


function LeftNavigationBar({ navigateTo }) {
  return (
    <div className="left-navbar">
      <ul>
        <li onClick={() => navigateTo('home')}>Home</li>

        <li onClick={() => navigateTo('booked-appointments')}>Booked Appointments</li>
        <li onClick={() => navigateTo('my-documents')}>My Documents</li>


        <li onClick={() => navigateTo('/pchats')}>Audio Video Channel</li>
        <li onClick={() => navigateTo('consent')}>Consent</li>
      </ul>
    </div>
  );
}

export default LeftNavigationBar;
