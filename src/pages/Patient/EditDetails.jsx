import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './../../css/Patient/EditDetails.css'; // Assuming the CSS path

function EditDetails() {
  // Initialize useNavigate hook
  const navigate = useNavigate();

  // Initial user details state with corrected field name and added phone number
  const [userDetails, setUserDetails] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    height: '',
    weight: ''
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Prepare the payload
    const payload = {
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      gender: userDetails.gender,
      height: userDetails.height,
      weight: userDetails.weight
    };

    // Send PUT request to update user details
    fetch('http://localhost:8081/api/v1/patient/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.ok) {
        console.log('User details updated successfully');
        // Reset the form fields after successful update
        setUserDetails({
          first_name: '',
          last_name: '',
          weight: '',
          height: '',
          gender: '',
        });
        // Navigate to /patientdashboard
        navigate('/patientdashboard');
      } else {
        console.error('Failed to update user details');
      }
    })
    .catch(error => {
      console.error('Error occurred while updating user details:', error);
    });
  };

  return (
    <div className="edit-form-container"> {/* Apply CSS class to container */}
      <h2>Edit Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="edit-form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="first_name"
            value={userDetails.first_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="last_name"
            value={userDetails.last_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={userDetails.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div className="edit-form-group">
          <label htmlFor="weight">Weight:</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={userDetails.weight}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="height">Height:</label>
          <input
            type="number"
            id="height"
            name="height"
            value={userDetails.height}
            onChange={handleInputChange}
          />
        </div>
        <button className='edit-det-wala-but' type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditDetails;
