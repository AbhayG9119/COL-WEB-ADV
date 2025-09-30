import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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
import '../styles/StudentDashboard.css'; // Reuse student dashboard styles


const BACKEND_BASE_URL = 'http://localhost:5000';

// Predefined subjects for college courses
const PREDEFINED_SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "History",
  "Computer Science", "Economics", "Accounting", "Business Studies",
  "Statistics", "Geography", "Political Science", "Sociology", "Psychology",
  "Philosophy", "Hindi", "Sanskrit"
];

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', venue: '', organizer: '' });




  // Enhanced Dashboard States
  const [totals, setTotals] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalEvents: 0,
    totalNotices: 0
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);

  // Attendance-related states
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentsForClass, setStudentsForClass] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceDraft, setAttendanceDraft] = useState({});
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();

  // New state variables for enhanced sections
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notices, setNotices] = useState([]);

  const [newResult, setNewResult] = useState({ studentId: '', subject: '', marks: '', grade: '' });
  const [newFee, setNewFee] = useState({ studentId: '', amount: '', description: '', dueDate: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal' });

  const [editingResult, setEditingResult] = useState(null);
  const [editingFee, setEditingFee] = useState(null);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [reportType, setReportType] = useState('attendance');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    // Contact Details (editable fields for faculty)
    fullName: '',
    officialEmail: '',
    mobileNumber: '',
    address: '',

    // Professional Details
    department: '',
    designation: '',
    subjectsTaught: [],
    teachingExperience: '',
    dateOfJoining: '',

    // Administrative Roles
    administrativeRoles: [],

    // Attendance & Schedule
    weeklyTimetable: {},
    leaveRecords: [],

    status: 'active',
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

    if (!token || role !== 'faculty') {
      navigate('/login');
      return;
    }

    // Check token expiration
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn('Token expired, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
        return;
      }
    } catch (err) {
      console.error('Failed to decode token:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
      return;
    }

    // Setup axios interceptor for 401 errors
    const interceptorId = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          console.warn('401 Unauthorized detected, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    fetchData();

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

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

      // Load new data for enhanced sections
      await loadEnhancedData();

      // Load enhanced dashboard data
      await loadEnhancedDashboardData();
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
  };

  const loadFacultyProfile = async () => {
    try {
      const profileResponse = await facultyApi.getProfile();
      console.log('Profile response:', profileResponse.data);
      setProfile(profileResponse.data);
      // Initialize form with current profile data (only editable fields for faculty)
      setProfileForm({
        fullName: profileResponse.data.fullName || '',
        officialEmail: profileResponse.data.officialEmail || profileResponse.data.email || '',
        mobileNumber: profileResponse.data.mobileNumber || '',
        employeeId: profileResponse.data.employeeId || '',
        department: profileResponse.data.department || '',
        designation: profileResponse.data.designation || '',
        dateOfJoining: profileResponse.data.dateOfJoining ? new Date(profileResponse.data.dateOfJoining).toISOString().split('T')[0] : '',
        address: profileResponse.data.address || '',
        subjectsTaught: Array.isArray(profileResponse.data.subjectsTaught) ? profileResponse.data.subjectsTaught : [],
        teachingExperience: profileResponse.data.teachingExperience || '',
        administrativeRoles: Array.isArray(profileResponse.data.administrativeRoles) ? profileResponse.data.administrativeRoles : [],
        weeklyTimetable: profileResponse.data.weeklyTimetable || {},
        leaveRecords: Array.isArray(profileResponse.data.leaveRecords) ? profileResponse.data.leaveRecords : [],
        status: profileResponse.data.status || 'active',
      });
    } catch (err) {
      console.log('Failed to load faculty profile:', err);
      // No profile exists, set to null to trigger create profile mode
      setProfile(null);
      setIsCreatingProfile(true);
    }
  };

  const loadEnhancedData = async () => {
    try {
      const [resultsRes, feesRes, documentsRes, noticesRes] = await Promise.all([
        facultyApi.getResults(),
        facultyApi.getFees(),
        facultyApi.getDocuments(),
        facultyApi.getNotices()
      ]);

      setResults(resultsRes.data);
      setFees(feesRes.data);
      setDocuments(documentsRes.data);
      setNotices(noticesRes.data);
    } catch (err) {
      console.log('Some enhanced data failed to load:', err);
    }
  };



  const loadEnhancedDashboardData = async () => {
    try {
      // Load totals
      const totalsResponse = await facultyApi.getDashboardTotals();
      setTotals(totalsResponse.data);

      // Load performance data
      const performanceResponse = await facultyApi.getPerformanceData();
      setPerformanceData(performanceResponse.data);

      // Load recent notices (last 5)
      const noticesResponse = await facultyApi.getRecentNotices();
      setRecentNotices(noticesResponse.data);
    } catch (err) {
      console.log('Some enhanced dashboard data failed to load:', err);
      // Set defaults on error to prevent UI breakage
      setPerformanceData([]);
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

  const handleCreateProfile = async () => {
    setProfileLoading(true);
    try {
      // Create profile data using updateProfile since faculty exists
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

      setIsCreatingProfile(false);
      setProfilePictureFile(null);
      setDocumentFiles({
        idProof: null,
        qualificationCertificates: [],
        appointmentLetter: null
      });
      alert('Profile created successfully!');
    } catch (err) {
      setError('Failed to create profile');
    }
    setProfileLoading(false);
  };

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    try {
      // Update profile data (text fields)
      await facultyApi.updateProfile(profileForm);

      // Upload profile picture if selected
      if (profilePictureFile) {
        await facultyApi.uploadProfilePicture(profilePictureFile);
      }

      // Upload documents if selected
      if (documentFiles.idProof || documentFiles.qualificationCertificates.length > 0 || documentFiles.appointmentLetter) {
        await facultyApi.uploadDocuments(documentFiles);
      }

      // Reload profile to get updated data
      await loadFacultyProfile();

      setIsEditingProfile(false);
      setProfilePictureFile(null);
      setDocumentFiles({
        idProof: null,
        qualificationCertificates: [],
        appointmentLetter: null
      });
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
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

  // Attendance-related functions
  const loadAssignedClasses = async () => {
    try {
      const response = await facultyApi.getAssignedClasses();
      setAssignedClasses(response.data);
    } catch (err) {
      console.log('Failed to load assigned classes:', err);
      // Fallback to profile subjects if API fails
      if (profile && profile.subjectsTaught) {
        setAssignedClasses(Array.isArray(profile.subjectsTaught) ? profile.subjectsTaught : profile.subjectsTaught.split(','));
      }
    }
  };

  const loadStudentsForClass = async (classId, subjectId) => {
    if (!classId || !subjectId) {
      setStudentsForClass([]);
      return;
    }
    try {
      const response = await facultyApi.getStudentsForClass(classId, subjectId);
      setStudentsForClass(response.data);
      // Initialize attendance draft with all students as absent
      const draft = {};
      response.data.forEach(student => {
        draft[student._id] = 'absent';
      });
      setAttendanceDraft(draft);
    } catch (err) {
      console.log('Failed to load students for class and subject:', err);
      setStudentsForClass([]);
    }
  };

  const loadAttendanceHistory = async (classId, subjectId) => {
    if (!classId || !subjectId) {
      setAttendanceRecords([]);
      return;
    }
    try {
      const response = await facultyApi.getAttendanceHistory(classId, subjectId);
      setAttendanceRecords(response.data);
    } catch (err) {
      console.log('Failed to load attendance history:', err);
      setAttendanceRecords([]);
    }
  };

  const loadAttendanceForDate = async (date, subject, classId) => {
    if (!date || !subject || !classId) {
      setAttendanceRecords([]);
      return;
    }
    try {
      const response = await facultyApi.getAttendance(classId, subject, { date });
      setAttendanceRecords(response.data);
      // Update draft with existing records
      const draft = { ...attendanceDraft };
      response.data.forEach(record => {
        draft[record.studentId] = record.status;
      });
      setAttendanceDraft(draft);
    } catch (err) {
      console.log('Failed to load attendance for date:', err);
      setAttendanceRecords([]);
    }
  };

  const updateAttendanceDraft = (studentId, status) => {
    setAttendanceDraft(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = async () => {
    setAttendanceLoading(true);
    setAttendanceError('');
    try {
      const attendanceData = Object.entries(attendanceDraft).map(([studentId, status]) => ({
        studentId,
        subject: selectedSubject,
        date: selectedDate,
        classId: selectedClass,
        status
      }));

      if (isEditMode) {
        await facultyApi.bulkEditAttendance(selectedClass, selectedSubject, attendanceData);
      } else {
        await facultyApi.markAttendance(attendanceData);
      }

      alert('Attendance saved successfully!');
      // Reload attendance records
      await loadAttendanceForDate(selectedDate, selectedSubject, selectedClass);
      setIsEditMode(false);
    } catch (err) {
      setAttendanceError('Failed to save attendance');
      console.log('Save attendance error:', err);
    }
    setAttendanceLoading(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Entering edit mode - load existing records
      loadAttendanceForDate(selectedDate, selectedSubject, selectedClass);
    } else {
      // Exiting edit mode - reset draft
      loadStudentsForClass(selectedClass, selectedSubject);
    }
  };

  const calculateSummary = () => {
    const total = studentsForClass.length;
    const present = Object.values(attendanceDraft).filter(status => status === 'present').length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  };

  // Load attendance data when section changes or dependencies change
  useEffect(() => {
    if (activeSection === 'attendance') {
      loadAssignedClasses();
    }
  }, [activeSection, profile]);

  useEffect(() => {
    if (activeSection === 'attendance' && selectedClass && selectedSubject) {
      loadStudentsForClass(selectedClass, selectedSubject);
    }
  }, [selectedClass, selectedSubject, activeSection]);

  useEffect(() => {
    if (activeSection === 'attendance' && selectedDate && selectedSubject && selectedClass) {
      if (isEditMode || new Date(selectedDate) < new Date()) {
        loadAttendanceForDate(selectedDate, selectedSubject, selectedClass);
      }
    }
  }, [selectedDate, selectedSubject, selectedClass, isEditMode, activeSection]);

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


          </div>
        );
      case 'profile':
        return (
          <div className="section-content">
            <div className="faculty-details-header">
              <h2>Faculty Profile</h2>
            </div>
            {profile ? (
              <div className="faculty-details-container">
                <div className="faculty-details-grid">
                  <div className={`detail-card ${isEditingProfile ? 'editing' : ''}`}>
                    <h3>Personal Information</h3>
                    <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                      {isEditingProfile ? (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('profilePicture', e.target.files[0])}
                        />
                      ) : (
                        profile.profilePicture ? (
                          <img src={`${BACKEND_BASE_URL}/uploads/profile-pictures/${profile.profilePicture}`} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                        ) : (
                          <span>No profile picture uploaded</span>
                        )
                      )}
                    </div>
                    {(isEditingProfile || profile.fullName) && (
                      <div className="detail-row">
                        <label>Full Name:</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => handleProfileFormChange('fullName', e.target.value)}
                          />
                        ) : (
                          <span>{profile.fullName}</span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || profile.officialEmail || profile.email) && (
                      <div className="detail-row">
                        <label>Email:</label>
                        {isEditingProfile ? (
                          <input
                            type="email"
                            value={profileForm.officialEmail}
                            onChange={(e) => handleProfileFormChange('officialEmail', e.target.value)}
                          />
                        ) : (
                          <span>{profile.officialEmail || profile.email}</span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || profile.mobileNumber) && (
                      <div className="detail-row">
                        <label>Mobile Number:</label>
                        {isEditingProfile ? (
                          <input
                            type="tel"
                            value={profileForm.mobileNumber}
                            onChange={(e) => handleProfileFormChange('mobileNumber', e.target.value)}
                          />
                        ) : (
                          <span>{profile.mobileNumber}</span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || profile.dateOfJoining) && (
                      <div className="detail-row">
                        <label>Date of Joining:</label>
                        {isEditingProfile ? (
                          <input
                            type="date"
                            value={profileForm.dateOfJoining}
                            onChange={(e) => handleProfileFormChange('dateOfJoining', e.target.value)}
                          />
                        ) : (
                          <span>{new Date(profile.dateOfJoining).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || profile.address) && (
                      <div className="detail-row">
                        <label>Address: </label>
                        {isEditingProfile ? (
                          <textarea
                            value={profileForm.address}
                            onChange={(e) => handleProfileFormChange('address', e.target.value)}
                            rows="3"
                          />
                        ) : (
                          <span>{profile.address}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`detail-card ${isEditingProfile ? 'editing' : ''}`}>
                    <h3>Professional Information</h3>
                    {(isEditingProfile || profile.department) && (
                      <div className="detail-row">
                        <label>Department:</label>
                        {isEditingProfile ? (
                          <select
                            value={profileForm.department}
                            onChange={(e) => handleProfileFormChange('department', e.target.value)}
                          >
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="History">History</option>
                            <option value="English">English</option>
                          </select>
                        ) : (
                          <span>{profile.department}</span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || profile.designation) && (
                      <div className="detail-row">
                        <label>Designation:</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileForm.designation}
                            onChange={(e) => handleProfileFormChange('designation', e.target.value)}
                          />
                        ) : (
                          <span>{profile.designation}</span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || (profile.subjectsTaught && profile.subjectsTaught.length > 0)) && (
                      <div className="detail-row">
                        <label>Subjects Taught:</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileForm.subjectsTaught.join(', ')}
                            onChange={(e) => handleArrayFieldChange('subjectsTaught', e.target.value)}
                            placeholder="Comma-separated subjects"
                          />
                        ) : (
                          <span>{Array.isArray(profile.subjectsTaught) ? profile.subjectsTaught.join(', ') : profile.subjectsTaught}</span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || profile.teachingExperience) && (
                      <div className="detail-row">
                        <label>Teaching Experience:</label>
                        {isEditingProfile ? (
                          <input
                            type="number"
                            value={profileForm.teachingExperience}
                            onChange={(e) => handleProfileFormChange('teachingExperience', e.target.value)}
                            placeholder="Years"
                          />
                        ) : (
                          <span>{`${profile.teachingExperience} years`}</span>
                        )}
                      </div>
                    )}
                    <div className="detail-row">
                      <label>Status:</label>
                      {isEditingProfile ? (
                        <select
                          value={profileForm.status}
                          onChange={(e) => handleProfileFormChange('status', e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on-leave">On Leave</option>
                        </select>
                      ) : (
                        <span>{profile.status || 'active'}</span>
                      )}
                    </div>
                  </div>

                  <div className={`detail-card ${isEditingProfile ? 'editing' : ''}`}>
                    <h3>Documents & Certifications</h3>
                    {(isEditingProfile || profile.idProof) && (
                      <div className="detail-row">
                        <label>ID Proof:</label>
                        {isEditingProfile ? (
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('idProof', e.target.files[0])}
                          />
                        ) : (
                          <span>
                            <a href={`${BACKEND_BASE_URL}/${profile.idProof}`} target="_blank" rel="noopener noreferrer">
                              View ID Proof
                            </a>
                          </span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || (profile.qualificationCertificates && profile.qualificationCertificates.length > 0)) && (
                      <div className="detail-row">
                        <label>Qualification Certificates:</label>
                        {isEditingProfile ? (
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
                          />
                        ) : (
                          <span>
                            {profile.qualificationCertificates.map((cert, index) => (
                              <div key={index}>
                                <a href={`${BACKEND_BASE_URL}/${cert}`} target="_blank" rel="noopener noreferrer">
                                  Certificate {index + 1}
                                </a>
                              </div>
                            ))}
                          </span>
                        )}
                      </div>
                    )}
                    {(isEditingProfile || profile.appointmentLetter) && (
                      <div className="detail-row">
                        <label>Appointment Letter:</label>
                        {isEditingProfile ? (
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => handleFileChange('appointmentLetter', e.target.files[0])}
                          />
                        ) : (
                          <span>
                            <a href={`${BACKEND_BASE_URL}/${profile.appointmentLetter}`} target="_blank" rel="noopener noreferrer">
                              View Appointment Letter
                            </a>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="faculty-actions">
                  {isEditingProfile ? (
                    <>
                      <button className="btn-primary" onClick={handleSaveProfile} disabled={profileLoading}>
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button className="btn-danger" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn-secondary" onClick={() => setIsEditingProfile(true)}>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            ) : isCreatingProfile ? (
              <div className="faculty-details-container">
                <div className="faculty-details-grid">
                  <div className="detail-card editing">
                    <h3>Personal Information</h3>
                    <div className="detail-row">
                      <label>Full Name:</label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => handleProfileFormChange('fullName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="detail-row">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={profileForm.officialEmail}
                        onChange={(e) => handleProfileFormChange('officialEmail', e.target.value)}
                        required
                      />
                    </div>
                    <div className="detail-row">
                      <label>Mobile Number:</label>
                      <input
                        type="tel"
                        value={profileForm.mobileNumber}
                        onChange={(e) => handleProfileFormChange('mobileNumber', e.target.value)}
                      />
                    </div>
                    <div className="detail-row">
                      <label>Date of Joining:</label>
                      <input
                        type="date"
                        value={profileForm.dateOfJoining}
                        onChange={(e) => handleProfileFormChange('dateOfJoining', e.target.value)}
                        required
                      />
                    </div>
                    <div className="detail-row">
                      <label>Address:</label>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => handleProfileFormChange('address', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="detail-card editing">
                    <h3>Professional Information</h3>
                    <div className="detail-row">
                      <label>Department:</label>
                      <select
                        value={profileForm.department}
                        onChange={(e) => handleProfileFormChange('department', e.target.value)}
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="History">History</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                    <div className="detail-row">
                      <label>Designation:</label>
                      <input
                        type="text"
                        value={profileForm.designation}
                        onChange={(e) => handleProfileFormChange('designation', e.target.value)}
                        required
                      />
                    </div>
                    <div className="detail-row">
                      <label>Subjects Taught:</label>
                      <input
                        type="text"
                        value={profileForm.subjectsTaught.join(', ')}
                        onChange={(e) => handleArrayFieldChange('subjectsTaught', e.target.value)}
                        placeholder="Comma-separated subjects"
                        required
                      />
                    </div>
                    <div className="detail-row">
                      <label>Teaching Experience:</label>
                      <input
                        type="number"
                        value={profileForm.teachingExperience}
                        onChange={(e) => handleProfileFormChange('teachingExperience', e.target.value)}
                        placeholder="Years"
                      />
                    </div>
                  </div>

                  <div className="detail-card editing">
                    <h3>Documents & Certifications</h3>
                    <div className="detail-row">
                      <label>ID Proof:</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('idProof', e.target.files[0])}
                      />
                    </div>
                    <div className="detail-row">
                      <label>Qualification Certificates:</label>
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
                      />
                    </div>
                    <div className="detail-row">
                      <label>Appointment Letter:</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleFileChange('appointmentLetter', e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
                <div className="faculty-actions">
                  <button className="btn-primary" onClick={handleCreateProfile} disabled={profileLoading}>
                    {profileLoading ? 'Creating...' : 'Create Profile'}
                  </button>
                  <button className="btn-danger" onClick={() => setIsCreatingProfile(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        );
      case 'attendance':
        return (
          <div className="section-content">
            <h2>Mark Attendance</h2>
            {attendanceError && <p className="error">{attendanceError}</p>}

            {/* Controls */}
            <div className="attendance-controls">
              <div className="control-group">
                <label>Select Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {PREDEFINED_SUBJECTS.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Select Course:</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select Course</option>
                  <option value="ba">BA</option>
                  <option value="bsc">BSc</option>
                  <option value="bcom">BCom</option>
                  <option value="ma">MA</option>
                  <option value="msc">MSc</option>
                  <option value="mcom">MCom</option>
                </select>
              </div>

              <div className="control-group">
                <label>Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {new Date(selectedDate) < new Date() && (
                <div className="control-group">
                  <button
                    className={`btn-edit-mode ${isEditMode ? 'active' : ''}`}
                    onClick={toggleEditMode}
                  >
                    {isEditMode ? 'Exit Edit Mode' : 'Edit Past Attendance'}
                  </button>
                </div>
              )}
            </div>

            {/* Summary Card */}
            {studentsForClass.length > 0 && (
              <div className="attendance-summary">
                <h3>Attendance Summary</h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Students:</span>
                    <span className="stat-value">{calculateSummary().total}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Present:</span>
                    <span className="stat-value present">{calculateSummary().present}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Absent:</span>
                    <span className="stat-value absent">{calculateSummary().absent}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Percentage:</span>
                    <span className="stat-value">{calculateSummary().percentage}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Table */}
            {studentsForClass.length > 0 ? (
              <div className="attendance-table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsForClass.map(student => (
                      <tr key={student._id}>
                        <td>{student.username}</td>
                        <td>{student.fullName || 'N/A'}</td>
                        <td>
                          <div className="attendance-status-controls">
                            <label>
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="present"
                                checked={attendanceDraft[student._id] === 'present'}
                                onChange={() => updateAttendanceDraft(student._id, 'present')}
                              />
                              Present
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="absent"
                                checked={attendanceDraft[student._id] === 'absent'}
                                onChange={() => updateAttendanceDraft(student._id, 'absent')}
                              />
                              Absent
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="late"
                                checked={attendanceDraft[student._id] === 'late'}
                                onChange={() => updateAttendanceDraft(student._id, 'late')}
                              />
                              Late
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selectedClass && selectedSubject ? (
              <p>No students found for the selected class and subject.</p>
            ) : (
              <p>Please select a class and subject to view students.</p>
            )}

            {/* Action Buttons */}
            {studentsForClass.length > 0 && (
              <div className="attendance-actions">
                <button
                  className="btn-save-attendance"
                  onClick={saveAttendance}
                  disabled={attendanceLoading}
                >
                  {attendanceLoading ? 'Saving...' : 'Save Attendance'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    // Reset draft to initial state
                    loadStudentsForClass(selectedClass, selectedSubject);
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        );
      case 'results':
        return (
          <div className="section-content">
            <h2>Result Management</h2>

            {/* Bulk Upload Marks */}
            <div className="bulk-upload-section">
              <h3>Bulk Upload Marks</h3>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setBulkUploadFile(e.target.files[0])}
              />
              <button onClick={() => handleBulkUpload('marks')}>Upload Marks</button>
            </div>

            {/* Upload Marks Form */}
            <form onSubmit={editingResult ? handleUpdateMarks : handleUploadMarks} className="result-form">
              <h3>{editingResult ? 'Update Marks' : 'Upload Marks'}</h3>
              <input
                type="text"
                placeholder="Student ID"
                value={editingResult ? editingResult.studentId : newResult.studentId}
                onChange={(e) => editingResult ?
                  setEditingResult({ ...editingResult, studentId: e.target.value }) :
                  setNewResult({ ...newResult, studentId: e.target.value })
                }
                required
              />
              <select
                value={editingResult ? editingResult.subject : newResult.subject}
                onChange={(e) => editingResult ?
                  setEditingResult({ ...editingResult, subject: e.target.value }) :
                  setNewResult({ ...newResult, subject: e.target.value })
                }
                required
              >
                <option value="">Select Subject</option>
                {PREDEFINED_SUBJECTS.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Marks"
                value={editingResult ? editingResult.marks : newResult.marks}
                onChange={(e) => editingResult ?
                  setEditingResult({ ...editingResult, marks: e.target.value }) :
                  setNewResult({ ...newResult, marks: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Grade"
                value={editingResult ? editingResult.grade : newResult.grade}
                onChange={(e) => editingResult ?
                  setEditingResult({ ...editingResult, grade: e.target.value }) :
                  setNewResult({ ...newResult, grade: e.target.value })
                }
              />
              <div className="form-actions">
                <button type="submit">{editingResult ? 'Update' : 'Upload'} Marks</button>
                {editingResult && <button type="button" onClick={() => setEditingResult(null)}>Cancel</button>}
              </div>
            </form>

            {/* Results List */}
            <h3>Results</h3>
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
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Content"
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                required
              />
              <select
                value={newNotice.priority}
                onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
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
              {reportType === 'attendance' && (
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  <option value="">All Subjects</option>
                  {PREDEFINED_SUBJECTS.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
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
                  setEditingFee({ ...editingFee, studentId: e.target.value }) :
                  setNewFee({ ...newFee, studentId: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={editingFee ? editingFee.amount : newFee.amount}
                onChange={(e) => editingFee ?
                  setEditingFee({ ...editingFee, amount: e.target.value }) :
                  setNewFee({ ...newFee, amount: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={editingFee ? editingFee.description : newFee.description}
                onChange={(e) => editingFee ?
                  setEditingFee({ ...editingFee, description: e.target.value }) :
                  setNewFee({ ...newFee, description: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={editingFee ? editingFee.dueDate : newFee.dueDate}
                onChange={(e) => editingFee ?
                  setEditingFee({ ...editingFee, dueDate: e.target.value }) :
                  setNewFee({ ...newFee, dueDate: e.target.value })
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

            {/* Documents List */}
            <h3>Pending Documents</h3>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Document Type</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.filter(doc => doc.status === 'pending').map(doc => (
                  <tr key={doc._id}>
                    <td>{doc.studentId}</td>
                    <td>{doc.documentType}</td>
                    <td>{new Date(doc.submittedDate).toLocaleDateString()}</td>
                    <td>{doc.status}</td>
                    <td>
                      <button onClick={() => handleApproveDocument(doc._id, 'approved')}>Approve</button>
                      <button onClick={() => handleApproveDocument(doc._id, 'rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'events':
        return (
          <div className="section-content">
            <h2>Event Management</h2>

            {/* Create Event */}
            <form onSubmit={handleCreateEvent} className="event-form">
              <h3>Propose New Event</h3>
              <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
              <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} required />
              <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
              <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} required />
              <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} required />
              <input type="text" placeholder="Organizer" value={newEvent.organizer} onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })} required />
              <button type="submit">Propose Event</button>
            </form>

            {/* Events */}
            <h3>Proposed Events</h3>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.time}</td>
                    <td>{event.venue}</td>
                    <td>{event.status}</td>
                    <td>
                      <button onClick={() => facultyApi.approveEvent(event._id, 'approved')}>Approve</button>
                      <button onClick={() => facultyApi.approveEvent(event._id, 'rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'notifications':
        return (
          <div className="section-content">
            <h2>Notifications</h2>

            {/* Notification Tabs */}
            <div className="notification-tabs">
              <button
                className={`tab-button ${notificationTab === 'send' ? 'active' : ''}`}
                onClick={() => setNotificationTab('send')}
              >
                Send Notification
              </button>
              <button
                className={`tab-button ${notificationTab === 'sent' ? 'active' : ''}`}
                onClick={() => setNotificationTab('sent')}
              >
                Sent Notifications
              </button>
            </div>

            {notificationTab === 'send' && (
              <div className="notification-form">
                <h3>Send Notification to Students</h3>
                <textarea
                  placeholder="Enter notification message"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows="4"
                />
                <div className="student-selection">
                  <h4>Select Students:</h4>
                  <div className="student-checkboxes">
                    {students.map(student => (
                      <label key={student._id}>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student._id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                            }
                          }}
                        />
                        {student.username} ({student.department})
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={sendNotification}>Send Notification</button>
              </div>
            )}

            {notificationTab === 'sent' && (
              <div className="sent-notifications">
                <h3>Sent Notifications</h3>
                {sentNotifications.length === 0 ? (
                  <p>No sent notifications yet.</p>
                ) : (
                  <div className="notifications-list">
                    {sentNotifications.map(notification => (
                      <div key={notification._id} className="notification-item">
                        <div className="notification-header">
                          <h4>{notification.title}</h4>
                          <p>{notification.content}</p>
                          <span className="notification-date">
                            Sent: {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="notification-recipients">
                          <h5>Recipients ({notification.totalRecipients}):</h5>
                          <ul>
                            {notification.recipients && notification.recipients.map(recipient => (
                              <li key={recipient._id}>
                                {recipient.username} ({recipient.department})
                              </li>
                            ))}
                          </ul>
                          <div className="read-stats">
                            <span className="read-count">Read: {notification.readCount}</span>
                            <span className="unread-count">Unread: {notification.unreadCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return <p>Select a section from the menu.</p>;
    }
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Faculty Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => setActiveSection('dashboard')}>Dashboard</li>
          <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>Profile</li>
          <li className={activeSection === 'attendance' ? 'active' : ''} onClick={() => setActiveSection('attendance')}>Attendance</li>
          <li className={activeSection === 'results' ? 'active' : ''} onClick={() => setActiveSection('results')}>Results</li>
          <li className={activeSection === 'documents' ? 'active' : ''} onClick={() => setActiveSection('documents')}>Documents</li>
          <li className={activeSection === 'noticeboard' ? 'active' : ''} onClick={() => setActiveSection('noticeboard')}>Noticeboard</li>
          <li className={activeSection === 'events' ? 'active' : ''} onClick={() => setActiveSection('events')}>Events</li>
          <li className={activeSection === 'fees' ? 'active' : ''} onClick={() => setActiveSection('fees')}>Fees & Reports</li>
          <li className={activeSection === 'notifications' ? 'active' : ''} onClick={() => setActiveSection('notifications')}>Notifications</li>
        </ul>
      </nav>
      <div className="dashboard-main">
        {error && <p className="error">{error}</p>}
        {renderSection()}
      </div>
    </div>
  );
}

export default FacultyDashboardPage;
