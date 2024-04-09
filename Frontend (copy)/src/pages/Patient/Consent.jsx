import React, { useState } from 'react';
import './../../css/Patient/Consent.css';

function Consent() {
  const [activeTab, setActiveTab] = useState('allow');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGrantPermission = (consentId) => {
    const otp = prompt('Enter OTP');
    if (otp === '1234') {
      // Logic to grant permission
      console.log('Permission granted for consent ID:', consentId);
    } else {
      alert('Invalid OTP. Permission not granted.');
    }
  };

  const handleRevokeConsent = (consentId) => {
    // Logic to revoke consent
    console.log('Revoking consent for consent ID:', consentId);
  };

  return (
    <div className="consent-container">
      <div className="tab-buttons">
        <button onClick={() => handleTabChange('allow')} className={activeTab === 'allow' ? 'active' : ''}>
          Allow
        </button>
        <button onClick={() => handleTabChange('given')} className={activeTab === 'given' ? 'active' : ''}>
          Given Consent
        </button>
      </div>

      {activeTab === 'allow' ? (
        <div>
          <h2>Give Consent</h2>
          <table className="consent-table">
            <thead>
              <tr>
                <th>Consent ID</th>
                <th>Expiry Date</th>
                <th>Permission</th>
              </tr>
            </thead>
            <tbody>
              {/* Render consent data */}
              {/* Example data */}
              <tr>
                <td>1</td>
                <td>2024-04-30</td>
                <td>
                  <button onClick={() => handleGrantPermission(1)}>Yes</button>
                  <button>No</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2>Given Consent</h2>
          <table className="consent-table">
            <thead>
              <tr>
                <th>Consent ID</th>
                <th>Revoke</th>
              </tr>
            </thead>
            <tbody>
              {/* Render given consent data */}
              {/* Example data */}
              <tr>
                <td>1</td>
                <td>
                  <button onClick={() => handleRevokeConsent(1)}>Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Consent;
