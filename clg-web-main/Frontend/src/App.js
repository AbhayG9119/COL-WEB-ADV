import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Eligibility from './pages/Eligibility';
import Admission from './pages/Admission';
import Faculty from './pages/Faculty';
import FreeCourses from './pages/FreeCourses';
import ComputerBasics from './pages/ComputerBasics';
import EnglishSpeaking from './pages/EnglishSpeaking';
import DigitalMarketing from './pages/DigitalMarketing';
import CareerGuidance from './pages/CareerGuidance';
import PersonalityDevelopment from './pages/PersonalityDevelopment';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import NCC from './pages/NCC';
import Scholarship from './pages/Scholarship';
import AdmissionProcess from './pages/AdmissionProcess';
import AdmissionQuery from './pages/AdmissionQuery';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import StudentSignupPage from './pages/StudentSignupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HODDashboardPage from './pages/HODDashboardPage';
import StudentDashboardPageProfessional from './pages/StudentDashboardPageProfessional';
import StudentDashboardPageEnhanced from './pages/StudentDashboardPageEnhanced';
import FacultyDashboardPageEnhanced from './pages/FacultyDashboardPageEnhanced';
import AcademicCellDashboardPage from './pages/AcademicCellDashboardPage';
import './styles/main.css';
import './styles/footer.css';
import './App.css'


function App() {
  const location = useLocation();

  // Footer hide karne wale routes
  const noFooterRoutes = [
    '/login',
    '/admin/login',
    '/signup',
    '/dashboard',
    '/admin/dashboard',
    '/hod/dashboard',
    '/faculty/dashboard',
    '/student/dashboard',
    '/academic-cell-dashboard'
  ];

  const showFooter = !noFooterRoutes.includes(location.pathname);

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ncc" element={<NCC />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/signup" element={<StudentSignupPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/hod/dashboard" element={<ProtectedRoute requiredRole="hod"><HODDashboardPage /></ProtectedRoute>} />
          <Route path="/faculty/dashboard" element={<ProtectedRoute requiredRole="faculty"><FacultyDashboardPageEnhanced /></ProtectedRoute>} />
          <Route path="/student/dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboardPageProfessional /></ProtectedRoute>} />
          <Route path="/academic-cell-dashboard" element={<ProtectedRoute requiredRole="academic-cell"><AcademicCellDashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>
      {showFooter && <Footer />}
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
