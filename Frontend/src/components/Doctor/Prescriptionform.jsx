// PrescriptionForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import config from './../../Config';

const PrescriptionForm = ({ appointmentId }) => {
  const [formData, setFormData] = useState({
    symptoms: '',
    medicines_and_dosage: '',
    advice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
  
      // Merge appointmentId with formData
      const dataToSend = { ...formData, appointment_id: appointmentId };

      // Make POST request to API endpoint using Axios
      const response = await axios.post(
        `${config.apiUrl}/api/v1/doctor/upload-prescription`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Prescription uploaded successfully:', response.data);
      alert('Prescription uploaded successfully:');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading prescription:', error);
      alert('Error uploading prescription:');
      console.log(error.data);
    }
  };
  

  return (
    <div>
      <h2>Prescription Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Removed appointment ID input */}
        <div>
          <label htmlFor="symptoms">Symptoms:</label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="medicines_and_dosage">Medicines & Dosage:</label>
          <textarea
            id="medicines_and_dosage"
            name="medicines_and_dosage"
            value={formData.medicines_and_dosage}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="advice">Advice:</label>
          <textarea
            id="advice"
            name="advice"
            value={formData.advice}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PrescriptionForm;