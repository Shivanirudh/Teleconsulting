import React, { useState } from 'react';
import './../../css/Patient/Dashboard.css';
import TopNavigationBar from '../../components/Patient/TopNavigationBar';
import LeftNavigationBar from '../../components/Patient/LeftNavigationBar';
import SearchBar from './../../components/Patient/SearchBar';
import DoctorList from './DoctorList';
import PreviousAppointments from './PreviousAppointments';
import MyDocuments from './MyDocuments';
import BookedAppointments from './BookedAppointments';
import Pconsent from './Consent'
import Chats from './Pchats'
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
            <DoctorList searchTerm={searchTerm} />
          </>
        );
      case 'previous-appointments':
        return <PreviousAppointments />;
      case 'my-documents':
        return <MyDocuments />;
      case 'booked-appointments':
        return <BookedAppointments/>
      case 'chats':
          return <Chats/>
      case 'consent':
        return <Pconsent/>
      // Add cases for other navigation items
      default: return (
        <>
          <DoctorList searchTerm={searchTerm} />
        </>
      );
    }
  };

  return (
    <div className="patient-dashboard-container">
      <TopNavigationBar />
      <div className="patient-dashboard-content">
        <LeftNavigationBar navigateTo={handleNavigation} />
        <div className="patiient-main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
