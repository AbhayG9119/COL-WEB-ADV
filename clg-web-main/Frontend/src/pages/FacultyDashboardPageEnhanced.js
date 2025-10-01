

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import facultyApi from '../services/facultyApi';
import '../styles/ProfessionalAttendance.css'; // Professional attendance styles

const BACKEND_BASE_URL = 'http://localhost:5000';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// @ts-nocheck

function FacultyDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', venue: '', organizer: '' });

  // Enhanced attendance state
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    department: 'all'
  });
  const [studentAttendance, setStudentAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);
  const [dailyAttendanceRecords, setDailyAttendanceRecords] = useState([]);
  const [dayWiseAttendance, setDayWiseAttendance] = useState([]);
  const [showDayWiseView, setShowDayWiseView] = useState(false);
  const [dayWiseLoading, setDayWiseLoading] = useState(false);
  const [dayWiseError, setDayWiseError] = useState('');

  // Enhanced Dashboard States
  const [totals, setTotals] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalEvents: 0,
    totalNotices: 0
  });
  const [trendsData, setTrendsData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);

  const navigate = useNavigate();

  // New state variables for enhanced sections
  const [faculty, setFaculty] = useState([]);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [personalDocuments, setPersonalDocuments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [newFaculty, setNewFaculty] = useState({ username: '', email: '', department: '', role: 'faculty' });
  const [newStudent, setNewStudent] = useState({ username: '', email: '', department: '' });
  const [newResult, setNewResult] = useState({ studentId: '', subject: '', marks: '', grade: '' });
  const [newFee, setNewFee] = useState({ studentId: '', amount: '', description: '', dueDate: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal' });
  const [uploadForm, setUploadForm] = useState({ title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [editingFee, setEditingFee] = useState(null);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [reportType, setReportType] = useState('attendance');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [documentSearchTerm, setDocumentSearchTerm] = useState('');

  // Form validation state
  const [fieldErrors, setFieldErrors] = useState({});

  // Admissions state variables (extracted from AcademicCellDashboardPage.js)
  const [admissions, setAdmissions] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [showNewAdmissionForm, setShowNewAdmissionForm] = useState(false);
  const [showViewStudentModal, setShowViewStudentModal] = useState(false);
  const [admissionFormData, setAdmissionFormData] = useState({
    // Student Information
    student: '',
    studentName: '',
    // Personal Profile
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    religion: '',
    caste: '',
    domicile: '',
    aadharNumber: '',
    // Academic Profile
    rollNumber: '',
    college: '',
    course: '',
    branch: '',
    admissionDate: '',
    admissionMode: '',
    admissionSession: '',
    academicSession: '',
    currentYear: '',
    currentSemester: '',
    currentAcademicStatus: '',
    scholarshipApplied: '',
    // Hostel Details
    hostelApplied: '',
    // Contact Details
    contactNumber: '',
    fatherContactNumber: '',
    correspondenceAddress: '',
    permanentAddress: '',
    email: '',
    // Qualifications
    qualifications: [{ course: '', streamName: '', boardName: '', rollNumber: '', passingYear: '', subjectDetails: '', marksPercentage: '' }],
    // Semester Results
    semesterResults: [{ year: '', semester: '', status: '', marksPercentage: '', carryOverPapers: '' }],
    // Documents
    documents: {
      tenthMarksheet: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      twelfthMarksheet: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      aadharCard: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      incomeCertificate: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      casteCertificate: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      bankPassbook: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      transferCertificate: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      photo: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
      signature: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null }
    }
  });

  // New Admission Form state
  const [newAdmissionForm, setNewAdmissionForm] = useState({
    // Student Information
    student: '',
    studentName: '',
    // Personal Profile
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    religion: '',
    caste: '',
    domicile: '',
    aadharNumber: '',
    // Academic Profile
    rollNumber: '',
    college: '',
    course: '',
    branch: '',
    admissionDate: '',
    admissionMode: '',
    admissionSession: '',
    academicSession: '',
    currentYear: '',
    currentSemester: '',
    currentAcademicStatus: '',
    scholarshipApplied: '',
    // Hostel Details
    hostelApplied: '',
    // Contact Details
    contactNumber: '',
    fatherContactNumber: '',
    correspondenceAddress: '',
    permanentAddress: '',
    email: '',
    // Qualifications
    qualifications: [{ course: '', streamName: '', boardName: '', rollNumber: '', passingYear: '', subjectDetails: '', marksPercentage: '' }],
    // Semester Results
    semesterResults: [{ year: '', semester: '', status: '', marksPercentage: '', carryOverPapers: '' }]
  });

  // Student Profiles state
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [basicStudentProfiles, setBasicStudentProfiles] = useState([]);
  const [loadingBasicProfiles, setLoadingBasicProfiles] = useState(false);
  const [studentProfileStats, setStudentProfileStats] = useState({
    totalProfiles: 0,
    todayProfiles: 0,
    courseStats: []
  });
  const [profileSearchTerm, setProfileSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    // Basic Information
    fullName: '',
    employeeId: '',
    department: '',
    designation: '',
    dateOfJoining: '',

    // Contact Details (editable fields for faculty)
    officialEmail: '',
    mobileNumber: '',
    officeRoom: '',

    // Professional Details
    subjectsTaught: [],
    teachingExperience: '',
    specialization: [],
    researchInterests: [],
    publications: [],
    certifications: [],
    achievements: [],

    // Administrative Roles
    administrativeRoles: [],

    // Attendance & Schedule
    weeklyTimetable: {},
    leaveRecords: [],

    // Additional
    shortBio: '',
    officeHours: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState({
    idProof: null,
    qualificationCertificates: [],
    appointmentLetter: null
  });
  const [profileLoading, setProfileLoading] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Check if token and role exist in localStorage
    if (!token || role !== 'faculty') {
      navigate('/login');
      return;
    }

    // Verify JWT token contains faculty role
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'faculty') {
        console.error('JWT token does not contain faculty role');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('Invalid JWT token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  // Load admissions and student profiles when sections are accessed
  useEffect(() => {
    if (activeSection === 'admissions') {
      loadAdmissions();
    } else if (activeSection === 'student-profiles') {
      loadStudentProfiles();
    }
  }, [activeSection]);

  // Function to refresh admissions data
  const refreshAdmissionsData = async () => {
    try {
      const res = await facultyApi.getStudentProfiles();
      setAdmissions(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setAdmissions([]);
    }
  };

  // Ensure documents object is always initialized
  useEffect(() => {
    if (!admissionFormData.documents || typeof admissionFormData.documents !== 'object') {
      setAdmissionFormData(prev => ({ ...prev, documents: {
        tenthMarksheet: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        twelfthMarksheet: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        aadharCard: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        incomeCertificate: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        casteCertificate: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        bankPassbook: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        transferCertificate: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        photo: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null },
        signature: { fileName: '', status: 'Pending', uploadDate: '', remarks: '', file: null }
      } }));
    }
  }, [admissionFormData.documents]);

  // Documents upload handlers for each document type
  const handleDocumentChange = (docType, file) => {
    setAdmissionFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: {
          ...prev.documents[docType],
          fileName: file.name,
          file: file,
          status: 'Pending',
          uploadDate: new Date().toISOString(),
          remarks: ''
        }
      }
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Load faculty profile
      await loadFacultyProfile();

      const eventsResponse = await facultyApi.getEvents();
      setEvents(eventsResponse.data);

      const studentsResponse = await facultyApi.getStudents();
      setStudents(studentsResponse.data);

      const attendanceResponse = await facultyApi.getAttendanceRecords();
      setAttendanceRecords(attendanceResponse.data);

      // Load new data for enhanced sections
      await loadEnhancedData();

      // Load enhanced dashboard data
      await loadEnhancedDashboardData();

      // Load today's attendance
      await loadTodayAttendance();
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
  };

  const loadFacultyProfile = async () => {
    try {
      const profileResponse = await facultyApi.getProfile();
      setProfile(profileResponse.data);
      // Initialize form with current profile data (only editable fields for faculty)
      setProfileForm({
        fullName: profileResponse.data.fullName || '',
        employeeId: profileResponse.data.employeeId || '',
        department: profileResponse.data.department || '',
        designation: profileResponse.data.designation || '',
        dateOfJoining: profileResponse.data.dateOfJoining ? new Date(profileResponse.data.dateOfJoining).toISOString().split('T')[0] : '',
        officialEmail: profileResponse.data.officialEmail || '',
        mobileNumber: profileResponse.data.mobileNumber || '',
        officeRoom: profileResponse.data.officeRoom || '',
        subjectsTaught: Array.isArray(profileResponse.data.subjectsTaught) ? profileResponse.data.subjectsTaught : [],
        teachingExperience: profileResponse.data.teachingExperience || '',
        specialization: Array.isArray(profileResponse.data.specialization) ? profileResponse.data.specialization : [],
        researchInterests: Array.isArray(profileResponse.data.researchInterests) ? profileResponse.data.researchInterests : [],
        publications: Array.isArray(profileResponse.data.publications) ? profileResponse.data.publications : [],
        certifications: Array.isArray(profileResponse.data.certifications) ? profileResponse.data.certifications : [],
        achievements: Array.isArray(profileResponse.data.achievements) ? profileResponse.data.achievements : [],
        administrativeRoles: Array.isArray(profileResponse.data.administrativeRoles) ? profileResponse.data.administrativeRoles : [],
        weeklyTimetable: profileResponse.data.weeklyTimetable || {},
        leaveRecords: Array.isArray(profileResponse.data.leaveRecords) ? profileResponse.data.leaveRecords : [],
        shortBio: profileResponse.data.shortBio || '',
        officeHours: profileResponse.data.officeHours || '',
      });
    } catch (err) {
      console.log('Failed to load faculty profile:', err);
      // Check if it's a 404 error (profile not found)
      if (err.response && err.response.status === 404) {
        setProfile(null); // Set to null to indicate profile needs to be created
      } else {
        // Fallback to basic profile for other errors
        setProfile({ username: 'Faculty User', department: 'Computer Science' });
      }
    }
  };

  const loadEnhancedData = async () => {
    try {
      const [facultyRes, resultsRes, feesRes, noticesRes, studyMaterialsRes] = await Promise.all([
        facultyApi.getFaculty(),
        facultyApi.getResults(),
        facultyApi.getFees(),
        facultyApi.getNotices(),
        facultyApi.getStudyMaterials()
      ]);

      setFaculty(facultyRes.data);
      setResults(resultsRes.data);
      setFees(feesRes.data);
      setNotices(noticesRes.data);
      setStudyMaterials(studyMaterialsRes.data.data || studyMaterialsRes.data);

      // Handle documents API call separately with error handling
      // Only load documents if faculty profile exists and has department
      if (profile && profile.department) {
        try {
          const documentsRes = await facultyApi.getDocuments();
          setDocuments(documentsRes.data?.data || []);
        } catch (error) {
          console.error('Error fetching documents:', error);
          setDocuments([]);
        }
      } else {
        console.log('Faculty profile or department not available, skipping documents load');
        setDocuments([]);
      }

      setPersonalDocuments([
        { documentType: 'Photo', originalName: 'WhatsApp Image 2025-09-13 at 2.44.19 PM.jpeg', fileSize: '70.05 KB', status: 'verified', remarks: 'N/A', uploadedAt: '29 Sept 2025, 09:30 am', fileUrl: '/uploads/documents/photo.jpg' },
        { documentType: 'Aadhar Card', originalName: 'db1.jpg', fileSize: '239.68 KB', status: 'verified', remarks: 'N/A', uploadedAt: '29 Sept 2025, 10:04 am', fileUrl: '/uploads/documents/aadhar.jpg' },
        { documentType: '10th Marksheet', originalName: 'WhatsApp Image 2025-09-09 at 11.09.42 AM.jpeg', fileSize: '76.08 KB', status: 'verified', remarks: 'N/A', uploadedAt: '29 Sept 2025, 10:21 am', fileUrl: '/uploads/documents/10th_marksheet.jpg' },
        { documentType: '12th Marksheet', originalName: 'ERD3.jpg', fileSize: '75.03 KB', status: 'verified', remarks: 'N/A', uploadedAt: '29 Sept 2025, 11:03 am', fileUrl: '/uploads/documents/12th_marksheet.jpg' }
      ]);
    } catch (err) {
      console.log('Some enhanced data failed to load:', err);
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await facultyApi.getAttendanceRecords({ date: today });
      setTodayAttendance(response.data);
    } catch (err) {
      console.log('No attendance data for today');
    }
  };

  const loadEnhancedDashboardData = async () => {
    try {
      // Load totals
      const totalsResponse = await facultyApi.getDashboardTotals();
      setTotals(totalsResponse.data);

      // Load trends data (last 30 days)
      const trendsResponse = await facultyApi.getAttendanceTrends();
      setTrendsData(trendsResponse.data);

      // Load performance data
      const performanceResponse = await facultyApi.getPerformanceData();
      setPerformanceData(performanceResponse.data);

      // Load recent notices (last 5)
      const noticesResponse = await facultyApi.getRecentNotices();
      setRecentNotices(noticesResponse.data);
    } catch (err) {
      console.log('Some enhanced dashboard data failed to load:', err);
    }
  };

  // Load Admissions Data
  const loadAdmissions = async () => {
    try {
      setLoadingBasicProfiles(true);
      const response = await facultyApi.getBasicStudentProfiles();
      setBasicStudentProfiles(response.data.data || []);
      setLoadingBasicProfiles(false);
      // Calculate stats based on basic profiles
      const profiles = response.data.data || [];
      const stats = {
        totalProfiles: profiles.length,
        todayProfiles: profiles.filter(profile =>
          new Date(profile.admissionDate).toDateString() === new Date().toDateString()
        ).length,
        courseStats: []
      };
      // Group by department
      const courseMap = {};
      profiles.forEach(profile => {
        const course = profile.department || 'Unknown';
        courseMap[course] = (courseMap[course] || 0) + 1;
      });
      stats.courseStats = Object.entries(courseMap).map(([course, count]) => ({ course, count }));
      setStudentProfileStats(stats);
    } catch (err) {
      console.log('Failed to load basic student profiles:', err);
      setLoadingBasicProfiles(false);
    }
  };

  // Load Student Profiles Data
  const loadStudentProfiles = async () => {
    try {
      // Pass department parameter to filter at backend level
      const response = await facultyApi.getStudentProfiles({ department: profile?.department });
      setStudentProfiles(response.data);
      // Calculate stats based on filtered profiles (assuming backend filters by department)
      const stats = {
        totalProfiles: response.data.length,
        todayProfiles: response.data.filter(profile =>
          new Date(profile.createdAt).toDateString() === new Date().toDateString()
        ).length,
        courseStats: []
      };
      // Group by course (only the faculty's department)
      const courseMap = {};
      response.data.forEach(profile => {
        const course = profile.course || 'Unknown';
        courseMap[course] = (courseMap[course] || 0) + 1;
      });
      stats.courseStats = Object.entries(courseMap).map(([course, count]) => ({ course, count }));
      setStudentProfileStats(stats);
    } catch (err) {
      console.log('Failed to load student profiles:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Profile editing handlers
  const handleProfileFormChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const handleFileChange = (field, file) => {
    if (field === 'profilePicture') {
      setProfilePictureFile(file);
    } else if (field === 'idProof') {
      setDocumentFiles(prev => ({ ...prev, idProof: file }));
    } else if (field === 'qualificationCertificates') {
      setDocumentFiles(prev => ({
        ...prev,
        qualificationCertificates: [...prev.qualificationCertificates, file]
      }));
    } else if (field === 'appointmentLetter') {
      setDocumentFiles(prev => ({ ...prev, appointmentLetter: file }));
    }
  };

  const handleSaveProfile = async () => {
    setError('');
    // Client-side validation
    if (!profileForm.fullName.trim()) {
      setError('Full Name is required');
      return;
    }
    if (!profileForm.employeeId.trim()) {
      setError('Employee ID is required');
      return;
    }
    if (!profileForm.department.trim()) {
      setError('Department is required');
      return;
    }
    if (!profileForm.officialEmail.trim()) {
      setError('Official Email is required');
      return;
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.officialEmail)) {
      setError('Invalid email format');
      return;
    }
    if (!profileForm.mobileNumber.trim()) {
      setError('Mobile Number is required');
      return;
    }
    // Mobile number must be 10 digits
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(profileForm.mobileNumber)) {
      setError('Mobile Number must be exactly 10 digits');
      return;
    }
    // Validate file uploads (optional)
    if (profilePictureFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(profilePictureFile.type)) {
        setError('Profile picture must be a JPG or PNG image');
        return;
      }
      if (profilePictureFile.size > 2 * 1024 * 1024) {
        setError('Profile picture size must be less than 2MB');
        return;
      }
    }
    if (documentFiles.idProof) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(documentFiles.idProof.type)) {
        setError('ID Proof must be a PDF or JPG/PNG image');
        return;
      }
      if (documentFiles.idProof.size > 5 * 1024 * 1024) {
        setError('ID Proof size must be less than 5MB');
        return;
      }
    }
    if (documentFiles.qualificationCertificates.length > 0) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      for (const file of documentFiles.qualificationCertificates) {
        if (!allowedTypes.includes(file.type)) {
          setError('Qualification certificates must be PDF, Word, or JPG/PNG images');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError('Each qualification certificate size must be less than 5MB');
          return;
        }
      }
    }
    if (documentFiles.appointmentLetter) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(documentFiles.appointmentLetter.type)) {
        setError('Appointment letter must be PDF, Word, or JPG/PNG image');
        return;
      }
      if (documentFiles.appointmentLetter.size > 5 * 1024 * 1024) {
        setError('Appointment letter size must be less than 5MB');
        return;
      }
    }

    setProfileLoading(true);
    try {
      // Update profile data (text fields)
      const response = await facultyApi.updateProfile(profileForm);
      setProfile(response.data.faculty || response.data);

      // Upload profile picture if selected
      if (profilePictureFile) {
        await facultyApi.uploadProfilePicture(profilePictureFile);
        // Refresh profile to get updated picture
        const profileResponse = await facultyApi.getProfile();
        setProfile(profileResponse.data);
      }

      // Upload documents if selected
      if (documentFiles.idProof || documentFiles.qualificationCertificates.length > 0 || documentFiles.appointmentLetter) {
        await facultyApi.uploadDocuments(documentFiles);
      }

      setIsEditingProfile(false);
      setProfilePictureFile(null);
      setDocumentFiles({
        idProof: null,
        qualificationCertificates: [],
        appointmentLetter: null
      });
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to ' + (profile ? 'update' : 'create') + ' profile');
    }
    setProfileLoading(false);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset form to current profile data
    loadFacultyProfile();
    setProfilePictureFile(null);
  };

  // Enhanced event handlers
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.createEvent(newEvent);
      setNewEvent({ title: '', description: '', date: '', time: '', venue: '', organizer: '' });
      fetchData(); // Refresh events
    } catch (err) {
      setError('Failed to create event');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.createNotice(newNotice);
      setNewNotice({ title: '', content: '', priority: 'normal' });
      fetchData(); // Refresh notices
    } catch (err) {
      setError('Failed to create notice');
    }
  };

  const handleUploadStudyMaterial = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadForm.title) {
      setError('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('file', selectedFile);

      await facultyApi.uploadStudyMaterial(formData);
      setUploadForm({ title: '', description: '' });
      setSelectedFile(null);
      const response = await facultyApi.getStudyMaterials();
      setStudyMaterials(response.data.data || response.data);
      alert('Study material uploaded successfully!');
    } catch (err) {
      // Handle specific error messages from backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to upload study material');
      }
    }
    setUploading(false);
  };

  const handleDeleteStudyMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      try {
        await facultyApi.deleteStudyMaterial(materialId);
      const response = await facultyApi.getStudyMaterials();
      setStudyMaterials(response.data.data || response.data);
      alert('Study material deleted successfully!');
      } catch (err) {
        setError('Failed to delete study material');
      }
    }
  };

  // Faculty Management
  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.createFaculty(newFaculty);
      setNewFaculty({ username: '', email: '', department: '', role: 'faculty' });
      fetchData();
    } catch (err) {
      setError('Failed to create faculty');
    }
  };

  const handleUpdateFaculty = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.updateFaculty(editingFaculty._id, editingFaculty);
      setEditingFaculty(null);
      fetchData();
    } catch (err) {
      setError('Failed to update faculty');
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await facultyApi.deleteFaculty(facultyId);
        fetchData();
      } catch (err) {
        setError('Failed to delete faculty');
      }
    }
  };



  // Result Management
  const handleUploadMarks = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.uploadMarks(newResult);
      setNewResult({ studentId: '', subject: '', marks: '', grade: '' });
      fetchData();
    } catch (err) {
      setError('Failed to upload marks');
    }
  };

  const handleUpdateMarks = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.updateMarks(editingResult._id, editingResult);
      setEditingResult(null);
      fetchData();
    } catch (err) {
      setError('Failed to update marks');
    }
  };

  // Fee Management
  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.createFeeRecord(newFee);
      setNewFee({ studentId: '', amount: '', description: '', dueDate: '' });
      fetchData();
    } catch (err) {
      setError('Failed to create fee record');
    }
  };

  const handleUpdateFee = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.updateFeeRecord(editingFee._id, editingFee);
      setEditingFee(null);
      fetchData();
    } catch (err) {
      setError('Failed to update fee record');
    }
  };

  // Document Approval
  const handleApproveDocument = async (documentId, status) => {
    try {
      await facultyApi.approveDocument(documentId, status);
      fetchData();
    } catch (err) {
      setError('Failed to approve document');
    }
  };

  // Document Download
  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const response = await facultyApi.downloadDocument(documentId);
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download document');
    }
  };

  // Personal Document Download (for sample documents)
  const handleDownloadPersonalDocument = async (fileUrl, fileName) => {
    try {
      // Fetch the file from the backend
      const response = await fetch(`${BACKEND_BASE_URL}${fileUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      const blob = await response.blob();
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download document');
    }
  };

  // Fix: Add missing document upload handler for faculty profile documents
  const handleDocumentUpload = async () => {
    setError('');
    if (!documentFiles.idProof && documentFiles.qualificationCertificates.length === 0 && !documentFiles.appointmentLetter) {
      setError('Please select at least one document to upload');
      return;
    }

    const formData = new FormData();
    if (documentFiles.idProof) {
      formData.append('idProof', documentFiles.idProof);
    }
    if (documentFiles.qualificationCertificates.length > 0) {
      documentFiles.qualificationCertificates.forEach((file, index) => {
        formData.append('qualificationCertificates', file);
      });
    }
    if (documentFiles.appointmentLetter) {
      formData.append('appointmentLetter', documentFiles.appointmentLetter);
    }

    try {
      await facultyApi.uploadDocuments(formData);
      alert('Documents uploaded successfully!');
      // Refresh profile to show updated documents
      const profileResponse = await facultyApi.getProfile();
      setProfile(profileResponse.data);
      // Clear selected files
      setDocumentFiles({
        idProof: null,
        qualificationCertificates: [],
        appointmentLetter: null
      });
    } catch (err) {
      setError('Failed to upload documents');
    }
  };

  // Bulk Upload
  const handleBulkUpload = async (type) => {
    if (!bulkUploadFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      let response;
      switch (type) {
        case 'students':
          response = await facultyApi.bulkUploadStudents(bulkUploadFile);
          break;
        case 'marks':
          response = await facultyApi.bulkUploadMarks(bulkUploadFile);
          break;
        case 'fees':
          response = await facultyApi.bulkUploadFees(bulkUploadFile);
          break;
        default:
          throw new Error('Invalid upload type');
      }
      alert(`${type} uploaded successfully!`);
      setBulkUploadFile(null);
      fetchData();
    } catch (err) {
      setError(`Failed to upload ${type}`);
    }
  };

  // Report Generation
  const generateReport = async () => {
    try {
      const params = {};
      if (selectedSubject) {
        params.subject = selectedSubject;
      }
      const response = await facultyApi.generateReport(reportType, params);
      // Handle report download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to generate report');
    }
  };

  // Notifications
  const sendNotification = async () => {
    if (!notificationMessage || selectedStudents.length === 0) {
      setError('Please enter a message and select students');
      return;
    }

    try {
      await facultyApi.sendNotification({
        message: notificationMessage,
        studentIds: selectedStudents
      });
      setNotificationMessage('');
      setSelectedStudents([]);
      alert('Notification sent successfully!');
      loadSentNotifications(); // Refresh sent notifications
    } catch (err) {
      setError('Failed to send notification');
    }
  };

  const [sentNotifications, setSentNotifications] = useState([]);
  const [notificationTab, setNotificationTab] = useState('send'); // 'send' or 'sent'

  const loadSentNotifications = async () => {
    try {
      const response = await facultyApi.getSentNotifications();
      setSentNotifications(response.data);
    } catch (err) {
      console.error('Failed to load sent notifications:', err);
    }
  };

  useEffect(() => {
    if (notificationTab === 'sent') {
      loadSentNotifications();
    }
  }, [notificationTab]);

  // Professional Attendance System Functions
  const loadStudentsForAttendance = async () => {
    try {
      setLoading(true);
      let response;
      if (attendanceForm.department === 'all') {
        response = await facultyApi.getAllStudents();
      } else {
        response = await facultyApi.getStudentsByDepartment(attendanceForm.department);
      }
      setAllStudents(response.data);
      setFilteredStudents(response.data);

      // Load attendance statistics
      const statsResponse = await facultyApi.getAttendanceStatistics({
        date: attendanceForm.date,
        subject: attendanceForm.subject,
        department: attendanceForm.department !== 'all' ? attendanceForm.department : undefined
      });
      setAttendanceStats(statsResponse.data);

      setError('');
    } catch (err) {
      setError('Failed to load students for attendance');
    }
    setLoading(false);
  };

  const filterStudents = (term) => {
    if (!term) {
      setFilteredStudents(allStudents);
      return;
    }

    const filtered = allStudents.filter(student =>
      student.username.toLowerCase().includes(term.toLowerCase()) ||
      student._id.toString().toLowerCase().includes(term.toLowerCase()) ||
      student.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const toggleAttendance = (studentId, status) => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status
    }));
  };

  const markAllPresent = () => {
    const newAttendance = {};
    allStudents.forEach(student => {
      newAttendance[student._id] = 'present';
    });
    setStudentAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = {};
    allStudents.forEach(student => {
      newAttendance[student._id] = 'absent';
    });
    setStudentAttendance(newAttendance);
  };

  const submitAttendance = async () => {
    if (!attendanceForm.date || !attendanceForm.subject) {
      setError('Please fill in date and subject');
      return;
    }

    if (Object.keys(studentAttendance).length === 0) {
      setError('Please mark attendance for at least one student');
      return;
    }

    try {
      const attendanceRecords = Object.entries(studentAttendance)
        .filter(([_, status]) => status)
        .map(([studentId, status]) => ({
          studentId,
          status
        }));

      await facultyApi.markBulkAttendance({
        date: attendanceForm.date,
        subject: attendanceForm.subject,
        attendanceRecords
      });

      setStudentAttendance({});
      setError('');
      alert('Attendance submitted successfully!');
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to submit attendance');
    }
  };

  const updateRecordStatus = async (recordId, status) => {
    try {
      await facultyApi.updateAttendanceRecord(recordId, status);
      fetchData(); // Refresh attendance records
    } catch (err) {
      setError('Failed to update attendance record');
    }
  };

  const loadDayWiseAttendance = async () => {
    // Prevent multiple simultaneous calls
    if (dayWiseLoading) {
      console.log('Day-wise attendance already loading, skipping...');
      return;
    }

    try {
      setDayWiseLoading(true);
      setDayWiseError('');
      console.log('Loading day-wise attendance records...');

      // Get current date and last 7 days for default range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };

      console.log('Calling API with params:', params);
      const response = await facultyApi.getDayWiseAttendanceRecords(params);
      console.log('Day-wise attendance response:', response.data);

      // Handle empty response gracefully
      if (!response.data || response.data.length === 0) {
        console.log('No attendance records found for the specified date range');
        setDayWiseAttendance([]);
      } else {
        setDayWiseAttendance(response.data);
      }

      setShowDayWiseView(true);
      setError('');
    } catch (err) {
      console.error('Error loading day-wise attendance:', err);
      setDayWiseError('Failed to load day-wise attendance records. Please try again.');
      setDayWiseAttendance([]);
    } finally {
      setDayWiseLoading(false);
    }
  };

  const toggleDayWiseView = () => {
    if (!showDayWiseView) {
      // Only load if not already loading
      if (!dayWiseLoading) {
        loadDayWiseAttendance();
      }
    } else {
      setShowDayWiseView(false);
      setDayWiseError(''); // Clear any previous errors when switching views
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="section-content">
            <h2>Faculty Dashboard</h2>

            {/* Dashboard Widgets/Cards */}
            <div className="dashboard-widgets">
              <div className="widget-card">
                <div className="widget-icon">📚</div>
                <div className="widget-content">
                  <h3>{totals.totalClasses || 0}</h3>
                  <p>Total Classes Assigned</p>
                </div>
              </div>
              <div className="widget-card">
                <div className="widget-icon">👥</div>
                <div className="widget-content">
                  <h3>{totals.totalStudents || 0}</h3>
                  <p>Total Students Under Faculty</p>
                </div>
              </div>
              <div className="widget-card">
                <div className="widget-icon">📋</div>
                <div className="widget-content">
                  <h3>{totals.pendingNotices || 0}</h3>
                  <p>Pending Tasks / Notices</p>
                </div>
              </div>
              <div className="widget-card">
                <div className="widget-icon">📊</div>
                <div className="widget-content">
                  <h3>{totals.attendancePercentage || 0}%</h3>
                  <p>Attendance Summary</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="dashboard-charts">
              <div className="chart-container">
                <h3>Attendance Trends (Last 30 Days)</h3>
                {trendsData && trendsData.length > 0 ? (
                  <Line
                    data={{
                      labels: trendsData.map(item => item.date),
                      datasets: [{
                        label: 'Attendance Percentage',
                        data: trendsData.map(item => item.percentage),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                      }]
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                ) : (
                  <p>No attendance data available</p>
                )}
              </div>

              <div className="chart-container">
                <h3>Subject-wise Performance</h3>
                {performanceData && performanceData.length > 0 ? (
                  <Bar
                    data={{
                      labels: performanceData.map(item => item.subject),
                      datasets: [{
                        label: 'Average Marks',
                        data: performanceData.map(item => item.avgMarks),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                ) : (
                  <p>No performance data available</p>
                )}
              </div>
            </div>

            {/* Recent Notices/Events */}
            <div className="dashboard-section">
              <h3>Recent Notices / Events</h3>
              {recentNotices && recentNotices.length > 0 ? (
                <div className="notices-list">
                  {recentNotices.slice(0, 5).map(notice => (
                    <div key={notice._id} className={`notice-item priority-${notice.priority || 'normal'}`}>
                      <div className="notice-header">
                        <h4>{notice.title}</h4>
                        <span className="notice-date">{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{notice.content}</p>
                      {notice.priority && <span className="priority-badge">{notice.priority}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent notices</p>
              )}
            </div>

            {/* Classes Assigned */}
            <div className="dashboard-section">
              <h3>Classes Assigned</h3>
              {profile && profile.subjectsTaught ? (
                <div className="subjects-list">
                  {Array.isArray(profile.subjectsTaught) 
                    ? profile.subjectsTaught.map((subject, index) => (
                        <div key={index} className="subject-item">
                          {subject.trim()}
                        </div>
                      ))
                    : profile.subjectsTaught.split(',').map((subject, index) => (
                        <div key={index} className="subject-item">
                          {subject.trim()}
                        </div>
                      ))
                  }
                </div>
              ) : (
                <p>No subjects assigned</p>
              )}
            </div>

            {/* Today's Attendance Summary */}
            <div className="dashboard-section">
              <h3>Today's Attendance Summary</h3>
              <div className="attendance-stats-grid">
                <div className="stat-card present">
                  <h3>{todayAttendance.filter(a => a.status === 'present').length}</h3>
                  <p>Present Today</p>
                  <span className="percentage">
                    {todayAttendance.length > 0 ?
                      Math.round((todayAttendance.filter(a => a.status === 'present').length / todayAttendance.length) * 100) : 0}%
                  </span>
                </div>
                <div className="stat-card absent">
                  <h3>{todayAttendance.filter(a => a.status === 'absent').length}</h3>
                  <p>Absent Today</p>
                  <span className="percentage">
                    {todayAttendance.length > 0 ?
                      Math.round((todayAttendance.filter(a => a.status === 'absent').length / todayAttendance.length) * 100) : 0}%
                  </span>
                </div>
                <div className="stat-card total">
                  <h3>{todayAttendance.length}</h3>
                  <p>Total Students</p>
                </div>
                <div className="stat-card late">
                  <h3>{todayAttendance.filter(a => a.status === 'late').length}</h3>
                  <p>Late Today</p>
                  <span className="percentage">
                    {todayAttendance.length > 0 ?
                      Math.round((todayAttendance.filter(a => a.status === 'late').length / todayAttendance.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="section-content profile-section">
            <h2>Faculty Profile</h2>
            {profile ? (
              <div className="profile-card enhanced-profile-card">
                {profile && !isEditingProfile ? (
                  <>
                    <div className="profile-header">
                      <div className="profile-picture-section">
                        {profile.profilePicture ? (
                          <img src={`${BACKEND_BASE_URL}${profile.profilePicture}`} alt="Profile" className="profile-picture" />
                        ) : (
                          <div className="profile-picture-placeholder">
                            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="profile-basic-info">
                        <h3>{profile.fullName || profile.username}</h3>
                        <p className="designation">{profile.designation || 'Faculty'}</p>
                        <p className="department">{profile.department}</p>
                      </div>
                      <button className="btn-edit-profile" onClick={() => setIsEditingProfile(true)}>
                        Edit Profile
                      </button>
                    </div>

                    <div className="profile-details-grid">
                      <div className="profile-section">
                        <h4>Basic Information</h4>
                        <div className="detail-row">
                          <span className="label">Full Name:</span>
                          <span className="value">{profile.fullName || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Employee ID:</span>
                          <span className="value">{profile.employeeId || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Designation:</span>
                          <span className="value">{profile.designation || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Date of Joining:</span>
                          <span className="value">{profile.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString() : 'Not provided'}</span>
                        </div>
                      </div>

                      <div className="profile-section">
                        <h4>Contact Details</h4>
                        <div className="detail-row">
                          <span className="label">Official Email:</span>
                          <span className="value">{profile.officialEmail || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Mobile Number:</span>
                          <span className="value">{profile.mobileNumber || 'Not provided'}</span>
                        </div>
                      </div>

                      <div className="profile-section">
                        <h4>Documents</h4>
                        <div className="detail-row">
                          <span className="label">ID Proof:</span>
                          <span className="value">
                            {profile.idProof ? (
                              <a href={`${BACKEND_BASE_URL}/${profile.idProof}`} target="_blank" rel="noopener noreferrer">
                                View ID Proof
                              </a>
                            ) : 'Not uploaded'}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Qualification Certificates:</span>
                          <span className="value">
                            {profile.qualificationCertificates && profile.qualificationCertificates.length > 0 ? (
                              profile.qualificationCertificates.map((cert, index) => (
                                <div key={index}>
                                  <a href={`${BACKEND_BASE_URL}/${cert}`} target="_blank" rel="noopener noreferrer">
                                    Certificate {index + 1}
                                  </a>
                                </div>
                              ))
                            ) : 'Not uploaded'}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Appointment Letter:</span>
                          <span className="value">
                            {profile.appointmentLetter ? (
                              <a href={`${BACKEND_BASE_URL}/${profile.appointmentLetter}`} target="_blank" rel="noopener noreferrer">
                                View Appointment Letter
                              </a>
                            ) : 'Not uploaded'}
                          </span>
                        </div>
                      </div>

                    </div>
                  </>
                ) : (
                  <div className="profile-edit-form">
                    <h3>{profile ? 'Edit Profile' : 'Create Profile'}</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                      <div className="form-grid">
                        <div className="form-section">
                          <h4>Basic Information</h4>
                          <div className="form-group">
                            <label>Full Name:</label>
                            <input
                              type="text"
                              value={profileForm.fullName}
                              onChange={(e) => handleProfileFormChange('fullName', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Employee ID:</label>
                            <input
                              type="text"
                              value={profileForm.employeeId}
                              onChange={(e) => handleProfileFormChange('employeeId', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Department:</label>
                            <select
                              value={profileForm.department}
                              onChange={(e) => handleProfileFormChange('department', e.target.value)}
                              required
                            >
                              <option value="">Select Department</option>
                              <option value="B.A">B.A</option>
                              <option value="B.Sc">B.Sc</option>
                              <option value="B.Ed">B.Ed</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Designation:</label>
                            <input
                              type="text"
                              value={profileForm.designation}
                              onChange={(e) => handleProfileFormChange('designation', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Date of Joining:</label>
                            <input
                              type="date"
                              value={profileForm.dateOfJoining}
                              onChange={(e) => handleProfileFormChange('dateOfJoining', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form-section">
                          <h4>Contact Details</h4>
                          <div className="form-group">
                            <label>Official Email:</label>
                            <input
                              type="email"
                              value={profileForm.officialEmail}
                              onChange={(e) => handleProfileFormChange('officialEmail', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Mobile Number:</label>
                            <input
                              type="tel"
                              value={profileForm.mobileNumber}
                              onChange={(e) => handleProfileFormChange('mobileNumber', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-section full-width">
                          <h4>Profile Picture & Documents</h4>
                          <div className="file-upload-section">
                            <div className="form-group">
                              <label>Profile Picture:</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange('profilePicture', e.target.files[0])}
                              />
                            </div>
                            <div className="form-group">
                              <label>ID Proof:</label>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange('idProof', e.target.files[0])}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Qualification Certificates (up to 5 files):</label>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files);
                                  setDocumentFiles(prev => ({
                                    ...prev,
                                    qualificationCertificates: files
                                  }));
                                }}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Appointment Letter:</label>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => handleFileChange('appointmentLetter', e.target.files[0])}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-save" disabled={profileLoading}>
                          {profileLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="profile-card enhanced-profile-card">
                <div className="create-profile-section">
                  <h3>Welcome! Let's create your faculty profile</h3>
                  <p>Please fill in your profile information to get started.</p>
                  <button
                    className="btn-create-profile"
                    onClick={() => {
                      setIsCreatingProfile(true);
                      setIsEditingProfile(true);
                      // Initialize form with empty values for creation
                      setProfileForm({
                        fullName: '',
                        employeeId: '',
                        department: '',
                        designation: '',
                        dateOfJoining: '',
                        officialEmail: '',
                        mobileNumber: '',
                        officeRoom: '',
                        subjectsTaught: [],
                        teachingExperience: '',
                        specialization: [],
                        researchInterests: [],
                        publications: [],
                        certifications: [],
                        achievements: [],
                        administrativeRoles: [],
                        weeklyTimetable: {},
                        leaveRecords: [],
                        shortBio: '',
                        officeHours: '',
                      });
                    }}
                  >
                    Create Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'results':
        return (
          <div className="section-content">
            <h2>Results</h2>

            {/* Results List */}
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result._id}>
                    <td>{result.studentId}</td>
                    <td>{result.subject}</td>
                    <td>{result.marks}</td>
                    <td>{result.grade}</td>
                    <td>
                      <button onClick={() => setEditingResult(result)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'noticeboard':
        return (
          <div className="section-content">
            <h2>Noticeboard</h2>

            {/* Create Notice */}
            <form onSubmit={handleCreateNotice} className="notice-form">
              <h3>Create Notice</h3>
              <input
                type="text"
                placeholder="Title"
                value={newNotice.title}
                onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Content"
                value={newNotice.content}
                onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                required
              />
              <select
                value={newNotice.priority}
                onChange={(e) => setNewNotice({...newNotice, priority: e.target.value})}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button type="submit">Create Notice</button>
            </form>

            {/* Notices */}
            <h3>Notices</h3>
            <div className="notices-list">
              {notices.map(notice => (
                <div key={notice._id} className={`notice-card priority-${notice.priority}`}>
                  <h4>{notice.title}</h4>
                  <p>{notice.content}</p>
                  <small>Posted: {new Date(notice.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        );
      case 'fees':
        return (
          <div className="section-content">
            <h2>Fee Management & Reports</h2>

            {/* Bulk Upload Fees */}
            <div className="bulk-upload-section">
              <h3>Bulk Upload Fees</h3>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setBulkUploadFile(e.target.files[0])}
              />
              <button onClick={() => handleBulkUpload('fees')}>Upload Fees</button>
            </div>

            {/* Generate Report */}
            <div className="report-section">
              <h3>Generate Reports</h3>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="attendance">Attendance Report</option>
                <option value="fees">Fee Report</option>
                <option value="results">Result Report</option>
              </select>
              {reportType === 'attendance' && profile && profile.subjectsTaught && (
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  <option value="">All Subjects</option>
                  {Array.isArray(profile.subjectsTaught) 
                    ? profile.subjectsTaught.map((subject, index) => (
                        <option key={index} value={subject.trim()}>{subject.trim()}</option>
                      ))
                    : profile.subjectsTaught.split(',').map((subject, index) => (
                        <option key={index} value={subject.trim()}>{subject.trim()}</option>
                      ))
                  }
                </select>
              )}
              <button onClick={generateReport}>Generate Report</button>
            </div>

            {/* Add/Edit Fee Form */}
            <form onSubmit={editingFee ? handleUpdateFee : handleCreateFee} className="fee-form">
              <h3>{editingFee ? 'Update Fee Record' : 'Add Fee Record'}</h3>
              <input
                type="text"
                placeholder="Student ID"
                value={editingFee ? editingFee.studentId : newFee.studentId}
                onChange={(e) => editingFee ?
                  setEditingFee({...editingFee, studentId: e.target.value}) :
                  setNewFee({...newFee, studentId: e.target.value})
                }
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={editingFee ? editingFee.amount : newFee.amount}
                onChange={(e) => editingFee ?
                  setEditingFee({...editingFee, amount: e.target.value}) :
                  setNewFee({...newFee, amount: e.target.value})
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={editingFee ? editingFee.description : newFee.description}
                onChange={(e) => editingFee ?
                  setEditingFee({...editingFee, description: e.target.value}) :
                  setNewFee({...newFee, description: e.target.value})
                }
                required
              />
              <input
                type="date"
                value={editingFee ? editingFee.dueDate : newFee.dueDate}
                onChange={(e) => editingFee ?
                  setEditingFee({...editingFee, dueDate: e.target.value}) :
                  setNewFee({...editingFee, dueDate: e.target.value})
                }
                required
              />
              <div className="form-actions">
                <button type="submit">{editingFee ? 'Update' : 'Add'} Fee Record</button>
                {editingFee && <button type="button" onClick={() => setEditingFee(null)}>Cancel</button>}
              </div>
            </form>

            {/* Fees List */}
            <h3>Fee Records</h3>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <tr key={fee._id}>
                    <td>{fee.studentId}</td>
                    <td>${fee.amount}</td>
                    <td>{fee.description}</td>
                    <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td>{fee.status || 'Pending'}</td>
                    <td>
                      <button onClick={() => setEditingFee(fee)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'documents':
        return (
          <div className="section-content">
            <h2>Document Approval & Verification</h2>

            {/* Show warning if profile is incomplete */}
            {(!profile || !profile.department) && (
              <div className="warning-message" style={{backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', padding: '10px', marginBottom: '20px', borderRadius: '5px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={{fontSize: '20px'}}>⚠️</span>
                  <div>
                    <strong>Profile Incomplete:</strong> Complete your profile to see department-specific documents.
                    <button
                      style={{marginLeft: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer'}}
                      onClick={() => setActiveSection('profile')}
                    >
                      Complete Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents List */}
            <h3>Student Documents</h3>
            {(documents.length === 0 && personalDocuments.length === 0) ? (
              <div className="no-data-message">
                <div className="message-icon">📄</div>
                <h3>No Documents Found</h3>
                <p>No student documents are available at this time.</p>
              </div>
            ) : (
              <div className="documents-table-container">
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Document Type</th>
                      <th>File Size</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th>Uploaded Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Show API documents first */}
                    {(documents.data || documents).map(student => (
                      student.documents.map((doc, index) => (
                        <tr key={doc._id}>
                          {index === 0 && (
                            <td rowSpan={student.documents.length}>{student.studentName}</td>
                          )}
                          <td>{doc.documentType}</td>
                          <td>{(doc.fileSize / 1024).toFixed(2)} KB</td>
                          <td>
                            <span className={`status-badge ${doc.status}`}>{doc.status}</span>
                          </td>
                          <td>{doc.remarks || 'N/A'}</td>
                          <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                          <td>
                            <button
                              className="btn-approve"
                              onClick={() => handleApproveDocument(doc._id, 'verified')}
                              disabled={doc.status === 'verified'}
                            >
                              {doc.status === 'verified' ? 'Approved' : 'Approve'}
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleApproveDocument(doc._id, 'rejected')}
                              disabled={doc.status === 'rejected'}
                            >
                              {doc.status === 'rejected' ? 'Rejected' : 'Reject'}
                            </button>
                            <button
                              className="btn-download"
                              onClick={() => handleDownloadDocument(doc._id, doc.originalName)}
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ))}
                    {/* Show personal documents if no API documents */}
                    {documents.length === 0 && personalDocuments.map((doc, index) => (
                      <tr key={`personal-${index}`}>
                        <td>Sample Student</td>
                        <td>{doc.documentType}</td>
                        <td>{doc.fileSize}</td>
                        <td>
                          <span className={`status-badge ${doc.status}`}>{doc.status}</span>
                        </td>
                        <td>{doc.remarks}</td>
                        <td>{doc.uploadedAt}</td>
                        <td>
                          <button
                            className="btn-approve"
                            disabled={doc.status === 'verified'}
                          >
                            {doc.status === 'verified' ? 'Approved' : 'Approve'}
                          </button>
                          <button
                            className="btn-reject"
                            disabled={doc.status === 'rejected'}
                          >
                            {doc.status === 'rejected' ? 'Rejected' : 'Reject'}
                          </button>
                          <button
                            className="btn-download"
                            onClick={() => handleDownloadPersonalDocument(doc.fileUrl, doc.originalName)}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'study-materials':
        return (
          <div className="section-content">
            <h2>Study Materials</h2>

            {/* Upload Study Material */}
            <form onSubmit={handleUploadStudyMaterial} className="upload-form">
              <h3>Upload Study Material</h3>
              <input
                type="text"
                placeholder="Title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
              />
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>

            {/* Study Materials List */}
            <h3>Uploaded Study Materials</h3>
            <div className="study-materials-list">
              {studyMaterials.map(material => (
                <div key={material._id} className="study-material-card">
                  <h4>{material.title}</h4>
                  <p>{material.description}</p>
                  <small>Uploaded: {new Date(material.createdAt).toLocaleDateString()}</small>
                  <div className="material-actions">
                    <a href={`${BACKEND_BASE_URL}${material.fileUrl}`} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                    <button onClick={() => handleDeleteStudyMaterial(material._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      // Other sections like admissions, student-profiles, notifications, attendance, etc. can be added similarly
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="faculty-dashboard-container">
      <header className="dashboard-header">
        <h1>Faculty Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => setActiveSection('dashboard')}>Dashboard</li>
          <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>Profile</li>
          <li className={activeSection === 'results' ? 'active' : ''} onClick={() => setActiveSection('results')}>Results</li>
          <li className={activeSection === 'noticeboard' ? 'active' : ''} onClick={() => setActiveSection('noticeboard')}>Noticeboard</li>
          <li className={activeSection === 'fees' ? 'active' : ''} onClick={() => setActiveSection('fees')}>Fees</li>
          <li className={activeSection === 'documents' ? 'active' : ''} onClick={() => setActiveSection('documents')}>Documents</li>
          <li className={activeSection === 'study-materials' ? 'active' : ''} onClick={() => setActiveSection('study-materials')}>Study Materials</li>
          {/* Add other navigation items as needed */}
        </ul>
      </nav>

      <main className="dashboard-main">
        {loading ? <p>Loading...</p> : error ? <p className="error">{error}</p> : renderSection()}
      </main>
    </div>
  );
}

export default FacultyDashboardPage;
