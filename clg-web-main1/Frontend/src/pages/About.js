import React from 'react';
import '../styles/about.css';
import sliderImage from '../images/slider1.png';

const About = () => {
  return (
    <>
      <header className="about-header">
        <h1>About Us</h1>
        <p className="about-para">Swargiya Narendra Singh Mahavidyalaya – Nurturing Minds, Building Futures</p>
      </header>
      <div className="about-container">
        {/* About Section */}
        <section className="about-section">
          <div className="about-text">
            <h2>Welcome to Our College</h2>
            <p>
              Swargiya Narendra Singh Mahavidyalaya is a premier institution dedicated to academic excellence, cultural
              enrichment, and holistic student development.
              Established with the vision of empowering rural and urban youth, the college provides quality education across
              diverse disciplines.
            </p>
            <p>
              With state-of-the-art infrastructure, experienced faculty, and a student-friendly environment, we aim to
              create leaders, innovators, and responsible citizens of tomorrow.
            </p>
          </div>
          <img src={sliderImage} alt="College Building" />
        </section>

        {/* Mission and Vision */}
        <section className="about-mission-vision">
          <div className="about-card">
            <h3>Our Mission</h3>
            <p>
              To impart quality education that blends academic learning with real-world applications, fostering intellectual
              growth, moral values, and a spirit of social responsibility among students.
            </p>
          </div>
          <div className="about-card">
            <h3>Our Vision</h3>
            <p>
              To be recognized as a center of excellence in higher education, nurturing talent and promoting innovation
              while contributing to the nation’s progress and development.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="about-values">
          <h2>Our Core Values</h2>
          <ul>
            <li>Excellence in Teaching & Learning</li>
            <li>Integrity, Respect, and Responsibility</li>
            <li>Innovation and Creativity</li>
            <li>Community Engagement & Social Responsibility</li>
            <li>Empowerment of Students for Global Opportunities</li>
            <li>Focus on Research & Development</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default About;
