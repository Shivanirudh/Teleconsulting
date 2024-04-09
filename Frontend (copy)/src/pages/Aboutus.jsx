import React from 'react';
import Footer from './../components/Footer';
import Header from '../components/Header';
import "./../css/Aboutus.css"

const AboutUs = () => {
    return (
        <div>
            <div className="about-container">
                <h2>About Us</h2>
                <p></p>
                <p>Welcome to our e-health teleconsulting platform! We are dedicated to providing convenient and accessible healthcare services to our users.</p>
                <p>Our team of experienced healthcare professionals is committed to delivering high-quality medical advice and consultations online.</p>
                <p>With our platform, you can connect with licensed doctors, therapists, and specialists from the comfort of your own home, ensuring you receive the care you need, when you need it.</p>
                <p>Whether you're seeking medical advice, therapy sessions, or specialist consultations, we're here to help you navigate your healthcare journey with ease.</p>
                <p>At our core, we believe in leveraging technology to improve healthcare accessibility and empower individuals to take control of their well-being.</p>
                <p>Thank you for choosing our platform for your healthcare needs. We look forward to serving you!</p>
            </div>
            <div className="about-video-container">
                <iframe
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/W-sI28Uzfck"
                    title="Embedded Video"
                    allowFullScreen
                ></iframe>
            </div>
            <Footer/>
        </div>
    );
};

export default AboutUs;
