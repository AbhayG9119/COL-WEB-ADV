import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminData, adminAuth } from '../services/adminApi';
import '../styles/AdminDashboard.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalProfiles: 0,
    completedProfiles: 0,
    pendingProfiles: 0,
    totalContacts: 0,
    totalQueries: 0,
    totalNccQueries: 0,
  });

  // Student Profiles state
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [studentProfileStats, setStudentProfileStats] = useState({
    totalProfiles: 0,
    todayProfiles: 0,
    courseStats: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Contacts and Queries state
  const [contacts, setContacts] = useState([]);
  const [admissionQueries, setAdmissionQueries] = useState([]);
  const [nccQueries, setNccQueries] = useState([]);
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [hods, setHods] = useState([]);
  const [students, setStudents] = useState([]);

  // Pagination state for different sections
  const [contactsCurrentPage, setContactsCurrentPage] = useState(1);
  const [contactsTotalPages, setContactsTotalPages] = useState(1);
  const [queriesCurrentPage, setQueriesCurrentPage] = useState(1);
  const [queriesTotalPages, setQueriesTotalPages] = useState(1);
  const [nccCurrentPage, setNccCurrentPage] = useState(1);
  const [nccTotalPages, setNccTotalPages] = useState(1);

  useEffect(() => {
    // Check authentication
    const token = adminAuth.getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setIsAuthenticated(true);

    // Fetch dashboard metrics
    fetchMetrics();
    fetchStudentProfileStats();

    // Fetch initial data based on active module
    if (activeModule === 'profiles') {
      fetchStudentProfiles();
    } else if (activeModule === 'contacts') {
      fetchContacts();
    } else if (activeModule === 'queries') {
      fetchAdmissionQueries();
    } else if (activeModule === 'ncc-queries') {
      fetchNccQueries();
    } else if (activeModule === 'events') {
      fetchEvents();
    } else if (activeModule === 'courses') {
      fetchCourses();
    } else if (activeModule === 'hods') {
      fetchHods();
    } else if (activeModule === 'students') {
      fetchStudents();
    }
  }, [navigate]);

  // Fetch data when module changes or pagination changes
  useEffect(() => {
    if (activeModule === 'profiles') {
      fetchStudentProfiles();
    } else if (activeModule === 'contacts') {
      fetchContacts();
    } else if (activeModule === 'queries') {
      fetchAdmissionQueries();
    } else if (activeModule === 'ncc-queries') {
      fetchNccQueries();
    } else if (activeModule === 'events') {
      fetchEvents();
    } else if (activeModule === 'courses') {
      fetchCourses();
    } else if (activeModule === 'hods') {
      fetchHods();
    } else if (activeModule === 'students') {
      fetchStudents();
    }
  }, [activeModule, currentPage, searchTerm, contactsCurrentPage, queriesCurrentPage, nccCurrentPage]);

  const fetchMetrics = async () => {
    try {
      const [contactsRes, queriesRes, nccRes, profilesRes] = await Promise.all([
        adminData.getContacts({ page: 1, limit: 1 }),
        adminData.getAdmissionQueries({ page: 1, limit: 1 }),
        adminData.getNCCQueries({ page: 1, limit: 1 }),
        adminData.getStudentProfiles({ page: 1, limit: 1 })
      ]);

      setMetrics({
        totalContacts: contactsRes.success ? contactsRes.pagination.total : 0,
        totalQueries: queriesRes.success ? queriesRes.pagination.total : 0,
        totalNccQueries: nccRes.success ? nccRes.pagination.total : 0,
        totalProfiles: profilesRes.success ? profilesRes.pagination.total : 0,
        totalStudents: 0, // This would need a separate endpoint
        completedProfiles: 0, // This would need a separate endpoint
        pendingProfiles: 0 // This would need a separate endpoint
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchStudentProfileStats = async () => {
    try {
      const response = await adminData.getStudentProfileStats();
      if (response.success) {
        setStudentProfileStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching student profile stats:', error);
    }
  };

  const fetchStudentProfiles = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm
      };
      const response = await adminData.getStudentProfiles(params);
      if (response.success) {
        setStudentProfiles(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching student profiles:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const params = { page: contactsCurrentPage, limit: 10, search: searchTerm };
      const response = await adminData.getContacts(params);
      if (response.success) {
        setContacts(response.data);
        setContactsTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchAdmissionQueries = async () => {
    try {
      const params = { page: queriesCurrentPage, limit: 10, search: searchTerm };
      const response = await adminData.getAdmissionQueries(params);
      if (response.success) {
        setAdmissionQueries(response.data);
        setQueriesTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching admission queries:', error);
    }
  };

  const fetchNccQueries = async () => {
    try {
      const params = { page: nccCurrentPage, limit: 10, search: searchTerm };
      const response = await adminData.getNCCQueries(params);
      if (response.success) {
        setNccQueries(response.data);
        setNccTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching NCC queries:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await adminData.getEvents();
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await adminData.getCourses();
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchHods = async () => {
    try {
      const response = await adminData.getHods();
      if (response.success) {
        setHods(response.data);
      }
    } catch (error) {
      console.error('Error fetching hods:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await adminData.getStudents();
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleExport = (format) => {
    // Export functionality
    const dataToExport = studentProfiles.map(profile => ({
      'Student Name': profile.student?.username || 'N/A',
      'Email': profile.student?.email || 'N/A',
      'Roll Number': profile.rollNumber || 'N/A',
      'Course': profile.course || 'N/A',
      'Branch': profile.branch || 'N/A',
      'Father Name': profile.fatherName || 'N/A',
      'Contact Number': profile.contactNumber || 'N/A',
      'Status': 'Complete'
    }));

    if (format === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student-profiles.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // For Excel export, you might want to use a library like xlsx
      alert('Excel export functionality would require additional library installation');
    }

    setShowExportOptions(false);
  };

  const handleSelectProfile = (profileId) => {
    setSelectedProfiles(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProfiles(
      selectedProfiles.length === studentProfiles.length
        ? []
        : studentProfiles.map(profile => profile._id)
    );
  };

  const modules = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'profiles', name: 'Student Profiles', icon: '👤' },
    { id: 'students', name: 'Students', icon: '🎓' },
    { id: 'contacts', name: 'Contacts', icon: '📞' },
    { id: 'queries', name: 'Admission Queries', icon: '❓' },
    { id: 'ncc-queries', name: 'NCC Queries', icon: '🎖️' },
    { id: 'courses', name: 'Courses', icon: '📚' },
    { id: 'hods', name: 'HODs', icon: '👨‍💼' },
    { id: 'events', name: 'Events', icon: '📅' },
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <div className="module-section">
            <h2>Admin Overview</h2>
            <div className="overview-grid">
              <div className="metric-card">
                <div className="metric-icon">👥</div>
                <div className="metric-content">
                  <div className="metric-number">{metrics.totalStudents}</div>
                  <div className="metric-label">Total Students</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📝</div>
                <div className="metric-content">
                  <div className="metric-number">{metrics.totalProfiles}</div>
                  <div className="metric-label">Student Profiles</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <div className="metric-number">{metrics.completedProfiles}</div>
                  <div className="metric-label">Completed Profiles</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⏳</div>
                <div className="metric-content">
                  <div className="metric-number">{metrics.pendingProfiles}</div>
                  <div className="metric-label">Pending Profiles</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📞</div>
                <div className="metric-content">
                  <div className="metric-number">{metrics.totalContacts}</div>
                  <div className="metric-label">Total Contacts</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">❓</div>
                <div className="metric-content">
                  <div className="metric-number">{metrics.totalQueries}</div>
                  <div className="metric-label">Admission Queries</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🎖️</div>
                <div className="metric-content">
                  <div className="metric-number">{metrics.totalNccQueries}</div>
                  <div className="metric-label">NCC Queries</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profiles':
        return (
          <div className="module-section">
            <h2>Student Profiles Management</h2>
            <div className="quick-actions">
              <button className="action-btn primary">Add Profile</button>
              <button className="action-btn secondary">Bulk Update</button>
              <div className="export-dropdown">
                <button
                  className="action-btn secondary"
                  onClick={() => setShowExportOptions(!showExportOptions)}
                >
                  Export Data
                </button>
                {showExportOptions && (
                  <div className="export-options">
                    <button onClick={() => handleExport('csv')}>Export as CSV</button>
                    <button onClick={() => handleExport('excel')}>Export as Excel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name, email, roll number, course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">🔍</button>
              </div>
              <div className="filter-options">
                <select>
                  <option value="">All Courses</option>
                  <option value="BTech">BTech</option>
                  <option value="MTech">MTech</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                </select>
                <select>
                  <option value="">All Status</option>
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Student Profiles Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedProfiles.length === studentProfiles.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Branch</th>
                    <th>Father Name</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentProfiles.map(profile => (
                    <tr key={profile._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProfiles.includes(profile._id)}
                          onChange={() => handleSelectProfile(profile._id)}
                        />
                      </td>
                      <td>{profile.student?.username || 'N/A'}</td>
                      <td>{profile.student?.email || 'N/A'}</td>
                      <td>{profile.rollNumber || 'N/A'}</td>
                      <td>{profile.course || 'N/A'}</td>
                      <td>{profile.branch || 'N/A'}</td>
                      <td>{profile.fatherName || 'N/A'}</td>
                      <td>{profile.contactNumber || 'N/A'}</td>
                      <td><span className="status completed">Complete</span></td>
                      <td>
                        <button className="btn-sm">View</button>
                        <button className="btn-sm">Edit</button>
                        <button className="btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="module-section">
            <h2>Contacts Management</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>
                        No contacts found
                      </td>
                    </tr>
                  ) : (
                    contacts.map(contact => (
                      <tr key={contact._id}>
                        <td>{contact.name || 'N/A'}</td>
                        <td>{contact.email || 'N/A'}</td>
                        <td>{contact.phone || 'N/A'}</td>
                        <td>{contact.location || 'N/A'}</td>
                        <td>{contact.subject || 'N/A'}</td>
                        <td>{contact.message || 'N/A'}</td>
                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn-sm">Reply</button>
                          <button className="btn-sm">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setContactsCurrentPage(contactsCurrentPage - 1)}
                  disabled={contactsCurrentPage === 1}
                >
                  Previous
                </button>
                <span>Page {contactsCurrentPage} of {contactsTotalPages}</span>
                <button
                  onClick={() => setContactsCurrentPage(contactsCurrentPage + 1)}
                  disabled={contactsCurrentPage === contactsTotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 'queries':
        return (
          <div className="module-section">
            <h2>Admission Queries</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Query</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissionQueries.map(query => (
                    <tr key={query._id}>
                      <td>{query.name}</td>
                      <td>{query.email}</td>
                      <td>{query.course}</td>
                      <td>{query.query}</td>
                      <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                      <td><span className={`status ${query.status}`}>{query.status}</span></td>
                      <td>
                        <button className="btn-sm">Respond</button>
                        <button className="btn-sm">Close</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setQueriesCurrentPage(queriesCurrentPage - 1)}
                  disabled={queriesCurrentPage === 1}
                >
                  Previous
                </button>
                <span>Page {queriesCurrentPage} of {queriesTotalPages}</span>
                <button
                  onClick={() => setQueriesCurrentPage(queriesCurrentPage + 1)}
                  disabled={queriesCurrentPage === queriesTotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 'ncc-queries':
        return (
          <div className="module-section">
            <h2>NCC Queries Management</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nccQueries.map(query => (
                    <tr key={query._id}>
                      <td>{query.name}</td>
                      <td>{query.email}</td>
                      <td>{query.course}</td>
                      <td>{query.message}</td>
                      <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                      <td><span className={`status ${query.status || 'pending'}`}>{query.status || 'pending'}</span></td>
                      <td>
                        <button className="btn-sm">Respond</button>
                        <button className="btn-sm">Close</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setNccCurrentPage(nccCurrentPage - 1)}
                  disabled={nccCurrentPage === 1}
                >
                  Previous
                </button>
                <span>Page {nccCurrentPage} of {nccTotalPages}</span>
                <button
                  onClick={() => setNccCurrentPage(nccCurrentPage + 1)}
                  disabled={nccCurrentPage === nccTotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="module-section"><h2>{modules.find(m => m.id === activeModule)?.name}</h2><p>Content coming soon...</p></div>;
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="top-bar">
        <div className="top-bar-left">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>
        <div className="top-bar-right">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <button className="search-btn">🔍</button>
          </div>
          <div className="user-menu">
            <span>Super Admin</span>
            <div className="user-avatar">SA</div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-wrapper">
        <nav className="left-nav">
          <ul className="nav-list">
            {modules.map(module => (
              <li
                key={module.id}
                className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
                onClick={() => setActiveModule(module.id)}
              >
                <span className="nav-icon">{module.icon}</span>
                <span className="nav-text">{module.name}</span>
              </li>
            ))}
          </ul>
        </nav>

        <main className="main-area">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
