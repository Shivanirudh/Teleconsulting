import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavigationBar from '../../components/Doctor/Navbar';
import SideNavbar from '../../components/Doctor/sidenavbar';

const ConsentedDocumentsPage = () => {
  const [consentedDocuments, setConsentedDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch consented documents from API or any other source
  useEffect(() => {
    // Replace this fetch logic with your actual API call
    // For demonstration, using dummy data
    const dummyData = [
      { id: 1, patientName: 'John Doe', consentAskedBy: ['Hospital A' ,'Dr.Pancakes']},
      { id: 2, patientName: 'Jane Smith', consentAskedBy: ['Hospital B','Dr.Johns'] },
      // Add more dummy data as needed
    ];
    setConsentedDocuments(dummyData);
  }, []);

  // Filter consented documents based on search query
  const filteredDocuments = consentedDocuments.filter((document) =>
    document.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='dashboard-container'>
        <TopNavigationBar/>
        <div className='dashboard-content'>
            <SideNavbar/>
            <div className='main-content'>
      <h2>Consented Documents</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name of Patient</th>
            <th>Consent Asked By</th>
            <th>View Documents</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((document) => (
            <tr key={document.id}>
              <td>{document.patientName}</td>
              <td>{document.consentAskedBy[1]+': '+ document.consentAskedBy[0]}</td>
              <td>
                <Link to={`/view-documents/${document.id}`}>
                  <button className='custom-button'>View Documents</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
};

export default ConsentedDocumentsPage;
