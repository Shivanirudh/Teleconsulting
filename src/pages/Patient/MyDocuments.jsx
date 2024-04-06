import React, { useState, useEffect } from 'react';
import './../../css/Patient/MyDocuments.css';
import axios from 'axios';

function MyDocuments() {
  const [selectedFile, setSelectedFile] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Fetch documents from the API
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get('http://localhost:8081/api/v1/patient/files', {
        headers
      });

      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleFileUpload = async () => {
    if (selectedFile && selectedFile.length > 0) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage.');
          return;
        }

        const formData = new FormData();
        // Append each selected file to FormData
        for (let i = 0; i < selectedFile.length; i++) {
          formData.append('files', selectedFile[i]);
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };

        const response = await axios.post('http://localhost:8081/api/v1/patient/upload', formData, {
          headers,
        });

        console.log('Files uploaded successfully:', response.data);
        // Clear selected files after successful upload
        setSelectedFile([]);
        // Refetch documents after upload
        fetchDocuments();
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    } else {
      console.log('Please select one or more files to upload.');
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Append filename to the download URL
      const downloadUrl = `http://localhost:8081/api/v1/patient/fetch/${fileName}`;

      // Make GET request to download the file
      const response = await axios.get(downloadUrl, {
        headers,
        responseType: 'blob' // Specify the response type as blob
      });

      // Create a temporary link element to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
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
              <th>Document Name</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((fileName, index) => (
              <tr key={index}>
                <td>{fileName}</td>
                <td><button onClick={() => handleDownload(fileName)}>Download</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="patient-upload-section">
        <h3>Upload New Document</h3>
        <div className="upload-section">
          <input type="file" id="fileInput" multiple onChange={handleFileChange} />
          <label htmlFor="fileInput"></label>
        </div>
        <button className='doc-wala-but' onClick={handleFileUpload}>Upload</button>
      </div>
    </div>
  );
}

export default MyDocuments;
