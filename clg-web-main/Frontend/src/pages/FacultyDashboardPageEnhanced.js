import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import facultyApi from '../services/facultyApi';
import '../styles/StudentDashboard.css'; // Reuse student dashboard styles
import '../styles/ProfessionalAttendance.css'; // Professional attendance styles

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
  const navigate = useNavigate();

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
      // Assuming profile is not available, set from localStorage or token
      const token = localStorage.getItem('token');
      // For now, set basic profile
      setProfile({ username: 'Faculty User', department: 'Computer Science' }); // Placeholder

      const eventsResponse = await facultyApi.getEvents();
      setEvents(eventsResponse.data);

      const studentsResponse = await facultyApi.getStudents();
      setStudents(studentsResponse.data);

      const attendanceResponse = await facultyApi.getAttendanceRecords();
      setAttendanceRecords(attendanceResponse.data);

      // Load today's attendance
      await loadTodayAttendance();
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

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
      student.studentId.toLowerCase().includes(term.toLowerCase()) ||
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
      case 'profile':
        return (
          <div className="section-content profile-section">
            <h2>Faculty Profile</h2>
            {profile ? (
              <div className="profile-card enhanced-profile-card">
                <div className="profile-details">
                  <p><strong>Name:</strong> {profile.username}</p>
                  <p><strong>Department:</strong> {profile.department}</p>
                  <p><strong>Role:</strong> Faculty</p>
                </div>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        );
      case 'events':
        return (
          <div className="section-content">
            <h2>Events Management</h2>
            <form onSubmit={handleCreateEvent} className="event-form">
              <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required />
              <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} required />
              <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
              <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} required />
              <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} required />
              <input type="text" placeholder="Organizer" value={newEvent.organizer} onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})} required />
              <button type="submit">Create Event</button>
            </form>
            <h3>Department Events</h3>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
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
                        <img src={student.profilePicture} alt={student.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {student.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="student-details">
                      <h4>{student.username}</h4>
                      <p>Student ID: {student.studentId}</p>
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
                                  <td>{record.studentId?.username || 'N/A'}</td>
                                  <td>{record.studentId?.studentId || 'N/A'}</td>
                                  <td>{record.studentId?.department || 'N/A'}</td>
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
                          <td>{record.studentId?.username || 'N/A'}</td>
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
      case 'students':
        return (
          <div className="section-content">
            <h2>Department Students</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Student ID</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.username}</td>
                    <td>{student.email}</td>
                    <td>{student.studentId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>Profile</li>
          <li className={activeSection === 'events' ? 'active' : ''} onClick={() => setActiveSection('events')}>Events</li>
          <li className={activeSection === 'attendance' ? 'active' : ''} onClick={() => setActiveSection('attendance')}>Attendance</li>
          <li className={activeSection === 'students' ? 'active' : ''} onClick={() => setActiveSection('students')}>Students</li>
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
