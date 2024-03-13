import React from 'react';
import Navbar from '../../components (1)/Admin/Navbar';
import SideNavbar from '../../components (1)/Admin/sidenavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDoctor = () => {
    // Dummy doctor data
    const doctors = [
        {
            id: 1,
            doctorId: 'DOC001',
            firstName: 'John',
            lastName: 'Doe',
            phoneNo: 1234567890,
            email: 'john@example.com',
            password: 'password123',
            createdAt: '2022-01-01T00:00:00',
            otp: '1234'
            // Add more fields as needed
        },
        {
            id: 2,
            doctorId: 'DOC002',
            firstName: 'Jane',
            lastName: 'Smith',
            phoneNo: 9876543210,
            email: 'jane@example.com',
            password: 'password456',
            createdAt: '2022-01-02T00:00:00',
            otp: '5678'
            // Add more fields as needed
        },
        // Add more dummy doctor objects as needed
    ];

    return (
        <div>
            <Navbar />
            <SideNavbar />
            <div style={{ marginLeft: '250px', paddingTop: '20px' }}>
                <h2>Doctors</h2>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Doctor ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Created At</th>
                                <th>OTP</th>
                                {/* Add more columns as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doctor => (
                                <tr key={doctor.id}>
                                    <td>{doctor.id}</td>
                                    <td>{doctor.doctorId}</td>
                                    <td>{doctor.firstName}</td>
                                    <td>{doctor.lastName}</td>
                                    <td>{doctor.phoneNo}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.password}</td>
                                    <td>{doctor.createdAt}</td>
                                    <td>{doctor.otp}</td>
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

export default AdminDoctor;
