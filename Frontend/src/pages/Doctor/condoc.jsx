import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavigationBar from '../../components/Doctor/Navbar';
import SideNavbar from '../../components/Doctor/sidenavbar';
// import './../../css/Doctor/ddashboard.css'; 

const ConsentedDocumentsPage = () => {
  const [consentedDocuments, setConsentedDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch consented documents from API or any other source
  useEffect(() => {
    // Replace this fetch logic with your actual API call
    // For demonstration, using dummy data
    // const dummyData = [
    //   { id: 1, patientName: 'John Doe', consentAskedBy: ['Hospital A' ,'Dr.Pancakes']},
    //   { id: 2, patientName: 'Jane Smith', consentAskedBy: ['Hospital B','Dr.Johns'] },
    //   // Add more dummy data as needed
    // ];
    // setConsentedDocuments(dummyData);
    fetchConsents();
  }, []);

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
        
        data.forEach((document) => {
            document.patientName = document.patient_id.first_name + ' ' + document.patient_id.last_name;
        }, []);

        setConsentedDocuments(data);
      })
      .catch((error) => console.error('Error fetching consents:', error));
  };

  // Filter consented documents based on search query
  const filteredDocuments = consentedDocuments.filter((document) =>
    document.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleView = (document) => {
    const token = localStorage.getItem('token');
      fetch(`http://localhost:8081/api/v1/doctor/consent/${document.consent_id}/patient/${document.patient_id.patient_id}`, {
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
              <table style={{ width: '100%', textAlign: 'center' }}>
                <thead>
                  <tr>
                    <th>Name of Patient</th>
                    <th>Consent Requested For</th>
                    <th>Document Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => (
                    <tr key={document.id}>
                      <td>{document.patient_id.first_name + " " + document.patient_id.last_name}</td>
                      <td>{document.doctor_id.first_name + " " + document.doctor_id.last_name+' : '+ document.hospital_id.name}</td>
                      <td>{document.document_name}</td>
                      <td>
                        {/* <Link to={`/view-documents/${document.id}`}> */}
                          <button onClick={() => handleView(document)} className='custom-button'>View</button>
                        {/* </Link> */}
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
