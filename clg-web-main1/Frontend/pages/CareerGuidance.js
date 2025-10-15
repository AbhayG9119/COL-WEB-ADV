import React from 'react';
import { FaUser, FaSearch, FaTools, FaBriefcase } from 'react-icons/fa';
import '../styles/career-guidance.css';

function CareerGuidance() {
  return (
    <main className="career-guidance-container">
      <div className="page-title">
        <h1>Career Guidance Course</h1>
        <p>Learn essential skills and knowledge to make informed career decisions, improve employability, and succeed professionally.</p>
      </div>

      {/* Self-Assessment */}
      <section className="level-section">
        <h2>Self-Assessment</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><FaUser /> Self-Assessment <span className="badge">Essential</span></h3>
            <ul>
              <li>Identify your strengths, weaknesses, interests, and values</li>
              <li>Understand personality types and career compatibility</li>
              <li>Build self-confidence and motivation for career planning</li>
              <li>Assess your skills and competencies</li>
              <li>Set realistic career goals</li>
              <li>Seek feedback from mentors and peers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Career Exploration */}
      <section className="level-section">
        <h2>Career Exploration</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><FaSearch /> Career Exploration <span className="badge">Explore</span></h3>
            <ul>
              <li>Learn about various industries, job roles, and growth opportunities</li>
              <li>Research career paths and future trends</li>
              <li>Match personal interests and skills to career options</li>
              <li>Explore job market trends</li>
              <li>Network with professionals in your field</li>
              <li>Participate in career fairs and workshops</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skill Development */}
      <section className="level-section">
        <h2>Skill Development</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><FaTools /> Skill Development <span className="badge">Develop</span></h3>
            <ul>
              <li>Identify essential skills for your desired career</li>
              <li>Focus on soft skills: communication, teamwork, problem-solving</li>
              <li>Plan skill-building through courses, workshops, and practice</li>
              <li>Develop technical skills relevant to your career</li>
              <li>Improve emotional intelligence</li>
              <li>Engage in continuous learning</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Job Readiness */}
      <section className="level-section">
        <h2>Job Readiness</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><FaBriefcase /> Job Readiness <span className="badge">Prepare</span></h3>
            <ul>
              <li>Create professional resumes and cover letters</li>
              <li>Prepare for interviews and networking</li>
              <li>Maintain a strong professional presence online</li>
              <li>Practice common interview questions</li>
              <li>Build a professional network on LinkedIn</li>
              <li>Understand workplace etiquette</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CareerGuidance;
