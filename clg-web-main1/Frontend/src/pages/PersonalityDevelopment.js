import React from 'react';
import { FaUser, FaComments, FaSmile, FaBullhorn, FaUsers, FaClock, FaCrown, FaBriefcase, FaLightbulb } from 'react-icons/fa';
import '../styles/personality-development.css';

function PersonalityDevelopment() {
  return (
    <main className="personality-development-container">
      <div className="page-title">
        <h1>Personality Development Course</h1>
        <p>Comprehensive level-wise learning to enhance confidence, communication, leadership, and professional skills for career and life success.</p>
      </div>

      {/* Level 1: Beginner */}
      <section className="level-section">
        <h2>Level 1: Beginner</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><FaUser size={28} /> Self-Awareness</h3>
            <ul>
              <li>Understanding personal strengths and weaknesses</li>
              <li>Setting realistic personal goals</li>
              <li>Recognizing limiting beliefs and overcoming them</li>
              <li>Self-reflection techniques</li>
              <li>Building a positive self-image</li>
              <li>Journaling for personal growth</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><FaComments size={28} /> Communication Basics</h3>
            <ul>
              <li>Effective verbal communication</li>
              <li>Basic non-verbal cues and body language</li>
              <li>Active listening skills</li>
              <li>Clear articulation and pronunciation</li>
              <li>Conversational etiquette</li>
              <li>Feedback giving and receiving</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><FaSmile size={28} /> Confidence Building</h3>
            <ul>
              <li>Overcoming fear and shyness</li>
              <li>Positive thinking techniques</li>
              <li>Daily confidence exercises</li>
              <li>Body posture and presence</li>
              <li>Mindfulness for confidence</li>
              <li>Small wins celebration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Level 2: Intermediate */}
      <section className="level-section">
        <h2>Level 2: Intermediate</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><FaBullhorn size={28} /> Advanced Communication</h3>
            <ul>
              <li>Public speaking fundamentals</li>
              <li>Presentation skills with clarity and impact</li>
              <li>Handling Q&A sessions effectively</li>
              <li>Persuasive communication</li>
              <li>Storytelling in presentations</li>
              <li>Overcoming public speaking anxiety</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><FaUsers size={28} /> Interpersonal Skills</h3>
            <ul>
              <li>Teamwork and collaboration</li>
              <li>Conflict resolution strategies</li>
              <li>Empathy and emotional intelligence</li>
              <li>Building trust in relationships</li>
              <li>Cultural sensitivity</li>
              <li>Networking basics</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><FaClock size={28} /> Time & Goal Management</h3>
            <ul>
              <li>Prioritizing tasks effectively</li>
              <li>SMART goals framework</li>
              <li>Overcoming procrastination</li>
              <li>Time blocking techniques</li>
              <li>Productivity tools</li>
              <li>Work-life balance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Level 3: Advanced */}
      <section className="level-section">
        <h2>Level 3: Advanced</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><FaCrown size={28} /> Leadership Skills</h3>
            <ul>
              <li>Decision-making under pressure</li>
              <li>Delegation and mentoring others</li>
              <li>Strategic thinking and planning</li>
              <li>Vision and mission setting</li>
              <li>Inspiring and motivating teams</li>
              <li>Ethical leadership</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><FaBriefcase size={28} /> Professional Development</h3>
            <ul>
              <li>Building personal brand and image</li>
              <li>Networking and relationship building</li>
              <li>Professional etiquette and workplace behavior</li>
              <li>Resume and LinkedIn optimization</li>
              <li>Negotiation skills</li>
              <li>Career advancement strategies</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><FaLightbulb size={28} /> Critical Thinking & Problem Solving</h3>
            <ul>
              <li>Analyzing problems effectively</li>
              <li>Creative solutions and innovation</li>
              <li>Handling complex scenarios confidently</li>
              <li>Risk assessment</li>
              <li>Data-driven decision making</li>
              <li>Continuous improvement mindset</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PersonalityDevelopment;
