import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';

const AdminDoctor = () => {
    const [doctors, setDoctors] = useState([]);

    const fetchDoctors = async () => {
        try {
            // Retrieve token from local storage
            const token = localStorage.getItem('token');

            // Set up headers with the token
            const headers = {
                Authorization: `Bearer ${token}`
            };

            // Make request with headers
            const response = await axios.get('http://localhost:8081/api/v1/admin/doctors', { headers });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        // Fetch doctors data from the backend when the component mounts
        fetchDoctors();
    }, []);

    const blockDoctor = async (doctorId) => {
        try {
            // Retrieve token from local storage
            const token = localStorage.getItem('token');

            // Set up headers with the token
            const headers = {
                Authorization: `Bearer ${token}`
            };

            // Make request to block doctor
            await axios.put(`http://localhost:8081/api/v1/admin/block-doctor`, doctorId , { headers });

            // Optionally, you can refresh the doctors data after blocking
            fetchDoctors();
        } catch (error) {
            console.error('Error blocking doctor:', error);
        }
    };

    const unblockDoctor = async (doctorId) => {
        try {
            // Retrieve token from local storage
            const token = localStorage.getItem('token');

            // Set up headers with the token
            const headers = {
                Authorization: `Bearer ${token}`
            };

            // Make request to unblock doctor
            await axios.put(`http://localhost:8081/api/v1/admin/unblock-doctor`,  doctorId , { headers });

            // Optionally, you can refresh the doctors data after unblocking
            fetchDoctors();
        } catch (error) {
            console.error('Error unblocking doctor:', error);
        }
    };

    return (
        <div className='dashboard-container'>
            <Navbar />
            <div className='dashboard-content'>
                <SideNavbar />
                <div className='main-content'>
                    <h2>Doctors</h2>
                    <div className="table-responsive custom-box">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Doctor ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Specialization</th>
                                    <th>Hospital</th>
                                    <th>Block</th>
                                    <th>Unblock</th>
                                    {/* Add more columns as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doctor => (
                                    <tr key={doctor.doctor_id}>
                                        <td>{doctor.doctor_id}</td>
                                        <td>{doctor.first_name}</td>
                                        <td>{doctor.last_name}</td>
                                        <td>{doctor.phone_number}</td>
                                        <td>{doctor.email}</td>
                                        <td>{doctor.role}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>{doctor.hospital.name}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => blockDoctor(doctor.doctor_id)}>Block</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => unblockDoctor(doctor.doctor_id)}>Unblock</button>
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

export default AdminDoctor;
