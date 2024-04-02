import React from 'react';
import Footer from './../components/Footer';
import Header from '../components/Header.jsx';

const ContactUs = () => {
    // Inline CSS styles
    const containerStyle = {
        width: '80%',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'rgba(61, 63, 70, 0.7)', // Background color with opacity
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '80vh',
        overflowY: 'auto',
        color: 'white', // Text color set to white
    };

    const headerStyle = {
        textAlign: 'center',
    };

    const listStyle = {
        listStyleType: 'none',
        paddingLeft: '0',
    };

    const listItemStyle = {
        marginBottom: '10px',
    };

    // Testimonials with fixed number of stars
    const testimonials = [
        {
            name: 'John Doe',
            stars: 4,
            numReviews: 10,
            comment: 'Great service! Quick response and helpful staff.',
            imageUrl: '', // Will be filled later
        },
        {
            name: 'Jane Smith',
            stars: 5,
            numReviews: 15,
            comment: 'I highly recommend this consultation service. Very professional and informative.',
            imageUrl: '', // Will be filled later
        },
        {
            name: 'Chris Johnson',
            stars: 3,
            numReviews: 8,
            comment: 'The team at econsultation went above and beyond to assist me with my queries. Thank you!',
            imageUrl: '', // Will be filled later
        },
    ];

    // Random image URLs from Google Images
    const randomImageUrls = [
        'https://www.gstatic.com/webp/gallery/1.jpg',
        'https://www.gstatic.com/webp/gallery/2.jpg',
        'https://www.gstatic.com/webp/gallery/3.jpg',
    ];

    // Function to get a random image URL
    const getRandomImageUrl = () => {
        const usedIndexes = [];
        while (usedIndexes.length < testimonials.length) {
            const randomIndex = Math.floor(Math.random() * randomImageUrls.length);
            if (!usedIndexes.includes(randomIndex)) {
                usedIndexes.push(randomIndex);
            }
        }
        return usedIndexes.map(index => randomImageUrls[index]);
    };

    // Assign random profile picture URLs to testimonials
    const randomImageUrlsForTestimonials = getRandomImageUrl();
    testimonials.forEach((testimonial, index) => {
        testimonial.imageUrl = randomImageUrlsForTestimonials[index];
    });

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div className="content-container" style={containerStyle}>
                <h2 style={headerStyle}>Contact Information</h2>
                <p>If you have any questions, concerns, or feedback, please feel free to reach out to us:</p>
                <ul style={listStyle}>
                    <li style={listItemStyle}>Email: contact@econsultation.com</li>
                    <li style={listItemStyle}>Phone: +1234567890</li>
                    <li style={listItemStyle}>Address: 123 Consultation St, Telehealth City, 54321</li>
                    <li style={listItemStyle}>Twitter: @econsult</li>
                    <li style={listItemStyle}>Facebook: facebook.com/econsultation</li>
                    <li style={listItemStyle}>Instagram: @econsult_official</li>
                </ul>
                <p style={{ marginTop: '20px' }}>We're available to assist you during our business hours, Monday through Friday, 9:00 AM to 5:00 PM.</p>

                {/* Testimonials */}
                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Testimonials</h3>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} style={{ marginBottom: '20px', border: '1px solid white', borderRadius: '8px', padding: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <img src={testimonial.imageUrl} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }} />
                                <div>
                                    <p style={{ margin: '0', fontWeight: 'bold' }}>{testimonial.name}</p>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <p style={{ margin: '0', fontSize: '0.9em', marginRight: '5px' }}>{'★'.repeat(testimonial.stars)}</p>
                                        <p style={{ margin: '0', fontSize: '0.9em' }}>({testimonial.numReviews} reviews)</p>
                                    </div>
                                </div>
                            </div>
                            <p>{testimonial.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
