import React from 'react';
import { FaBullhorn, FaSearch, FaFacebook, FaGoogle, FaChartLine, FaEnvelope } from 'react-icons/fa';
import '../styles/digital-marketing.css';

function DigitalMarketing() {
  return (
    <main className="digital-marketing-container">
      <div className="page-title">
        <h1>Digital Marketing Course</h1>
        <p>Step into the world of Digital Marketing with level-wise training, covering SEO, Social Media, Google Ads, and more with hands-on practice.</p>
      </div>

      {/* Level 1: Beginner */}
      <section className="level-section">
        <h2>Level 1: Beginner</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaBullhorn /></span> Module 1: Basics of Digital Marketing</h3>
            <ul>
              <li>Introduction to Digital Marketing</li>
              <li>Types of Digital Channels</li>
              <li>Marketing vs Traditional Marketing</li>
              <li>Understanding target audience</li>
              <li>Digital marketing funnel</li>
              <li>Key performance indicators (KPIs)</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaSearch /></span> Module 2: Website & SEO Fundamentals</h3>
            <ul>
              <li>Basics of websites & CMS</li>
              <li>Introduction to SEO</li>
              <li>On-page optimization</li>
              <li>Keyword research techniques</li>
              <li>Meta tags and descriptions</li>
              <li>Site speed optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Level 2: Intermediate */}
      <section className="level-section">
        <h2>Level 2: Intermediate</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaFacebook /></span> Module 1: Social Media Marketing</h3>
            <ul>
              <li>Facebook & Instagram Marketing</li>
              <li>Content Creation & Strategy</li>
              <li>Social Media Ads</li>
              <li>Engagement metrics and analytics</li>
              <li>Hashtag strategy and trends</li>
              <li>Influencer partnerships</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaGoogle /></span> Module 2: Google Ads & Analytics</h3>
            <ul>
              <li>Running Google Search & Display Ads</li>
              <li>Keyword Planning & Bidding</li>
              <li>Google Analytics Basics</li>
              <li>Conversion tracking</li>
              <li>A/B testing for ads</li>
              <li>Budget management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Level 3: Advanced */}
      <section className="level-section">
        <h2>Level 3: Advanced</h2>
        <div className="modules-grid">
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaChartLine /></span> Module 1: Advanced SEO & Analytics</h3>
            <ul>
              <li>Backlinks & Off-page SEO</li>
              <li>Advanced Google Analytics</li>
              <li>SEO Tools (Ahrefs, SEMrush, etc.)</li>
              <li>Technical SEO audits</li>
              <li>Local SEO strategies</li>
              <li>Mobile SEO optimization</li>
            </ul>
          </div>
          <div className="module-card">
            <h3><span style={{color: '#667eea', marginRight: '8px'}}><FaEnvelope /></span> Module 2: Email & Content Marketing</h3>
            <ul>
              <li>Email Marketing Campaigns</li>
              <li>Copywriting & Content Strategy</li>
              <li>Lead Nurturing</li>
              <li>Segmentation and personalization</li>
              <li>Automation tools</li>
              <li>Compliance and regulations</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DigitalMarketing;
