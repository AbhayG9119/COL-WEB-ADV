import React from 'react';
import '../styles/AdmissionProcess.css';

function AdmissionProcess() {
  return (
    <>

      <section className="admission-section">
        <div  className="admission-section2">
          <h2>Admission Process</h2>
          <p>Follow these simple steps to secure admission in our institution. Each step ensures a smooth and transparent
            process for all applicants.</p>
        </div>
        <div className="process-container">

          <div className="process-card">
            <img src="/images/ca.webp" alt="Application" />
            <div className="process-content">
              <h3>Application</h3>
              <p>Eligible candidates can apply online or offline for B.A, B.Sc and B.Ed programs by filling out
                the form, submitting documents, and paying the fee.</p>
            </div>
          </div>

          <div className="process-card">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" alt="Shortlisting" />
            <div className="process-content">
              <h3>Shortlisting</h3>
              <p>Applicants are shortlisted based on academic performance, entrance exam scores, aptitude tests, and
                personal interviews.</p>
            </div>
          </div>

          <div className="process-card">
            <img src="/images/coun.jpg" alt="Counseling" />
            <div className="process-content">
              <h3>Counseling</h3>
              <p>Seat allotment for B.A, B.Sc and B.Ed programs is done through counseling for candidates with valid
                entrance scores.</p>
            </div>
          </div>

          <div className="process-card">
            <img src="/images/Document-verification.webp" alt="Document Verification" />
            <div className="process-content">
              <h3>Document Verification</h3>
              <p>Students must attend the registration process for physical document verification. Failure may result in
                cancellation of admission.</p>
            </div>
          </div>

        </div>
      </section>

    </>
  );
}

export default AdmissionProcess;
