import React from 'react';
import '../styles/Scholarship.css';

function Scholarship() {
  return (
    <>
      <section className="scholarship-header">
        <h1>Scholarship & Financial Aid</h1>
        <p className="para">Supporting students in achieving academic excellence with financial assistance</p>
      </section>

      <section className="scholarship-container">
        <div className="scholarship-card">
          <h2>B.A. Scholarship</h2>
          <ul>
            <li>Merit-based scholarships for students scoring 75% and above in 12th Board exams.</li>
            <li>Special scholarships for students from economically weaker sections.</li>
            <li>Government-approved financial aid schemes applicable.</li>
          </ul>
        </div>

        <div className="scholarship-card">
          <h2>B.Sc. Scholarship</h2>
          <ul>
            <li>Performance-based scholarships for Science stream toppers.</li>
            <li>Scholarships for Girl students to encourage higher education.</li>
            <li>Need-based financial support available on request.</li>
          </ul>
        </div>

        <div className="scholarship-card">
          <h2>B.Ed. Scholarship</h2>
          <ul>
            <li>Scholarships for candidates with outstanding academic records.</li>
            <li>Reserved category (SC/ST/OBC) students eligible for government-funded aid.</li>
            <li>Fee concessions for students with financial difficulties.</li>
          </ul>
        </div>
      </section>

      <section className="financial-info">
        <h2>General Financial Aid Information</h2>
        <p>Sw. Narendra Singh Mahavidyalaya is committed to ensuring that no deserving student is deprived of education due
          to financial challenges. Students can apply for state and central government schemes, and our administration
          provides guidance in completing the application process for loans, scholarships, and concessions.</p>
      </section>

      <div className="container">
        <h2>Scholarships and Financial Aid</h2>
        <div className="divider"><i className="fas fa-leaf"></i></div>

        <div className="scholarship-buttons">
          <a href="https://scholarship.up.gov.in/" target="_blank" rel="noopener noreferrer" className="up-scholarship">
            UP Scholarship - Government of Uttar Pradesh
          </a>

          <a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer" className="nsp-scholarship">
            National Scholarship Portal (NSP)
          </a>
        </div>
      </div>

      <section className="requirements">
        <h2>Scholarship Requirements</h2>
        <ul>
          <li>Aadhaar Card</li>
          <li>Email ID</li>
          <li>Income Certificate</li>
          <li>Caste Certificate</li>
          <li>Bank Account linked with Aadhaar</li>
          <li>Passport Size Photograph</li>
          <li>Academic Marksheet</li>
          <li>College Fee Receipt</li>
        </ul>
      </section>
    </>
  );
}

export default Scholarship;