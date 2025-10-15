import React from 'react';
import '../styles/eligibility.css';

function Eligibility() {
  return (
    <>
      {/* Navbar is assumed to be a separate component included in the app layout */}

      {/* Page Header */}
      <header className="eligibility-header">
        <h1>Eligibility Criteria</h1>
        <p>Find the detailed eligibility requirements for B.A., B.Sc., and B.Ed. programs</p>
      </header>

      {/* Course Eligibility Section */}
      <section className="eligibility-container">

        {/* BA */}
        <div className="eligibility-card">
          <h2>Bachelor of Arts (B.A.)</h2>
          <ul>
            <li>Candidate must have passed 10+2 (Intermediate) or equivalent from a recognized board.</li>
            <li>Minimum 45% marks in aggregate (40% for reserved category as per norms).</li>
            <li>Students from any stream (Arts/Science/Commerce) are eligible.</li>
            <li>Admission will be based on merit and availability of seats.</li>
          </ul>
        </div>

        {/* B.Sc */}
        <div className="eligibility-card">
          <h2>Bachelor of Science (B.Sc.)</h2>
          <ul>
            <li>Candidate must have passed 10+2 (Intermediate) with Science (PCM/PCB) from a recognized board.</li>
            <li>Minimum 45% marks in aggregate (40% for reserved category as per norms).</li>
            <li>Preference will be given to students with strong academic background in Science.</li>
            <li>Admission will be based on merit and availability of seats.</li>
          </ul>
        </div>

        {/* B.Ed */}
        <div className="eligibility-card">
          <h2>Bachelor of Education (B.Ed.)</h2>
          <ul>
            <li>Candidate must have completed a Bachelor's or Master's degree in any discipline from a recognized university.</li>
            <li>Minimum 50% marks in graduation/post-graduation (45% for reserved category as per norms).</li>
            <li>Admission process will follow NCTE and University guidelines.</li>
            <li>Selection may include entrance test or merit-based admission.</li>
          </ul>
        </div>

      </section>

  
    </>
  );
}

export default Eligibility;
