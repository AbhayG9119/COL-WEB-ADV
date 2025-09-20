import React from 'react';
import '../styles/home.css';
import heroImage from '../images/slider1.png';
import newGif from '../images/new.gif';
import noticeImg from '../images/notice-board-img.png';

// Reusable News/Notice/Event Item component
const ListItemWithIcon = ({ icon, text }) => (
  <li>
    {icon && <img src={icon} alt="Icon" />} {text}
  </li>
);


function Home() {
  return (
    <>
      {/* Top News Header */}
      <div className="headquote-container">
        <div className="headquote-scroll">
          <p>
            Education is the key to success, and at Sw. Narendra Singh Mahavidyalaya we unlock every student's potential. We believe in nurturing minds and building bright futures. Education is the most powerful weapon which you can use to change the world. Our mission is to provide quality education, inspire creativity, and empower students to achieve their dreams. At Sw. Narendra Singh Mahavidyalaya, we cultivate knowledge, values, and skills that prepare students for lifelong success.
          </p>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="hero-img">
        <img src={heroImage} alt="College Campus" />
      </div>

      {/* Main Content */}
      <div className="container margin-top-50 main-sections">
        {/* Latest News */}
        <div className="card">
          <div className="heading-sect">
            <h3 className="head-title">Latest News</h3>
          </div>
          <div className="vertical-scroll">
            <ul className="latest-news-ul">
              <ListItemWithIcon icon={newGif} text="Admissions 2025 last date: 25 Aug." />
              <ListItemWithIcon icon={newGif} text="B.A., B.Sc., B.Ed. classes start: 1 Sept." />
              <ListItemWithIcon icon={newGif} text="Orientation Program: 3 Sept." />
              <ListItemWithIcon icon={newGif} text="Library renovation completed. " />
              <ListItemWithIcon icon={newGif} text="Scholarship forms till 15 Sept." />
              <ListItemWithIcon icon={newGif} text="NCC enrollment starts 20 Aug." />
              <ListItemWithIcon icon={newGif} text="Annual Sports Meet in Oct." />
              <ListItemWithIcon icon={newGif} text="Internal Exams in Nov." />
            </ul>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="heading-sect">
            <h3 className="head-title">Upcoming Events</h3>
          </div>
          <ul className="upcoming-event-list">
            <li><span className="event-date">coming <br /> Soon</span> Seminar on B.Sc courses</li>
            <li><span className="event-date">Coming<br /> Soon</span> Seminar on B.A courses</li>
            <li><span className="event-date">Coming <br /> Soon</span> Seminar on B.Ed courses</li>
            <li><span className="event-date">28 <br /> Oct</span> 2nd Convocation Ceremony</li>
          </ul>
        </div>

        {/* Notice Board */}
        <div className="card">
          <div className="heading-sect">
            <h3 className="head-title">Notice Board</h3>
          </div>
          <ul className="notice-board-list">
            <li><img src={noticeImg} alt="Notice" /> Admissions 2025 – Last Date: 25th August 2025</li>
            <li><img src={noticeImg} alt="Notice" /> Regular Classes start 1st September 2025</li>
            <li><img src={noticeImg} alt="Notice" /> Renovated Library facilities open now</li>
            <li><img src={noticeImg} alt="Notice" /> Internal Exams scheduled in November</li>
          </ul>
        </div>

        {/* Student Life */}
        <div className="card">
          <div className="heading-sect">
            <h3 className="head-title">Student Life</h3>
          </div>
          <ul className="student-life">
            <li>Regular Cultural & Sports Activities</li>
            <li>Skill Development Workshops</li>
            <li>Active Student Clubs & Societies</li>
            <li>Supportive and Inclusive Environment</li>
          </ul>
        </div>

        {/* Facilities */}
        <div className="card">
          <div className="heading-sect">
            <h3 className="head-title">Our Facilities</h3>
          </div>
          <ul className="college-campus-list">
            <li><b>Library & Reading Room –</b> Rich collection of books, journals, and e-resources.</li>
            <li><b>Computer Lab –</b> Equipped with latest software and high-speed internet.</li>
            <li><b>Spacious Classrooms –</b> Modern teaching aids with projectors & smart boards.</li>
            <li><b>Sports & Recreation –</b> Indoor & outdoor facilities for all-round development.</li>
          </ul>
        </div>

        {/* College Campus */}
        <div className="card">
          <div className="heading-sect">
            <h3 className="head-title">College Campus</h3>
          </div>
          <ul className="college-campus-list">
            <li><b>Plot Area:</b> 10,250 sq. meters – eco-friendly learning environment.</li>
            <li><b>Built-Up Area:</b> 40,000 sq. ft. with modern classrooms & labs.</li>
            <li><b>Green Campus:</b> Lush gardens & open spaces for holistic growth.</li>
            <li><b>Facilities:</b> Library, seminar halls, labs, sports & hostel.</li>
          </ul>
        </div>
      </div>

      {/* Why Choose College */}
      <div className="why-choose">
        <div className="container">
          <h2>Why Choose Our College?</h2>
          <div className="underline"></div>
          <p><strong>Modern Curriculum:</strong> Updated courses designed to meet industry standards.</p>
          <p><strong>Expert Faculty:</strong> Experienced educators dedicated to student success.</p>
          <p><strong>Strong Placements:</strong> Partnerships with top companies ensure career growth.</p>
          <p><strong>Leadership:</strong> Guided by visionaries committed to quality education.</p>
        </div>
      </div>


    </>
  );
}

export default Home;
