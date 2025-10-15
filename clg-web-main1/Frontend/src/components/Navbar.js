import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setAdmissionOpen(false);
  }, [location]);

  return (
    <>
      <nav className="navbar">
        {/* Logo & Title */}
        <div className="logo-title">
          <img src={Logo} alt="College Logo" />
          <span>Sw. Narendra Singh Mahavidyalaya</span>
        </div>

        {/* Hamburger for mobile */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menu */}
        <ul className={`menu ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>

          {/* Dropdown */}
          <li className="dropdown">
            <a href="/" onClick={(e) => {
              e.preventDefault();
              setAdmissionOpen(!admissionOpen);
            }}>Admission▾</a>
            <ul className={`dropdown-menu ${admissionOpen ? "show" : ""}`}>
              <li><Link to="/courses" onClick={() => { setMenuOpen(false); setAdmissionOpen(false); }}>Courses</Link></li>
              <li><Link to="/eligibility" onClick={() => { setMenuOpen(false); setAdmissionOpen(false); }}>Eligibility</Link></li>
              <li><Link to="/admissionprocess" onClick={() => { setMenuOpen(false); setAdmissionOpen(false); }}>Admission Process</Link></li>
              <li><Link to="/admissionquery" onClick={() => { setMenuOpen(false); setAdmissionOpen(false); }}>Admission Query</Link></li>
              <li><Link to="/scholarship" onClick={() => { setMenuOpen(false); setAdmissionOpen(false); }}>Scholarship</Link></li>
              <li><Link to="/ncc" onClick={() => { setMenuOpen(false); setAdmissionOpen(false); }}>NCC</Link></li>
            </ul>
          </li>

          <li><Link to="/free-courses" onClick={() => setMenuOpen(false)}>Free Courses</Link></li>
          <li><Link to="/faculty" onClick={() => setMenuOpen(false)}>Faculty</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/login" className="auth-btn login-btn" onClick={() => setMenuOpen(false)}>Login</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;