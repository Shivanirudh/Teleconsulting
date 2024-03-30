import React, { useState } from 'react';
import './../../css/Patient/MyDocuments.css';

function MyDocuments() {
  // Dummy data for patient's documents
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents] = useState([
    { id: 1, date: '2023-01-15', name: 'Previous Blood Test Results', file: 'blood_test_results.pdf' },
    { id: 2, date: '2023-02-28', name: 'Prescription - Dr. Smith', file: 'prescription.pdf' },
    { id: 3, date: '2023-03-10', name: 'MRI Scan Report', file: 'mri_scan_report.pdf' },
    // Add more dummy data as needed
  ]);

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle file upload
  const handleFileUpload = () => {
    if (selectedFile) {
      // Perform file upload logic here
      console.log('Uploading file:', selectedFile.name);
      // Reset selected file after upload
      setSelectedFile(null);
    } else {
      console.log('Please select a file to upload.');
    }
  };

  return (
    <div className="patient-my-documents-container">
      <h2>My Documents</h2>
      <div className="patient-previous-documents">
        <h3>Previous Documents</h3>
        <table className="patient-documents-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Date</th>
              <th>Document Name</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr key={document.id}>
                <td>{index + 1}</td>
                <td>{document.date}</td>
                <td>{document.name}</td>
                <td><a href={document.file} download>Download</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="patient-upload-section">
        <h3>Upload New Document</h3>
        <div className="upload-section">
          <input type="file" id="fileInput" onChange={handleFileChange} />
          <label htmlFor="fileInput"></label>
        </div>
        <button className='doc-wala-but' onClick={handleFileUpload}>Upload</button>
      </div>
    </div>
  );
}

export default MyDocuments;
