import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Eligibility from './pages/Eligibility';
import Faculty from './pages/Faculty';
import FreeCourses from './pages/FreeCourses';
import ComputerBasics from './pages/ComputerBasics';
import EnglishSpeaking from './pages/EnglishSpeaking';
import DigitalMarketing from './pages/DigitalMarketing';
import CareerGuidance from './pages/CareerGuidance';
import PersonalityDevelopment from './pages/PersonalityDevelopment';
import Contact from './pages/Contact';
import NCC from './pages/NCC';
import Scholarship from './pages/Scholarship';
import AdmissionProcess from './pages/AdmissionProcess';
import AdmissionQuery from './pages/AdmissionQuery';
import LoginPage from './pages/LoginPage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import StaffPanel from './pages/StaffPanel';
import ProtectedRoute from './components/ProtectedRoute';
import StudentPanel from './pages/StudentPanel';
import UploadPhoto from './components/Staff Pannel/UploadPhoto';
import './styles/main.css';
import './styles/footer.css';
import './App.css';


function App() {
  const location = useLocation();

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/admissionprocess" element={<AdmissionProcess />} />
          <Route path="/admissionquery" element={<AdmissionQuery />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/free-courses" element={<FreeCourses />} />
          <Route path="/computer-basics" element={<ComputerBasics />} />
          <Route path="/english-speaking" element={<EnglishSpeaking />} />
          <Route path="/digital-marketing" element={<DigitalMarketing />} />
          <Route path="/career-guidance" element={<CareerGuidance />} />
          <Route path="/personality-development" element={<PersonalityDevelopment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ncc" element={<NCC />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/staff" element={<ProtectedRoute role="staff"><StaffPanel /></ProtectedRoute>} />
          <Route path="/staff/upload-photo" element={<ProtectedRoute role="staff"><UploadPhoto /></ProtectedRoute>} />
          <Route path="/student" element={<StudentPanel />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          <Route path="/faculty/dashboard" element={<StaffPanel />} />
          <Route path="/student/dashboard" element={<StudentPanel />} />
          <Route path="/academic-cell-dashboard" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </Router>
  );
}
export default AppWithRouter;
