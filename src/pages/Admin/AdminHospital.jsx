import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Admin/searchbar.css'; // Import CSS file

// Separate component for the Add Hospital form
const AddHospitalForm = ({ onCancel }) => {
    // State for form fields
    const [hospitalData, setHospitalData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        // Add more fields as needed
    });

    // Function to handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospitalData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form submission, for now, let's log the data
        console.log('Submitted data:', hospitalData);
        // You can add logic to send data to the backend here
        // Reset form fields
        setHospitalData({
            name: '',
            address: '',
            phoneNumber: '',
            email: '',
            // Reset other fields as needed
        });
        // Close the form
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={hospitalData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={hospitalData.address} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="text" name="phoneNumber" value={hospitalData.phoneNumber} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={hospitalData.email} onChange={handleChange} required />
            </div>
            {/* Add more fields as needed */}
            <button type="submit" className='add-admin-button'>Add Hospital</button>
        </form>
    );
};

const AdminHospital = () => {
    // Dummy hospital data
    const hospitals = [
        {
            id: 1,
            hospitalId: 'HOSP001',
            name: 'ABC Hospital',
            address: '123 Main St',
            phoneNumber: '1234567890',
            email: 'abc@example.com',
            // Add more fields as needed
        },
        // Add more dummy hospital objects as needed
    ];

    // State for search query and filtered hospitals
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
    const [showAddHospitalForm, setShowAddHospitalForm] = useState(false);

    // Function to handle search
    const handleSearch = () => {
        const filtered = hospitals.filter(hospital =>
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredHospitals(filtered);
    };

    // Function to handle adding a new hospital
    const handleAddHospital = () => {
        setShowAddHospitalForm(true);
    };

    // Function to handle canceling the add hospital form
    const handleCancelAddHospital = () => {
        setShowAddHospitalForm(false);
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
                            placeholder="Search by hospital..."
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
                    <h2>Hospitals</h2>
                    <div className="table-responsive custom-box">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Hospital ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    {/* Add more columns as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHospitals.map(hospital => (
                                    <tr key={hospital.id}>
                                        <td>{hospital.id}</td>
                                        <td>{hospital.hospitalId}</td>
                                        <td>{hospital.name}</td>
                                        <td>{hospital.address}</td>
                                        <td>{hospital.phoneNumber}</td>
                                        <td>{hospital.email}</td>
                                        {/* Add more columns as needed */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showAddHospitalForm ? (
                            <div>
                                <AddHospitalForm onCancel={handleCancelAddHospital} />
                            </div>
                        ) : (
                            <button className='add-admin-button' onClick={handleAddHospital}>Add Hospital</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHospital;
