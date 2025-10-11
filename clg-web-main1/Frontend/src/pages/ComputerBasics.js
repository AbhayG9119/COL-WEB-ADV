import React from 'react';
import { FaDesktop, FaFileAlt, FaGlobe, FaFolder, FaChartBar, FaTools, FaNetworkWired, FaUserTie, FaProjectDiagram } from 'react-icons/fa';
import '../styles/computer-basics.css';

function ComputerBasics() {
  return (
    <main className="computer-basics-container">
      <div className="page-title">
        <h1>Computer Basics Course</h1>
        <p>Learn essential computer skills step by step — from understanding hardware & software to office applications and internet usage.</p>
      </div>

      <section className="level-section">
        <h2>Level 1: Beginner</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaDesktop /></span> Module 1: Introduction to Computers</h3>
            <ul>
              <li>Types of computers and their uses</li>
              <li>Basic hardware components</li>
              <li>Operating system overview (Windows/Linux basics)</li>
              <li>Turning on/off and basic navigation</li>
              <li>Understanding desktop and icons</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaFileAlt /></span> Module 2: Basic Applications</h3>
            <ul>
              <li>MS Word: Creating and formatting documents</li>
              <li>MS Excel: Basic formulas and spreadsheet creation</li>
              <li>MS PowerPoint: Simple presentations</li>
              <li>Opening and saving files</li>
              <li>Basic editing and printing</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaGlobe /></span> Module 3: Internet & Email</h3>
            <ul>
              <li>Browsing the web safely</li>
              <li>Creating and managing email accounts</li>
              <li>Basic online communication</li>
              <li>Searching for information online</li>
              <li>Understanding web browsers</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="level-section">
        <h2>Level 2: Intermediate</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaFolder /></span> Module 1: File & Data Management</h3>
            <ul>
              <li>Organizing files and folders</li>
              <li>Using USB and cloud storage</li>
              <li>Basic data entry techniques</li>
              <li>Copying, moving, and deleting files</li>
              <li>Using search to find files</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaChartBar /></span> Module 2: Advanced Office Skills</h3>
            <ul>
              <li>MS Excel: Charts, tables, and formulas</li>
              <li>MS Word: Templates and advanced formatting</li>
              <li>MS PowerPoint: Animations and transitions</li>
              <li>Inserting images and links</li>
              <li>Using keyboard shortcuts</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaTools /></span> Module 3: Digital Tools</h3>
            <ul>
              <li>Google Drive, Docs, Sheets, and Slides</li>
              <li>Using collaboration tools online</li>
              <li>Basic troubleshooting and support</li>
              <li>Installing software and updates</li>
              <li>Using antivirus programs</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="level-section">
        <h2>Level 3: Advanced</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaNetworkWired /></span> Module 1: Networking & Security</h3>
            <ul>
              <li>Understanding networks and connectivity</li>
              <li>Internet safety and cybersecurity basics</li>
              <li>Data backup and recovery</li>
              <li>Wi-Fi setup and troubleshooting</li>
              <li>Protecting personal information</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaUserTie /></span> Module 2: Professional Applications</h3>
            <ul>
              <li>Email etiquette and professional communication</li>
              <li>Collaborative online projects</li>
              <li>Time management tools</li>
              <li>Using calendars and reminders</li>
              <li>Professional online presence</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaProjectDiagram /></span> Module 3: Practical Projects</h3>
            <ul>
              <li>Creating professional documents and presentations</li>
              <li>Data analysis in Excel</li>
              <li>Real-life digital project simulations</li>
              <li>Building a personal portfolio</li>
              <li>Advanced project management</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ComputerBasics;
