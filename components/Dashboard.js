// Dashboard.js
import React, { useState } from 'react';
import './../css/Dashboard.css';
import TopNavigationBar from './TopNavigationBar';
import LeftNavigationBar from './LeftNavigationBar';
import SearchBar from './SearchBar';
import DoctorList from './DoctorList';

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleNavigation = (page) => {
    // Handle navigation to different pages
    console.log('Navigating to:', page);
  };

  return (
    <div className="dashboard-container">
      <TopNavigationBar patientName="Atul Tripathi" />
      <div className="dashboard-content">
        <LeftNavigationBar navigateTo={handleNavigation} />
        <div className="main-content">
          <SearchBar onSearch={handleSearch} />
          <DoctorList searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
