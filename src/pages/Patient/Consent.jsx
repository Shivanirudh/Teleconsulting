import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../../css/Patient/Consent.css';
import config from './../../Config';

function Consent() {
  const [activeTab, setActiveTab] = useState('given'); // Changed initial state to 'given'
  const [consentsRequested, setConsentsRequested] = useState([]);
  const [selectedConsentId, setSelectedConsentId] = useState('');
  const [expiryDays, setExpiryDays] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    fetchConsentsRequested();
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail);
  }, []);

  const fetchConsentsRequested = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.apiUrl}/api/v1/patient/consents-requested`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConsentsRequested(response.data);
    } catch (error) {
      console.error('Error fetching consents requested:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGrantPermission = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = JSON.stringify({
        consent_id: selectedConsentId,
        expiry_day: expiryDays,
        otp: otp,
      });
      console.log(data);
      const response = await axios.put(`${config.apiUrl}/api/v1/patient/give-consent`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        alert('Permission granted successfully.');
        // Additional logic if needed upon successful permission grant
      } else {
        console.error('Failed to grant permission:', response.statusText);
        // Additional error handling if needed
      }
    } catch (error) {
      console.error('Error granting permission:', error);
    }
  };

  const expiryDayOptions = [15, 30, 90, 180];

  return (
    <div className="consent-container">
      <div className="tab-buttons">
        <button onClick={() => handleTabChange('given')} className={activeTab === 'given' ? 'active' : ''}>
          All Consent Requested
        </button>
        <button onClick={() => handleTabChange('allow')} className={activeTab === 'allow' ? 'active' : ''}>
          Allow
        </button>
      </div>

      {activeTab === 'given' ? (
        <div>
          <h2>All Consents Requested</h2>
          <table className="consent-table12">
            <thead>
              <tr>
                <th>Consent ID</th>
                <th>Doctor Name</th>
                <th>Hospital Name</th>
                <th>Document Name</th>
              </tr>
            </thead>
            <tbody>
              {consentsRequested.map((consent) => (
                <tr key={consent.consent_id}>
                  <td>{consent.consent_id}</td>
                  <td>{consent.doctor_id.first_name} {consent.doctor_id.last_name}</td>
                  <td>{consent.hospital_id.name}</td>
                  <td>{consent.document_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2>Give Consent</h2>
          <label className='selectionofconsent'>Select Consent ID:</label>
          <select value={selectedConsentId} onChange={(e) => setSelectedConsentId(e.target.value)}>
            <option value="">Select Consent</option>
            {consentsRequested.map((consent) => (
              <option key={consent.consent_id} value={consent.consent_id}>
                {consent.consent_id}
              </option>
              
            ))}
            
          </select>
          <label className='selectionofconsent'>Expiry Days:</label>
          <select value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)}>
            <option value="">Select Expiry Days</option>
            {expiryDayOptions.map((days) => (
              <option key={days} value={days}>
                {days}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
           <div style={{ width: '2zzz0px' }}>
           <label style={{margin:'10px'}}>OTP:</label>
           <input
           type="text"
           value={otp}
           onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            />
          </div>
           </div>
           <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button  onClick={handleGrantPermission} className="active" className='grant-permission'>
            Grant Permission
          </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Consent;