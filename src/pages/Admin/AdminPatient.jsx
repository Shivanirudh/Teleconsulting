import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Admin/searchbar.css'; // Import CSS file

// Separate component for the Add Patient form
const AddPatientForm = ({ onCancel }) => {
    // State for form fields
    const [patientData, setPatientData] = useState({
        firstName: '',
        lastName: '',
        phoneNo: '',
        email: '',
        password: '',
        // Add more fields as needed
    });

    // Function to handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form submission, for now, let's log the data
        console.log('Submitted data:', patientData);
        // You can add logic to send data to the backend here
        // Reset form fields
        setPatientData({
            firstName: '',
            lastName: '',
            phoneNo: '',
            email: '',
            password: '',
            // Reset other fields as needed
        });
        // Close the form
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input type="text" name="firstName" value={patientData.firstName} onChange={handleChange} required />
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" name="lastName" value={patientData.lastName} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="text" name="phoneNo" value={patientData.phoneNo} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={patientData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={patientData.password} onChange={handleChange} required />
            </div>
            {/* Add more fields as needed */}
            <button type="submit" className='add-admin-button'>Add Patient</button>
        </form>
    );
};

const AdminPatient = () => {
    // Dummy patient data
    const patients = [
        {
            id: 1,
            patientId: 'PAT001',
            firstName: 'Alice',
            lastName: 'Johnson',
            phoneNo: 1234567890,
            email: 'alice@example.com',
            password: 'password123',
            role: 'ROLE_PATIENT',
            createdAt: '2022-01-01T00:00:00',
            otp: '1234'
            // Add more fields as needed
        },
        // Add more dummy patient objects as needed
    ];

    // State for search query and filtered patients
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState(patients);
    const [showAddPatientForm, setShowAddPatientForm] = useState(false);

    // Function to handle search
    const handleSearch = () => {
        const filtered = patients.filter(patient =>
            (patient.firstName.toLowerCase() + ' ' + patient.lastName.toLowerCase()).includes(searchQuery.toLowerCase())
        );
        setFilteredPatients(filtered);
    };

    // Function to handle adding a new patient
    const handleAddPatient = () => {
        setShowAddPatientForm(true);
    };

    // Function to handle canceling the add patient form
    const handleCancelAddPatient = () => {
        setShowAddPatientForm(false);
    };

    return (
        <div className='dashboard-container'>
            <Navbar />
            <div className='dashboard-content'>
                <SideNavbar />
                <div className='main-content'>
                    <div className="admin-search-container">
                        <input
                            type="text"
                            className="admin-search-bar" // Apply class name
                            placeholder="Search by patient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="admin-search-button" // Apply class name
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                    <br/>
                    <h2>Patients</h2>
                    <div className="table-responsive custom-box">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Patient ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th>OTP</th>
                                    {/* Add more columns as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map(patient => (
                                    <tr key={patient.id}>
                                        <td>{patient.id}</td>
                                        <td>{patient.patientId}</td>
                                        <td>{patient.firstName}</td>
                                        <td>{patient.lastName}</td>
                                        <td>{patient.phoneNo}</td>
                                        <td>{patient.email}</td>
                                        <td>{patient.password}</td>
                                        <td>{patient.role}</td>
                                        <td>{patient.createdAt}</td>
                                        <td>{patient.otp}</td>
                                        {/* Add more columns as needed */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showAddPatientForm ? (
                            <div>
                                <AddPatientForm onCancel={handleCancelAddPatient} />
                            </div>
                        ) : (
                            <button className='add-admin-button' onClick={handleAddPatient}>Add Patient</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPatient;
