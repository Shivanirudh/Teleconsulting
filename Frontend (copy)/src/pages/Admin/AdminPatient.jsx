import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';

const AdminPatient = () => {
    const [patients, setPatients] = useState([]);
    const [token, setToken] = useState('');

    useEffect(() => {
        // Fetch token from local storage when component mounts
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        
        // Fetch patients data from the backend when the component mounts
        fetchPatients(storedToken);
    }, []);

    const fetchPatients = async (token) => {
        try {
            // Set up headers with the token
            const headers = {
                Authorization: `Bearer ${token}`
            };

            // Make request with headers
            const response = await axios.get('http://localhost:8081/api/v1/admin/patients', { headers });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const blockPatient = async (patientId) => {
        try {
            // Set up headers with the token
            const headers = {
                Authorization: `Bearer ${token}`
            };

            // Make request to block patient
            await axios.put(`http://localhost:8081/api/v1/admin/block-patient`, patientId, { headers });

            // Optionally, you can refresh the patients data after blocking
            fetchPatients(token);
        } catch (error) {
            console.error('Error blocking patient:', error);
        }
    };

    const unblockPatient = async (patientId) => {
        try {
            // Set up headers with the token
            const headers = {
                Authorization: `Bearer ${token}`
            };

            // Make request to unblock patient
            await axios.put(`http://localhost:8081/api/v1/admin/unblock-patient`, patientId, { headers });

            // Optionally, you can refresh the patients data after unblocking
            fetchPatients(token);
        } catch (error) {
            console.error('Error unblocking patient:', error);
        }
    };

    return (
        <div className='dashboard-container'>
            <Navbar />
            <div className='dashboard-content'>
                <SideNavbar />
                <div className='main-content'>
                    <h2>Patients</h2>
                    <div className="table-responsive custom-box">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Patient ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Blood Type</th>
                                    <th>DOB</th>
                                    <th>Height</th>
                                    <th>Weight</th>
                                    <th>Block</th>
                                    <th>Unblock</th>
                                    {/* Add more columns as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(patient => (
                                    <tr key={patient.patient_id}>
                                        <td>{patient.patient_id}</td>
                                        <td>{patient.first_name}</td>
                                        <td>{patient.last_name}</td>
                                        <td>{patient.phone_number}</td>
                                        <td>{patient.email}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.blood_type}</td>
                                        <td>{patient.dob.filter((_, index) => index < 3).join('-')}</td>
                                        <td>{patient.height}</td>
                                        <td>{patient.weight}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => blockPatient(patient.patient_id)}>Block</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => unblockPatient(patient.patient_id)}>Unblock</button>
                                        </td>
                                        {/* Add more columns as needed */}
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

export default AdminPatient;
