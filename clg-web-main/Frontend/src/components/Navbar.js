import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admissionOpen, setAdmissionOpen] = useState(false);

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
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>

        {/* Dropdown */}
        <li className="dropdown">
          <a href="/" onClick={(e) => {
              e.preventDefault();
              setAdmissionOpen(!admissionOpen);
            }}>Admission▾</a>
          <ul className={`dropdown-menu ${admissionOpen ? "show" : ""}`}>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/eligibility">Eligibility</Link></li>
            <li><Link to="/admissionprocess">Admission Process</Link></li>
            <li><Link to="/admissionquery">Admission Query</Link></li>
            <li><Link to="/scholarship">Scholarship</Link></li>
            <li><Link to="/ncc">NCC</Link></li>
          </ul>
        </li>

        <li><Link to="/free-courses">Free Courses</Link></li>
        <li><Link to="/faculty">Faculty</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/login" className="auth-btn login-btn">Login</Link></li>
        <li><Link to="/signup" className="auth-btn signup-btn">Sign Up</Link></li>
      </ul>
    </nav>
    </>
  );
};

export default Navbar;
