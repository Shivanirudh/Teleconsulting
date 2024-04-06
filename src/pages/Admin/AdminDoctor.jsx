import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';

const AddDoctorForm = ({ onCancel, fetchDoctors }) => {
    const [doctorData, setDoctorData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        role: '',
        specialization: '',
        hospital_id: ''
    });
    const [hospitals, setHospitals] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/v1/admin/hospitals', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setHospitals(response.data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newDoctorData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            phone_number: formData.get('phone_number'),
            email: formData.get('email'),
            role: formData.get('role'),
            specialization: formData.get('specialization'),
            hospital: {
                hospital_id: formData.get('hospital_id')
            }
        };
        console.log(newDoctorData);
    
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            await axios.post('http://localhost:8081/api/v1/admin/doctor', JSON.stringify(newDoctorData), { headers });
            fetchDoctors(token);
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input type="text" name="first_name" value={doctorData.first_name} onChange={handleChange} required />
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" name="last_name" value={doctorData.last_name} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="tel" name="phone_number" value={doctorData.phone_number} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={doctorData.email} onChange={handleChange} required />
            </div>
            <div>
    <label>Role:</label>
    <select name="role" value={doctorData.role} onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="DOCTOR">Doctor</option>
        <option value="SENIORDOCTOR">Senior Doctor</option>
    </select>
</div>

            <div>
                <label>Hospital:</label>
                <select name="hospital_id" value={doctorData.hospital_id} onChange={handleChange} required>
                    <option value="">Select Hospital</option>
                    {hospitals.map(hospital => (
                        <option key={hospital.hospital_id} value={hospital.hospital_id}>{hospital.hospital_id}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Specialization:</label>
                <select name="specialization" value={doctorData.specialization} onChange={handleChange} required>
                    <option value="">Select Specialization</option>
                    <option value="CARDIOLOGIST">Cardiologist</option>
                    <option value="AUDIOLOGIST">Audiologist</option>
                    <option value="DENTIST">Dentist</option>
                    <option value="ENT SPECIALIST">ENT Specialist</option>
                    <option value="GYNECOLOGIST">Gynecologist</option>
                    <option value="ORTHOPEDIC SURGEON">Orthopedic Surgeon</option>
                    <option value="PAEDIATRICIAN">Paediatrician</option>
                    <option value="PSYCHIATRIST">Psychiatrist</option>
                    <option value="VETERINARIAN">Veterinarian</option>
                    <option value="RADIOLOGIST">Radiologist</option>
                    <option value="PULMONOLOGIST">Pulmonologist</option>
                    <option value="ENDOCRINOLOGIST">Endocrinologist</option>
                    <option value="ONCOLOGIST">Oncologist</option>
                    <option value="NEUROLOGIST">Neurologist</option>
                    <option value="CARDIOTHORACIC SURGEON">Cardiothoracic Surgeon</option>
                </select>
            </div>
            <button type="submit" className='add-admin-button'>Add Doctor</button>
        </form>
    );
};

const AdminDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/v1/admin/doctors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const blockDoctor = async (doctorId) => {
        try {
            await axios.put(`http://localhost:8081/api/v1/admin/block-doctor`, doctorId, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error blocking doctor:', error);
        }
    };

    const unblockDoctor = async (doctorId) => {
        try {
            await axios.put(`http://localhost:8081/api/v1/admin/unblock-doctor`, doctorId, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error unblocking doctor:', error);
        }
    };

    const handleSearch = () => {
        const filtered = doctors.filter(doctor =>
            doctor.first_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDoctors(filtered);
    };

    const handleAddDoctor = () => {
        setShowAddDoctorForm(true);
    };

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
                            className="admin-search-bar"
                            placeholder="Search by doctor..."
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
                    <br/>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showAddDoctorForm ? (
                            <div>
                                <AddDoctorForm onCancel={handleCancelAddDoctor} fetchDoctors={fetchDoctors} />
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
