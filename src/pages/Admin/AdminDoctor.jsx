import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Admin/searchbar.css'; // Import CSS file

// Separate component for the Add Doctor form
const AddDoctorForm = ({ onCancel }) => {
    // State for form fields
    const [doctorData, setDoctorData] = useState({
        firstName: '',
        lastName: '',
        specialty: '',
        phoneNo: '',
        email: '',
        password: '',
        // Add more fields as needed
    });

    // Function to handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form submission, for now, let's log the data
        console.log('Submitted data:', doctorData);
        // You can add logic to send data to the backend here
        // Reset form fields
        setDoctorData({
            firstName: '',
            lastName: '',
            specialty: '',
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
                <input type="text" name="firstName" value={doctorData.firstName} onChange={handleChange} required />
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" name="lastName" value={doctorData.lastName} onChange={handleChange} required />
            </div>
            <div>
                <label>Specialty:</label>
                <input type="text" name="specialty" value={doctorData.specialty} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="text" name="phoneNo" value={doctorData.phoneNo} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={doctorData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={doctorData.password} onChange={handleChange} required />
            </div>
            {/* Add more fields as needed */}
            <button type="submit" className='add-admin-button'>Add Doctor</button>
        </form>
    );
};

const AdminDoctor = () => {
    // Dummy doctor data
    const doctors = [
        {
            id: 1,
            doctorId: 'DOC001',
            firstName: 'John',
            lastName: 'Doe',
            specialty: 'Cardiology',
            phoneNo: 1234567890,
            email: 'john@example.com',
            password: 'password123',
            role: 'ROLE_DOCTOR',
            createdAt: '2022-01-01T00:00:00',
            // Add more fields as needed
        },
        // Add more dummy doctor objects as needed
    ];

    // State for search query and filtered doctors
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState(doctors);
    const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);

    // Function to handle search
    const handleSearch = () => {
        const filtered = doctors.filter(doctor =>
            (doctor.firstName.toLowerCase() + ' ' + doctor.lastName.toLowerCase()).includes(searchQuery.toLowerCase())
        );
        setFilteredDoctors(filtered);
    };

    // Function to handle adding a new doctor
    const handleAddDoctor = () => {
        setShowAddDoctorForm(true);
    };

    // Function to handle canceling the add doctor form
    const handleCancelAddDoctor = () => {
        setShowAddDoctorForm(false);
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
                            placeholder="Search by doctor..."
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
                    <h2>Doctors</h2>
                    <div className="table-responsive custom-box">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Doctor ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Specialty</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    {/* Add more columns as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td>{doctor.id}</td>
                                        <td>{doctor.doctorId}</td>
                                        <td>{doctor.firstName}</td>
                                        <td>{doctor.lastName}</td>
                                        <td>{doctor.specialty}</td>
                                        <td>{doctor.phoneNo}</td>
                                        <td>{doctor.email}</td>
                                        <td>{doctor.password}</td>
                                        <td>{doctor.role}</td>
                                        <td>{doctor.createdAt}</td>
                                        {/* Add more columns as needed */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showAddDoctorForm ? (
                            <div>
                                <AddDoctorForm onCancel={handleCancelAddDoctor} />
                            </div>
                        ) : (
                            <button className='add-admin-button' onClick={handleAddDoctor}>Add Doctor</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDoctor;
