import React from 'react';
import './../../css/footer.css'; // You can define your styles in a separate CSS file

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <p>&copy; 2024 E-Consultation. All rights reserved.</p>
      </div>
      <div className="footer-right">
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
        <p>Trademark E-Consultation™</p>
      </div>
    </footer>
  );
}

export default Footer;
