import React, { useState } from 'react';
import '../styles/free-courses.css'; // Import free courses styles

// Dummy data for free courses
const courses = [
  { id: 1, name: 'Computer Basics', description: 'Essential computer skills: MS Office, Internet, and more.', category: 'computer', image: '/images/Courses-img/computer-course.jpg' },
  { id: 2, name: 'English Speaking', description: 'Improve fluency and communication skills.', category: 'language', image: '/images/Courses-img/english-speaking-course.jpeg' },
  { id: 3, name: 'Personality Development', description: 'Boost confidence and soft skills.', category: 'personality development', image: '/images/Courses-img/personality-development.png' },
  // other courses unchanged
  { id: 4, name: 'Digital Marketing', description: 'Learn online tools and digital safety.', category: 'digital marketing', image: '/images/Courses-img/Digital-Marketing.jpg' },
  { id: 5, name: 'Career Guidance', description: 'Get expert advice on choosing your career path.', category: 'career', image: '/images/Courses-img/cd.webp' },
];

function FreeCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="free-courses">
      {/* Header */}
      <header className="page-header">
        <h1>Free Courses</h1>
        <p>Explore our free courses to enhance your skills and boost your career opportunities.</p>
      </header>

      {/* Search + Filter */}
      <div className="search-filter">
        <input
          type="text"
          id="searchBox"
          placeholder="Search course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="computer">Computer</option>
          <option value="career">Learning</option>
          <option value="language">Language</option>
          <option value="digital marketing">Digital</option>
          <option value="personality development">Personality Development</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid" id="courseGrid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card" data-category={course.category}>
            <img src={course.image} alt={course.name} />
            <div className="content">
              <h2>{course.name}</h2>
              <p>{course.description}</p>
            <a href={`/${course.name.toLowerCase().replace(/\s+/g, '-')}`}>Details</a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default FreeCourses;
