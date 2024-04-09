import React from 'react';
import SideNavbar from '../../components/Doctor/sidenavbar';
import Navbar from '../../components/Doctor/Navbar';
import '../../css/Doctor/DocChat.css'; // Adjust CSS path as needed

const DocChat = () => {
  const handleConsent = (documentName) => {
    // Logic to handle consent request
    alert(`Consent requested for document: ${documentName}`);
  };

  return (
    <div className="dashboard-container">
      <Navbar/>
      <div className= "dashboard-content">
        <SideNavbar/>
        <div className="main-content">
      
    
    <div className="doc-chat-page">
      
      
          <div className="video-container">
            {/* Big video container for other side */}
            <div className="big-video">
              {/* Video stream of other side */}
              Big Video Placeholder
            </div>
            {/* Small video container for own video */}
            <div className="small-video">
              {/* Video stream of own video */}
              Small Video Placeholder
            </div>
          </div>
          <div className="upload-prescription">
            <h3>Upload Prescription</h3>
            <input type="file" id="prescription-file" />
            <button className="upload-button">Upload</button>
          </div>
          <div className="patient-details">
            {/* Small window of patient details */}
            <h3>Patient Details</h3>
            <p>Name: John Doe</p>
            <p>Age: 35</p>
            <p>Gender: Male</p>
            {/* Add more patient details as needed */}
          </div>
          <div className="document-table">
            <h3>Document List</h3>
            <table>
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Download</th>
                  <th>Consent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Document 1</td>
                  <td>
                    {/* Download button */}
                    <button className="rambo-but">Download</button>
                  </td>
                  <td>
                    {/* Consent button */}
                    <button className="rambo-but" onClick={() => handleConsent('Document 1')}>
                      Request Consent
                    </button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        </div>
        </div>

      

  );
};

export default DocChat;
