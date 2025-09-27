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
import '../styles/StudentDashboard.css'; // Reuse student dashboard styles
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
  const [notices, setNotices] = useState([]);
  const [newFaculty, setNewFaculty] = useState({ username: '', email: '', department: '', role: 'faculty' });
  const [newStudent, setNewStudent] = useState({ username: '', email: '', department: '' });
  const [newResult, setNewResult] = useState({ studentId: '', subject: '', marks: '', grade: '' });
  const [newFee, setNewFee] = useState({ studentId: '', amount: '', description: '', dueDate: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal' });
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [editingFee, setEditingFee] = useState(null);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [reportType, setReportType] = useState('attendance');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
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
    if (!token || role !== 'faculty') {
      navigate('/login');
      return;
    }
    fetchData();
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
      // Fallback to basic profile
      setProfile({ username: 'Faculty User', department: 'Computer Science' });
    }
  };

  const loadEnhancedData = async () => {
    try {
      const [facultyRes, resultsRes, feesRes, documentsRes, noticesRes] = await Promise.all([
        facultyApi.getFaculty(),
        facultyApi.getResults(),
        facultyApi.getFees(),
        facultyApi.getDocuments(),
        facultyApi.getNotices()
      ]);

      setFaculty(facultyRes.data);
      setResults(resultsRes.data);
      setFees(feesRes.data);
      setDocuments(documentsRes.data);
      setNotices(noticesRes.data);
    } catch (err) {
      console.log('Some enhanced data failed to load:', err);
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await facultyApi.getAttendanceByDate(today);
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
                {!isEditingProfile ? (
                  <>
                    <div className="profile-header">
                      <div className="profile-picture-section">
                        {profile.profilePicture ? (
                          <img src={`${BACKEND_BASE_URL}/uploads/profile-pictures/${profile.profilePicture}`} alt="Profile" className="profile-picture" />
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
                    <h3>Edit Profile</h3>
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
                            />
                          </div>
                          <div className="form-group">
                            <label>Employee ID:</label>
                            <input
                              type="text"
                              value={profileForm.employeeId}
                              onChange={(e) => handleProfileFormChange('employeeId', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Department:</label>
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
                            />
                          </div>
                          <div className="form-group">
                            <label>Mobile Number:</label>
                            <input
                              type="tel"
                              value={profileForm.mobileNumber}
                              onChange={(e) => handleProfileFormChange('mobileNumber', e.target.value)}
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
                              />
                            </div>
                            <div className="form-group">
                              <label>Appointment Letter:</label>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => handleFileChange('appointmentLetter', e.target.files[0])}
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
              <p>Loading profile...</p>
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
                  setEditingResult({...editingResult, studentId: e.target.value}) :
                  setNewResult({...newResult, studentId: e.target.value})
                }
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={editingResult ? editingResult.subject : newResult.subject}
                onChange={(e) => editingResult ?
                  setEditingResult({...editingResult, subject: e.target.value}) :
                  setNewResult({...newResult, subject: e.target.value})
                }
                required
              />
              <input
                type="number"
                placeholder="Marks"
                value={editingResult ? editingResult.marks : newResult.marks}
                onChange={(e) => editingResult ?
                  setEditingResult({...editingResult, marks: e.target.value}) :
                  setNewResult({...newResult, marks: e.target.value})
                }
                required
              />
              <input
                type="text"
                placeholder="Grade"
                value={editingResult ? editingResult.grade : newResult.grade}
                onChange={(e) => editingResult ?
                  setEditingResult({...editingResult, grade: e.target.value}) :
                  setNewResult({...newResult, grade: e.target.value})
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
                  setNewFee({...newFee, dueDate: e.target.value})
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
              <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required />
              <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} required />
              <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
              <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} required />
              <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} required />
              <input type="text" placeholder="Organizer" value={newEvent.organizer} onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})} required />
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
      case 'attendance':
        return (
          <div className="section-content">
            <h2>Professional Attendance Management</h2>

            {/* Today's Attendance Summary */}
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

            {/* Attendance Form */}
            <div className="attendance-form-container">
              <form className="attendance-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date:</label>
                    <input
                      type="date"
                      value={attendanceForm.date}
                      onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject:</label>
                    <input
                      type="text"
                      placeholder="Enter subject name"
                      value={attendanceForm.subject}
                      onChange={(e) => setAttendanceForm({...attendanceForm, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Department:</label>
                    <select
                      value={attendanceForm.department}
                      onChange={(e) => setAttendanceForm({...attendanceForm, department: e.target.value})}
                    >
                      <option value="all">All Departments</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={loadStudentsForAttendance}
                  >
                    Load Students
                  </button>
                  <button
                    type="button"
                    className="btn-success"
                    onClick={markAllPresent}
                  >
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={markAllAbsent}
                  >
                    Mark All Absent
                  </button>
                </div>
              </form>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search students by name or ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    filterStudents(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Students Attendance Grid */}
            <div className="attendance-grid">
              <div className="attendance-header">
                <span>Student Details</span>
                <span>Attendance Status</span>
                <span>Actions</span>
              </div>

              {filteredStudents.map(student => (
                <div key={student._id} className="attendance-row">
                  <div className="student-info">
                    <div className="student-avatar">
                      {student.profilePicture ? (
                        <img src={`${BACKEND_BASE_URL}/${student.profilePicture}`} alt={student.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {student.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="student-details">
                      <h4>{student.username}</h4>
                      <p>ID: {student._id}</p>
                      <p>Department: {student.department}</p>
                      <p>Email: {student.email}</p>
                    </div>
                  </div>

                  <div className="attendance-status">
                    <span className={`status-badge ${studentAttendance[student._id] || 'pending'}`}>
                      {studentAttendance[student._id] === 'present' ? 'Present' :
                       studentAttendance[student._id] === 'absent' ? 'Absent' :
                       studentAttendance[student._id] === 'late' ? 'Late' : 'Not Marked'}
                    </span>
                  </div>

                  <div className="attendance-actions">
                    <button
                      className={`btn-status present ${studentAttendance[student._id] === 'present' ? 'active' : ''}`}
                      onClick={() => toggleAttendance(student._id, 'present')}
                    >
                      Present
                    </button>
                    <button
                      className={`btn-status absent ${studentAttendance[student._id] === 'absent' ? 'active' : ''}`}
                      onClick={() => toggleAttendance(student._id, 'absent')}
                    >
                      Absent
                    </button>
                    <button
                      className={`btn-status late ${studentAttendance[student._id] === 'late' ? 'active' : ''}`}
                      onClick={() => toggleAttendance(student._id, 'late')}
                    >
                      Late
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Attendance */}
            <div className="submit-attendance">
              <button
                className="btn-submit"
                onClick={submitAttendance}
                disabled={Object.keys(studentAttendance).length === 0}
              >
                Submit Attendance ({Object.keys(studentAttendance).length} students)
              </button>
            </div>

            {/* Attendance Records */}
            <div className="attendance-records">
              <div className="records-header">
                <h3>Recent Attendance Records</h3>
                <button
                  className={`btn-toggle-view ${showDayWiseView ? 'active' : ''}`}
                  onClick={toggleDayWiseView}
                >
                  {showDayWiseView ? 'Show List View' : 'Show Day-wise View'}
                </button>
              </div>

              {showDayWiseView ? (
                /* Day-wise Attendance View */
                <div className="day-wise-attendance">
                  {dayWiseLoading ? (
                    <p>Loading attendance records...</p>
                  ) : dayWiseError ? (
                    <p className="error">{dayWiseError}</p>
                  ) : dayWiseAttendance.length === 0 ? (
                    <p>No attendance records found for the last 7 days.</p>
                  ) : (
                    dayWiseAttendance.map(dayData => (
                      <div key={dayData.date} className="day-attendance-card">
                        <div className="day-header">
                          <h4>{new Date(dayData.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</h4>
                          <div className="day-summary">
                            <span className="summary-item present">
                              Present: {dayData.summary.present}
                            </span>
                            <span className="summary-item absent">
                              Absent: {dayData.summary.absent}
                            </span>
                            <span className="summary-item late">
                              Late: {dayData.summary.late}
                            </span>
                            <span className="summary-item total">
                              Total: {dayData.summary.total}
                            </span>
                          </div>
                        </div>

                        <div className="day-students-list">
                          <table className="students-table">
                            <thead>
                              <tr>
                                <th>Student Name</th>
                                <th>Student ID</th>
                                <th>Department</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dayData.records.map(record => (
                                <tr key={record._id}>
                                  <td>{record.student?.username || 'N/A'}</td>
                                  <td>{record.student?._id || 'N/A'}</td>
                                  <td>{record.student?.department || 'N/A'}</td>
                                  <td>{record.subject}</td>
                                  <td>
                                    <span className={`status-badge ${record.status}`}>
                                      {record.status}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="btn-small"
                                      onClick={() => updateRecordStatus(record._id, 'present')}
                                    >
                                      Present
                                    </button>
                                    <button
                                      className="btn-small"
                                      onClick={() => updateRecordStatus(record._id, 'absent')}
                                    >
                                      Absent
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* List View (Original) */
                <div className="records-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.slice(0, 10).map(record => (
                        <tr key={record._id}>
                          <td>{record.student?.username || 'N/A'}</td>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.subject}</td>
                          <td>
                            <span className={`status-badge ${record.status}`}>
                              {record.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-small"
                              onClick={() => updateRecordStatus(record._id, 'present')}
                            >
                              Present
                            </button>
                            <button
                              className="btn-small"
                              onClick={() => updateRecordStatus(record._id, 'absent')}
                            >
                              Absent
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
