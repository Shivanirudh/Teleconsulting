import React from 'react';
import './../css/footer.css'; // You can define your styles in a separate CSS file

function Footer() {
  return (
    <footer className="main-footer-container">
      <div className="footer-left">
        <p>&copy; 2024 E-Consultation. All rights reserved. Trademark E-Consultation™</p>
      </div>
      <div className="footer-right">
        <a href="/">Home</a>
        <a href="/aboutus">About Us</a>
        <a href="/contactus">Contact Us</a>
      </div>
    </footer>
  );
}

export default Footer;
