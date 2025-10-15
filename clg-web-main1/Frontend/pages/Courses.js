import React from 'react';
import '../styles/courses.css';

function Courses() {
  return (
    <main className="courses-container1">
      <div className='page-title1'>
        <h1 className="page-title2">Our Courses</h1>
        <p className="intro-text">At Sw. Narendra Singh Mahavidyalaya, we offer quality education through well-structured
          undergraduate programs that prepare students for academic excellence and professional success.</p>
      </div>
      <div className="courses-grid">
        {/* BA Course */}
        <section className="course-card">
          <div className="course-content">
            <h2>Bachelor of Arts (B.A.)</h2>
            <p>The BA program provides a strong foundation in humanities and social sciences. Students can specialize in
              subjects such as Hindi, English, History, Political Science, and more.</p>
            <ul>
              <li>Duration: 3 Years</li>
              <li>Eligibility: 10+2 Passed (Any Stream)</li>
              <li>Career Options: Civil Services, Journalism, Teaching, Social Work</li>
            </ul>
          </div>
        </section>

        {/* B.Sc Course */}
        <section className="course-card">
          <div className="course-content">
            <h2>Bachelor of Science (B.Sc.)</h2>
            <p>The B.Sc program focuses on building strong analytical and problem-solving skills in subjects like Physics,
              Chemistry, Mathematics, and Biology.</p>
            <ul>
              <li>Duration: 3 Years</li>
              <li>Eligibility: 10+2 Passed (Science Stream)</li>
              <li>Career Options: Research, IT Sector, Laboratory Technician, Higher Studies (M.Sc, MCA)</li>
            </ul>
          </div>
        </section>

        {/* B.Ed Course */}
        <section className="course-card">
          <div className="course-content">
            <h2>Bachelor of Education (B.Ed.)</h2>
            <p>The B.Ed program prepares students to become professional teachers with modern teaching methodologies,
              pedagogy, and classroom management skills.</p>
            <ul>
              <li>Duration: 2 Years</li>
              <li>Eligibility: Graduation with minimum 50% marks</li>
              <li>Career Options: Teaching in Schools, Coaching Institutes, Education Sector Jobs</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Highlights */}
      <section className="course-highlights">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Experienced and qualified faculty members</li>
          <li>Modern classrooms with digital learning support</li>
          <li>Scholarships for meritorious students</li>
          <li>Career guidance and placement support</li>
        </ul>
      </section>
    </main>
  );
}

export default Courses;
