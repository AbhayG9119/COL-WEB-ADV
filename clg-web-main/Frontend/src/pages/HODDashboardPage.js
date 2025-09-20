import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../services/adminApi';
import '../styles/AdminDashboard.css';

function HODDashboardPage() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch department events
      const eventsResponse = await fetch('http://localhost:5000/api/hod/events', {
        headers: {
          'Authorization': `Bearer ${adminAuth.getToken()}`
        }
      });
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } else {
        setError('Failed to fetch events');
      }

      // Fetch department students
      const studentsResponse = await fetch('http://localhost:5000/api/hod/students', {
        headers: {
          'Authorization': `Bearer ${adminAuth.getToken()}`
        }
      });
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
      } else {
        setError('Failed to fetch students');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    adminAuth.logout();
    navigate('/login');
  };

  const handleApproveEvent = async (eventId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/hod/events/${eventId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth.getToken()}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Refresh events
        fetchData();
      } else {
        setError('Failed to update event status');
      }
    } catch (err) {
      setError('An error occurred while updating event');
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">
          <div className="loading-spinner"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">HOD Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon stat-icon-blue">
                <span>📅</span>
              </div>
              <div>
                <div className="stat-number">{events.length}</div>
                <div className="stat-label">Department Events</div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon stat-icon-green">
                <span>👥</span>
              </div>
              <div>
                <div className="stat-number">{students.length}</div>
                <div className="stat-label">Department Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events and students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Events Section */}
        <div className="data-table-container">
          <div className="table-header">
            <h2 className="table-title">Department Events & Notices</h2>
            <div className="table-actions">
              <button className="export-btn">Create New Event</button>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <table className="data-table">
              <thead className="table-head">
                <tr>
                  <th className="table-header-cell">Title</th>
                  <th className="table-header-cell">Description</th>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="table-row">
                    <td className="table-cell table-cell-name">{event.title}</td>
                    <td className="table-cell">{event.description}</td>
                    <td className="table-cell table-cell-date">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge status-${event.status}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {event.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => handleApproveEvent(event._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleApproveEvent(event._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No events found</div>
          )}
        </div>

        {/* Students Section */}
        <div className="data-table-container" style={{ marginTop: '3rem' }}>
          <div className="table-header">
            <h2 className="table-title">Department Students</h2>
          </div>

          {filteredStudents.length > 0 ? (
            <table className="data-table">
              <thead className="table-head">
                <tr>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Student ID</th>
                  <th className="table-header-cell">Created</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="table-row">
                    <td className="table-cell table-cell-name">{student.username}</td>
                    <td className="table-cell table-cell-email">{student.email}</td>
                    <td className="table-cell">{student.studentId || 'N/A'}</td>
                    <td className="table-cell table-cell-date">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No students found</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HODDashboardPage;
