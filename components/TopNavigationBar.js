import React, { useState } from 'react';
import '../css/TopNavigationBar.css'; // Adjust the path to your CSS file

function TopNavigationBar({ patientName }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEditProfile = () => {
    // Logic for handling edit profile
    console.log('Edit Profile clicked');
  };

  const handleSignOut = () => {
    // Logic for handling sign out
    console.log('Sign Out clicked');
  };

  return (
    <div className="top-navbar">
      <span>Welcome, {patientName}</span>
      <div className="profile-dropdown">
        <div className="profile" onClick={toggleDropdown}>
          Profile
        </div>
        {showDropdown && (
          <div className="dropdown-content">
            <div onClick={handleEditProfile}>Edit Profile</div>
            <div onClick={handleSignOut}>Sign Out</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNavigationBar;
