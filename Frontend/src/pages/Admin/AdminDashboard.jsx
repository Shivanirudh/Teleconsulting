import React from 'react';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles
import './../../css/Admin/AdminDashboard.css'


const AdminDashboard = () => {
    // Dummy data for demonstration
    const totalPatients = 5;
    const totalDoctors = 8;
    const doctorIncrease = 9; // Assume 2 new doctors

    return (
        <div className='dashboard-container'>
            <Navbar />
            <div className='dashboard-content'  >
            <SideNavbar />
            
            <div className='main-content'>
                <h1>Welcome Vishnu Raj</h1>
                <Container fluid style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', color: '#333',opacity:'0.8' }}>
                    <Row className="mt-4">
                        <Col md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <i className="bi bi-person-fill" style={{ fontSize: '2.5em', color: '#007bff' }}></i>
                                    <h5>Total Patients</h5>
                                    <h2>{totalPatients}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <i className="bi bi-person-check-fill" style={{ fontSize: '2.5em', color: '#dc3545' }}></i>
                                    <h5>Total Doctors</h5>
                                    <h2>{totalDoctors}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <i className="bi bi-person-plus-fill" style={{ fontSize: '2.5em', color: '#ffc107' }}></i>
                                    <h5>Total Hospitals (Today)</h5>
                                    <h2>{doctorIncrease}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                   
                </Container>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;
