import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';

const AdminPatient = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        // Fetch patients data from the backend when the component mounts
        const fetchPatients = async () => {
            try {
                // Retrieve token from local storage
                const token = localStorage.getItem('token');

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

        fetchPatients();
    }, []);

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
