import React from 'react';
import Footer from './../components/Footer';
import Header from '../components/Header.jsx';

const ContactUs = () => {
    return (
        <div>
            <Header/>
            <div className="content-container">
                <h2>Contact Information</h2>
                <p>If you have any questions, concerns, or feedback, please feel free to reach out to us:</p>
                <ul>
                    <li>Email: contact@econsultation.com</li>
                    <li>Phone: +1234567890</li>
                    <li>Address: 123 Consultation St, Telehealth City, 54321</li>
                </ul>
                <p>We're available to assist you during our business hours, Monday through Friday, 9:00 AM to 5:00 PM.</p>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
