import React from 'react';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';

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
        {
            id: 2,
            patientId: 'PAT002',
            firstName: 'Bob',
            lastName: 'Smith',
            phoneNo: 9876543210,
            email: 'bob@example.com',
            password: 'password456',
            role: 'ROLE_PATIENT',
            createdAt: '2022-01-02T00:00:00',
            otp: '5678'
            // Add more fields as needed
        },
        // Add more dummy patient objects as needed
    ];

    return (
        <div style={{ position: 'relative' }}>
            <Navbar />
            <SideNavbar />
            <div style={{ marginLeft: '250px', paddingTop: '20px' }}>
                <h2>Patients</h2>
                <div className="table-responsive">
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
                            {patients.map(patient => (
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
                </div>
            </div>
        </div>
    );
};

export default AdminPatient;
