import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Admin/searchbar.css';

const AdminHospital = () => {
    const [hospitals, setHospitals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHospitals, setFilteredHospitals] = useState([]);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get('http://localhost:8081/api/v1/admin/hospitals', { headers });
            setHospitals(response.data);
            setFilteredHospitals(response.data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const blockHospital = async (hospitalId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };
            await axios.put(`http://localhost:8081/api/v1/admin/block-hospital`, hospitalId , { headers });
            fetchHospitals();
        } catch (error) {
            console.error('Error blocking hospital:', error);
        }
    };

    const unblockHospital = async (hospitalId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };
            await axios.put(`http://localhost:8081/api/v1/admin/unblock-hospital`, hospitalId , { headers });
            fetchHospitals();
        } catch (error) {
            console.error('Error unblocking hospital:', error);
        }
    };

    const handleSearch = () => {
        const filtered = hospitals.filter(hospital =>
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredHospitals(filtered);
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHospital;
