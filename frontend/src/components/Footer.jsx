// src/components/Footer.jsx
import React from 'react'
import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand-section">
            <div className="footer-brand">MicroStartupX</div>
            <p className="footer-tagline">
              Empowering the next generation of visionary founders and elite investors in Tamil Nadu and beyond.
            </p>
            <div className="footer-socials">
              <span className="social-icon">𝕏</span>
              <span className="social-icon">in</span>
              <span className="social-icon">ig</span>
            </div>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Platform</h4>
              <span>Browse Ideas</span>
              <span>For Investors</span>
              <span>For Developers</span>
              <span>Success Stories</span>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <span>About Us</span>
              <span>Careers</span>
              <span>Press Kit</span>
              <span>Contact</span>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
              <span>NDA Templates</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 MicroStartupX. All rights reserved. Built with ❤️ in Tamil Nadu.</div>
          <div className="footer-status">
            <span className="status-dot"></span> System Operational
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
