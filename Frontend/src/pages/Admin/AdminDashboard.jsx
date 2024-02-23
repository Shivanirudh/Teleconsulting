import React from 'react';
import Navbar from '../../components/Admin/Navbar';
import SideNavbar from '../../components/Admin/sidenavbar';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AdminDashboard = () => {
    // Dummy data for demonstration
    const totalPatients = 1000;
    const totalDoctors = 50;
    const patientIncrease = 20; // Assume 20 new patients
    const doctorIncrease = 2; // Assume 2 new doctors

    return (
        <div>
            <Navbar />
            <SideNavbar />
            <div style={{ marginLeft: '250px', marginTop: '56px' }}>
                <Container fluid>
                    <Row className="mt-4">
                        <Col md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <i className="bi bi-person-fill" style={{ fontSize: '2.5em' }}></i>
                                    <h5>Total Patients</h5>
                                    <h2>{totalPatients}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <i className="bi bi-person-circle" style={{ fontSize: '2.5em' }}></i>
                                    <h5>New Patients (Today)</h5>
                                    <h2>+{patientIncrease}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <i className="bi bi-person-check-fill" style={{ fontSize: '2.5em' }}></i>
                                    <h5>Total Doctors</h5>
                                    <h2>{totalDoctors}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card>
                                <Card.Body>
                                    <i className="bi bi-person-plus-fill" style={{ fontSize: '2.5em' }}></i>
                                    <h5>New Doctors (Today)</h5>
                                    <h2>+{doctorIncrease}</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {/* Add charts and additional components here */}
                </Container>
            </div>
        </div>
    );
};

export default AdminDashboard;
