import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Eligibility from './pages/Eligibility';
import Admission from './pages/Admission';
import Faculty from './pages/Faculty';
import FreeCourses from './pages/FreeCourses';
import Contact from './pages/Contact';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/free-courses" element={<FreeCourses />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
