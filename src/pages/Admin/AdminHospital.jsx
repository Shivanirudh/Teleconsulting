import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Admin/searchbar.css';
import config from '../../Config';

const AdminHospital = () => {
    const [hospitals, setHospitals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHospitals, setFilteredHospitals] = useState([]);
    const [showAddHospitalForm, setShowAddHospitalForm] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchHospitals(storedToken);
    }, []);

    const fetchHospitals = async (token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${config.apiUrl}/api/v1/admin/hospitals`, { headers });
            setHospitals(response.data);
            setFilteredHospitals(response.data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const handleSearch = () => {
        const filtered = hospitals.filter(hospital =>
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredHospitals(filtered);
    };

    const handleAddHospital = () => {
        setShowAddHospitalForm(true);
    };

    const handleCancelAddHospital = () => {
        setShowAddHospitalForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newHospitalData = {
            name: formData.get('name'),
            address: formData.get('address'),
            phone_number: formData.get('phone_number'),
            email: formData.get('email')
        };

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            await axios.post(`${config.apiUrl}/api/v1/admin/hospital`, JSON.stringify(newHospitalData), { headers });
            setShowAddHospitalForm(false);
            fetchHospitals(token);
        } catch (error) {
            console.error('Error adding hospital:', error);
        }
    };

    const blockHospital = async (hospitalId) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                
            };
            await axios.put(`${config.apiUrl}/api/v1/admin/block-hospital`, hospitalId, { headers });
            alert(`Hospital with ${hospitalId} ID is blocked successfully`);
            fetchHospitals(token);
        } catch (error) {
            console.error('Error blocking hospital:', error);
        }
    };

    const unblockHospital = async (hospitalId) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            await axios.put(`${config.apiUrl}/api/v1/admin/unblock-hospital`, hospitalId, { headers });
            alert(`Hospital with ${hospitalId} ID is unblocked successfully`);
            fetchHospitals(token);
        } catch (error) {
            console.error('Error unblocking hospital:', error);
        }
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
                            className="admin-search-bar"
                            placeholder="Search by hospital..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="admin-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                    <br />
                    <h2>Hospitals</h2>
                    <div className="table-responsive custom-box">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Hospital ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Block</th>
                                    <th>Unblock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHospitals.map(hospital => (
                                    <tr key={hospital.hospital_id}>
                                        <td>{hospital.hospital_id}</td>
                                        <td>{hospital.name}</td>
                                        <td>{hospital.address}</td>
                                        <td>{hospital.phone_number}</td>
                                        <td>{hospital.email}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => blockHospital(hospital.hospital_id)}>Block</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => unblockHospital(hospital.hospital_id)}>Unblock</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showAddHospitalForm ? (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Name:</label>
                                    <input type="text" name="name" required />
                                </div>
                                <div>
                                    <label>Address:</label>
                                    <input type="text" name="address" required />
                                </div>
                                <div>
                                    <label>Phone Number:</label>
                                    <input type="tel" name="phone_number" required />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input type="text" name="email" required />
                                </div>
                                <button type="submit">Add Hospital</button> &nbsp;
                                <button type="button" onClick={handleCancelAddHospital}>Cancel</button>
                            </form>
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
