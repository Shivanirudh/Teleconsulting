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
      <Navbar />
      <div className="dashboard-content">
        <SideNavbar />
        <div className="main-content">
          <div className="doc-chat-page">
            <div className="video-details-container">
              <div className="video-container">
                {/* Video stream */}
                <div className="big-video">
                  {/* Big video */}
                  <div className="small-video">
                    {/* Small video placeholder */}
                    Small Video Placeholder
                  </div>
                </div>
              </div>
              <div className="details-section">
                <div className="patient-details">
                  {/* Patient details */}
                  <h3>Patient Details</h3>
                  <p>Name: John Doe</p>
                  <p>Age: 35</p>
                  <p>Gender: Male</p>
                  {/* Add more patient details as needed */}
                </div>
              </div>
            </div>
            <div className="document-table">
              {/* Document List */}
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
                      <button
                        className="rambo-but"
                        onClick={() => handleConsent('Document 1')}
                      >
                        Request Consent
                      </button>
                    </td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
            <div className="upload-prescription">
              {/* Upload Prescription */}
              <h3>Upload Prescription</h3>
              <input type="file" id="prescription-file" />
              <button className="upload-button">Upload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocChat;
