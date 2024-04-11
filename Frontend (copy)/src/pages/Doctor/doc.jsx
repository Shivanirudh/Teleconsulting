import React, { useState } from 'react';
import '../../css/Doctor/dicum.css'

import SideNavbar from '../../components/Doctor/sidenavbar';
import TopNavigationBar from '../../components/Doctor/Navbar';

const Documents = () => {
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalListModalOpen, setHospitalListModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  


  const documents = [
    { id: 1, name: 'Patient Information.pdf', size: '2 MB' },
    { id: 2, name: 'Medical History.docx', size: '500 KB' },
    { id: 3, name: 'Latest Scans.zip', size: '10 MB' },
  ];

  // Dummy hospital list
  const hospitals = [
    { id: 1, name: 'joseph hospital' },
    { id: 2, name: 'Kaweri' },
    { id: 3, name: 'Sanjeevni' },
    { id: 4, name: 'Liladevi' },
    { id: 5, name: 'Apollo' },
    { id: 6, name: 'Hospit' },
    { id: 7, name: 'sechospital' },
    { id: 8, name: 'Hospital2' },
    { id: 9, name: 'onemore' },
    { id: 10, name: 'something' },
    // Add more hospitals as needed
  ];
  
  const handleview= (document) => {
    // Simulate download for demonstration (replace with actual download logic)
    setSelectedDocument(document);
  };

  const handleAskConsent = (document, event) => {
    event.preventDefault();
    setSelectedDocument(document);
    setModalPosition({ top: event.clientY, left: event.clientX });
    setConsentModalOpen(true);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  
  
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleConsentChoice = (choice) => {
    if (choice === 'otherHospitals') {
      setHospitalListModalOpen(true);
    } else {
      setConsentModalOpen(false);
      setSelectedDocument(null);
      // Simulate sending consent request based on choice (replace with actual logic)
      console.log(`Sending consent request for "${selectedDocument.name}" for ${choice}`);
    }
  };

  const handleHospitalSelection = (hospital) => {
    setHospitalListModalOpen(false);
    setSelectedHospital(hospital);
    setConsentModalOpen(false);
    setSelectedDocument(null);
    // Simulate sending consent request for other hospital
    console.log(`Sending consent request for "${selectedDocument.name}" to ${hospital.name}`);
  };

  return (
    <div className='dashboard-container'>
        <TopNavigationBar/>
    <div className='dashboard-content'>
        <SideNavbar/>
    <div className='main-content'>
    <div className="documents">
      <h2>Documents</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>{document.name}</td>
              <td>{document.size}</td>
              <td>
                <button onClick={(event) => handleview(document)}>View</button>
                <button onClick={(event) => handleAskConsent(document, event)}>Ask Consent</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {consentModalOpen && (
        <div className="consent-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
          <h3>Grant Access</h3>
          <p>You are requesting access to "{selectedDocument?.name}".</p>
          <button onClick={() => handleConsentChoice('self')}>For Myself</button>
          <button onClick={() => handleConsentChoice('otherHospitals')}>For Other Hospitals</button>
          <button onClick={() => setConsentModalOpen(false)}>Cancel</button>
        </div>
      )}
      {hospitalListModalOpen && (
  <div className="hospital-list-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
    <h3>Select Hospital</h3>
    <input
      type="text"
      placeholder="Search hospitals..."
      value={searchQuery}
      onChange={handleSearchInputChange}
    />
    <ul>
      {filteredHospitals.map((hospital) => (
        <li key={hospital.id}>
          <button onClick={() => handleHospitalSelection(hospital)}>{hospital.name}</button>
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
    </div>
    </div>
    </div>
  );
};

export default Documents;
