import React from 'react';
import { FaFacebookF, FaYoutube, FaInstagram, FaLinkedin, FaLocationDot, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa6';
import Logo from "../assets/Logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-col footer-branding">
            <div className="footer-logo-container">
              <img src={Logo}alt="College Logo" className="footer-logo" />
              <div className="logo-text">
                <h3>Sw. Narendra Singh Mahavidyalaya</h3>
                {/* <span className="college-type">Premier Educational Institution</span> */}
              </div>
            </div>
            <p className="tagline">Empowering minds, shaping futures through excellence in education.</p>
            
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
          <ul className="quick-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/free-courses">Free Courses</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          </div>

          <div className="footer-col contact-info">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <FaLocationDot />
              <div>
                <p className="ft-txt">Sw. Narendra Singh Mahavidyalaya</p>
                <p className="ft-txt">Gajner, Kanpur Dehat</p>
                <p className="ft-txt">Adjacent to Gajner Police Station</p>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone />
              <div>
                <a href="tel:+918851955753">+91 8851955753</a><br />
                <a href="tel:+918851955596">+91 8851955596</a>
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <div>
                <a href="mailto:snsmv25@gmail.com">snsmv25@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h3>Connect With Us</h3>
            <p className="ft-txt">Stay connected for latest updates and announcements.</p>
            <div className="social-link">
              <a href="https://www.facebook.com/Sw.NarendraSinghMahavidyalaya" className="social-icon facebook" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://youtube.com/@snsmv?si=lhWDf7UR4A5-b36l" className="social-icon youtube" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a href="https://www.instagram.com/swnarendrasinghmahavidyalaya?igsh=MXNuYjhtcmgwZTk0dg==" className="social-icon instagram" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/in/sw-narendra-singh-mahavidyalaya-83587a380?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BCMzBn0v%2FRyK%2FAKiaYT6PuQ%3D%3D" className="social-icon linkedin" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
            <div className="newsletter">
              <h4>Newsletter</h4>
              <div className="newsletter-input">
                <input type="email" placeholder="Enter your email address" />
                <button type="submit"><FaPaperPlane /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
