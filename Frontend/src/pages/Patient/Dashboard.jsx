import React, { useState } from 'react';
import './../../css/Patient/Dashboard.css';
import TopNavigationBar from './TopNavigationBar';
import LeftNavigationBar from './LeftNavigationBar';
import SearchBar from './SearchBar';
import DoctorList from './DoctorList';
import PreviousAppointments from './PreviousAppointments';
import MyDocuments from './MyDocuments';
import BookedAppointments from './BookedAppointments';
// Import other components as needed

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNavItem, setSelectedNavItem] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleNavigation = (page) => {
    setSelectedNavItem(page);
  };

  const renderContent = () => {
    switch (selectedNavItem) {
      case 'home':
        return (
          <>
            <SearchBar onSearch={handleSearch} />
            <DoctorList searchTerm={searchTerm} />
          </>
        );
      case 'previous-appointments':
        return <PreviousAppointments />;
      case 'my-documents':
        return <MyDocuments />;
      case 'booked-appointments':
        return <BookedAppointments/>
      // Add cases for other navigation items
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <TopNavigationBar patientName="Atul Tripathi" />
      <div className="dashboard-content">
        <LeftNavigationBar navigateTo={handleNavigation} />
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
