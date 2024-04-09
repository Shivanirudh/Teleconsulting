import React, { useState } from 'react';
import './../../css/Patient/EditDetails.css'; 

function EditDetails() {
  // Initial user details state
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
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
    // Here you can send the updated user details to your backend or perform any other actions
    console.log('Updated User Details:', userDetails);
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
            name="firstName"
            value={userDetails.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-edit-form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userDetails.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <button className='edit-det-wala-but' type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditDetails;
