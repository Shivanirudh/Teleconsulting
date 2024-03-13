import React, { useState } from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isDoctorDashboard = location.pathname.startsWith('/ddashboard');

  // State to manage modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return isDoctorDashboard ? (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"
      style={{ height: '60px', width: '100%' }}
    >
      <div className="container">
        <span className="navbar-brand">Healthcare App</span>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              {/* Button to open the profile modal */}
              <button className="btn btn-outline-light" onClick={handleOpenModal}>
                {/* Your SVG code for the profile icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
              </button>

              {/* Profile Modal */}
              <div className={`modal ${modalVisible ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: modalVisible ? 'block' : 'none' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Doctor Profile</h5>
                      <button type="button" className="close" onClick={handleCloseModal}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {/* Display doctor profile details here */}
                      <p>Name: Doctor Name</p>
                      <p>Role: Junior Doctor</p>
                      <p>Specialisation: Cardiology</p>
                      {/* Add more profile details as needed */}

                      {/* Edit button */}
                      <button className="btn btn-primary" onClick={() => alert('Edit Profile')}>
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  ) : null;
}
