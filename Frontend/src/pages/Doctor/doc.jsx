import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../css/Doctor/dicum.css'

import SideNavbar from '../../components/Doctor/sidenavbar';
import TopNavigationBar from '../../components/Doctor/Navbar';

const Documents = () => {
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalListModalOpen, setHospitalListModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const docId = searchParams.get('docId');

  const [documents, setDocuments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [consents, setConsents] = useState([]);

  // const documents = [
  //   { id: 1, name: 'Patient Information.pdf', size: '2 MB' },
  //   { id: 2, name: 'Medical History.docx', size: '500 KB' },
  //   { id: 3, name: 'Latest Scans.zip', size: '10 MB' },
  // ];


  // Dummy hospital list
  // const hospitals = [
  //   { id: 1, name: 'joseph hospital' },
  //   { id: 2, name: 'Kaweri' },
  //   { id: 3, name: 'Sanjeevni' },
  //   { id: 4, name: 'Liladevi' },
  //   { id: 5, name: 'Apollo' },
  //   { id: 6, name: 'Hospit' },
  //   { id: 7, name: 'sechospital' },
  //   { id: 8, name: 'Hospital2' },
  //   { id: 9, name: 'onemore' },
  //   { id: 10, name: 'something' },
  //   // Add more hospitals as needed
  // ];


  useEffect(() => {
    // Fetch booked appointments from API
    fetchDocuments();
    fetchHospitals();
    fetchConsents();
  }, []);

  const fetchDocuments = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/fetch-files/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setDocuments(data);
      })
      .catch((error) => console.error('Error fetching documents:', error));
  };

  const fetchHospitals = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/view-hospitals`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setHospitals(data);
      })
      .catch((error) => console.error('Error fetching hospitals:', error));
  };

  const fetchConsents = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Make API request to fetch appointments
    fetch(`http://localhost:8081/api/v1/doctor/consent`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setConsents(data);
      })
      .catch((error) => console.error('Error fetching consents:', error));
  };

  
  const handleview= (documentName, event) => {
    event.preventDefault();
    // Simulate download for demonstration (replace with actual download logic)
    setSelectedDocument(documentName);

    var reqID = null;
    consents.forEach((consent) => {
      if(consent.patient_id.patient_id === id && documentName === consent.document_name){
        reqID = consent.consent_id;
      }
    });
    if(!reqID){
      alert("You do not have access to this document. Please request consent");
    }
    else{
      
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8081/api/v1/doctor/consent/${reqID}/patient/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          console.log(fileURL);
          // Triggering download directly
          // const link = document.createElement('a');
          // link.href = fileURL;
          // link.setAttribute('download', documentName);
          // document.body.appendChild(link);
          // link.click();

          // Open file in new tab
          window.open(fileURL, '_blank');
          // Cleanup
          URL.revokeObjectURL(fileURL);
        })
        .catch((error) => console.error('Error fetching document:', error));
    }

    
  };

  const handleAskConsent = (documentName, event) => {
    event.preventDefault();
    setSelectedDocument(documentName);
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
  const handleConsentChoice = (choice, documentName) => {
    var reqBody = {
      "document_name": documentName,
      "patient_id": {
          "patient_id": id
      },
      "doctor_id": {
          "doctor_id":"D1"
      }
    }
    if (choice === 'otherHospitals') {
      setHospitalListModalOpen(true);
      reqBody.doctor_id.doctor_id = selectedHospital.hospital_id;
    } else {
      setConsentModalOpen(false);
      setSelectedDocument(null);
      reqBody.doctor_id.doctor_id = docId;
    }

      // Simulate sending consent request based on choice (replace with actual logic)
      console.log(`Sending consent request for "${documentName}" for ${choice}`);

      const token = localStorage.getItem('token');
      fetch('http://localhost:8081/api/v1/doctor/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify(reqBody)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert(`Consent requested for ${documentName}`);
    })
    .catch((error) => console.error('Error requesting consent:', error));
  };

  const handleHospitalSelection = (hospital) => {
    setHospitalListModalOpen(false);
    setSelectedHospital(hospital);
    setConsentModalOpen(false);
    setSelectedDocument(null);
    // Simulate sending consent request for other hospital
    console.log(`Sending consent request for "${selectedDocument}" to ${hospital.name}`);
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
            {/* <th>Size</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>{document}</td>
              {/* <td>{document.size}</td> */}
              <td>
                <button onClick={(event) => handleview(document, event)}>View</button>
                <button onClick={(event) => handleAskConsent(document, event)}>Ask Consent</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {consentModalOpen && (
        <div className="consent-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
          <h3>Grant Access</h3>
          <p>You are requesting access to "{selectedDocument}".</p>
          <button onClick={() => handleConsentChoice('self', selectedDocument)}>For Myself</button>
          <button onClick={() => handleConsentChoice('otherHospitals', selectedDocument)}>For Other Hospitals</button>
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