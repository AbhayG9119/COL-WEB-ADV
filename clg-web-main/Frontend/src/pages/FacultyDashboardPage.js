import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import facultyApi from '../services/facultyApi';
import '../styles/StudentDashboard.css'; // Reuse student dashboard styles

function FacultyDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', venue: '', organizer: '' });
  const [attendanceData, setAttendanceData] = useState({ date: '', subject: '', attendanceRecords: [] });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ total: 0, present: 0, absent: 0, late: 0 });
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

      const allStudentsResponse = await facultyApi.getAllStudents();
      setAllStudents(allStudentsResponse.data);

      const statsResponse = await facultyApi.getAttendanceStatistics();
      setAttendanceStats(statsResponse.data);
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
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

  const handleStudentSelection = (studentId, status) => {
    setSelectedStudents(prev => {
      const existing = prev.find(s => s.studentId === studentId);
      if (existing) {
        return prev.map(s => s.studentId === studentId ? { ...s, status } : s);
      } else {
        return [...prev, { studentId, status }];
      }
    });
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }
    try {
      const attendanceRecords = selectedStudents.map(s => ({
        studentId: s.studentId,
        status: s.status
      }));
      await facultyApi.markBulkAttendance({
        date: attendanceData.date,
        subject: attendanceData.subject,
        attendanceRecords
      });
      setAttendanceData({ date: '', subject: '', attendanceRecords: [] });
      setSelectedStudents([]);
      fetchData(); // Refresh attendance
    } catch (err) {
      setError('Failed to mark attendance');
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
            <h2>Attendance Management</h2>
            
            {/* Attendance Statistics */}
            <div className="attendance-stats">
              <h3>Attendance Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Records:</span>
                  <span className="stat-value">{attendanceStats.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Present:</span>
                  <span className="stat-value">{attendanceStats.present}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Absent:</span>
                  <span className="stat-value">{attendanceStats.absent}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Late:</span>
                  <span className="stat-value">{attendanceStats.late}</span>
                </div>
              </div>
            </div>

            {/* Mark Attendance Form */}
            <form onSubmit={handleMarkAttendance} className="attendance-form">
              <input type="date" value={attendanceData.date} onChange={(e) => setAttendanceData({...attendanceData, date: e.target.value})} required />
              <input type="text" placeholder="Subject" value={attendanceData.subject} onChange={(e) => setAttendanceData({...attendanceData, subject: e.target.value})} required />
              
              <div className="student-selection">
                <h4>Select Students and Mark Attendance</h4>
                <div className="student-list">
                  {allStudents.map(student => (
                    <div key={student._id} className="student-item">
                      <span>{student.username} ({student.studentId})</span>
                      <div className="status-buttons">
                        <button 
                          type="button" 
                          className={selectedStudents.find(s => s.studentId === student._id && s.status === 'present') ? 'active' : ''} 
                          onClick={() => handleStudentSelection(student._id, 'present')}
                        >
                          Present
                        </button>
                        <button 
                          type="button" 
                          className={selectedStudents.find(s => s.studentId === student._id && s.status === 'absent') ? 'active' : ''} 
                          onClick={() => handleStudentSelection(student._id, 'absent')}
                        >
                          Absent
                        </button>
                        <button 
                          type="button" 
                          className={selectedStudents.find(s => s.studentId === student._id && s.status === 'late') ? 'active' : ''} 
                          onClick={() => handleStudentSelection(student._id, 'late')}
                        >
                          Late
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button type="submit">Mark Attendance</button>
            </form>

            {/* Attendance Records */}
            <h3>Attendance Records</h3>
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
                {attendanceRecords.map(record => (
                  <tr key={record._id}>
                    <td>{record.studentId?.username || 'N/A'}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.subject}</td>
                    <td>{record.status}</td>
                    <td>
                      <button onClick={() => facultyApi.updateAttendanceRecord(record._id, 'present')}>Present</button>
                      <button onClick={() => facultyApi.updateAttendanceRecord(record._id, 'absent')}>Absent</button>
                      <button onClick={() => facultyApi.updateAttendanceRecord(record._id, 'late')}>Late</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        {loading ? <p>Loading...</p> : renderSection()}
      </div>
    </div>
  );
}

export default FacultyDashboardPage;
