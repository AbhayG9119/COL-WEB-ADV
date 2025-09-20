import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import academicCellApi from '../services/academicCellApi';
import '../styles/AcademicCellDashboard.css';

const AcademicCellDashboardPage = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('admissions');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metrics, setMetrics] = useState({
    totalEnrolled: 0,
    newAdmissions: 0,
    completedProfiles: 0,
    pendingProfiles: 0,
    incompleteDocuments: 0,
    upcomingDeadlines: 0,
  });

  const [admissions, setAdmissions] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [communicationTemplates, setCommunicationTemplates] = useState([]);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [admissionFormData, setAdmissionFormData] = useState({
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
  const [studentProfileStats, setStudentProfileStats] = useState({
    totalProfiles: 0,
    todayProfiles: 0,
    courseStats: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);

    // Fetch dashboard metrics
    academicCellApi.getMetrics().then(res => {
      setMetrics(res.data);
    }).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Fetch admissions
    academicCellApi.getAdmissions().then(res => setAdmissions(res.data)).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Fetch pending profiles
    academicCellApi.getPendingProfiles().then(res => setPendingProfiles(res.data)).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Fetch documents
    academicCellApi.getDocuments().then(res => setDocuments(res.data)).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Fetch courses
    academicCellApi.getCourses().then(res => setCourses(res.data)).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Fetch notifications
    academicCellApi.getNotifications().then(res => setNotifications(res.data)).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Fetch tasks
    academicCellApi.getTasks().then(res => setTasks(res.data)).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });

    // Fetch communication templates
    academicCellApi.getCommunicationTemplates().then(res => setCommunicationTemplates(res.data)).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });
  }, [navigate]);

  // Fetch student profiles when profiles module is active
  useEffect(() => {
    if (activeModule === 'profiles') {
      fetchStudentProfiles();
    }
  }, [activeModule, currentPage, searchTerm]);

  const fetchStudentProfiles = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm
      };
      const response = await academicCellApi.getStudentProfiles(params);
      if (response && response.data) {
        setStudentProfiles(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching student profiles:', error);
    }
  };

  const modules = [
    { id: 'admissions', name: 'Admissions', icon: '📝' },
    { id: 'profiles', name: 'Student Profiles', icon: '👤' },
    { id: 'documents', name: 'Document Verification', icon: '📄' },
    { id: 'courses', name: 'Course & Semester Management', icon: '📚' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊' },
    { id: 'notifications', name: 'Notifications & Tasks', icon: '🔔' },
    { id: 'communication', name: 'Communication', icon: '💬' },
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'admissions':
        return (
          <div className="module-section">
            <h2>Admissions Management</h2>
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => { setShowAdmissionForm(true); setSelectedStudent(null); }}>New Admission</button>
              <button className="action-btn secondary">Bulk Import</button>
              <button className="action-btn secondary">Export Data</button>
            </div>
            {showAdmissionForm ? (
              <div className="admission-form">
                <h3>{selectedStudent ? 'Edit Admission' : 'New Admission'}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const payload = { ...admissionFormData };
                    // Call API to save detailed profile
                    const response = await academicCellApi.saveDetailedProfile(payload);
                    if (response && response.data) {
                      alert('Admission data saved successfully.');
                      setShowAdmissionForm(false);
                      // Optionally refresh data or update state
                    } else {
                      alert('Failed to save admission data.');
                    }
                  } catch (error) {
                    alert('Error saving admission data.');
                  }
                }}>
                  {/* Personal Profile */}
                  <fieldset>
                    <legend>Personal Profile</legend>
                    <label>Father Name: <input type="text" value={admissionFormData.fatherName} onChange={e => setAdmissionFormData({...admissionFormData, fatherName: e.target.value})} /></label>
                    <label>Mother Name: <input type="text" value={admissionFormData.motherName} onChange={e => setAdmissionFormData({...admissionFormData, motherName: e.target.value})} /></label>
                    <label>Date of Birth: <input type="date" value={admissionFormData.dateOfBirth} onChange={e => setAdmissionFormData({...admissionFormData, dateOfBirth: e.target.value})} /></label>
                    <label>Religion: <input type="text" value={admissionFormData.religion} onChange={e => setAdmissionFormData({...admissionFormData, religion: e.target.value})} /></label>
                    <label>Caste: <input type="text" value={admissionFormData.caste} onChange={e => setAdmissionFormData({...admissionFormData, caste: e.target.value})} /></label>
                    <label>Domicile: <input type="text" value={admissionFormData.domicile} onChange={e => setAdmissionFormData({...admissionFormData, domicile: e.target.value})} /></label>
                    <label>Aadhar Number: <input type="text" value={admissionFormData.aadharNumber} onChange={e => setAdmissionFormData({...admissionFormData, aadharNumber: e.target.value})} /></label>
                  </fieldset>
                  {/* Academic Profile */}
                  <fieldset>
                    <legend>Academic Profile</legend>
                    <label>Roll Number: <input type="text" value={admissionFormData.rollNumber} onChange={e => setAdmissionFormData({...admissionFormData, rollNumber: e.target.value})} /></label>
                    <label>College: <input type="text" value={admissionFormData.college} onChange={e => setAdmissionFormData({...admissionFormData, college: e.target.value})} /></label>
                    <label>Course: <input type="text" value={admissionFormData.course} onChange={e => setAdmissionFormData({...admissionFormData, course: e.target.value})} /></label>
                    <label>Branch: <input type="text" value={admissionFormData.branch} onChange={e => setAdmissionFormData({...admissionFormData, branch: e.target.value})} /></label>
                    <label>Admission Date: <input type="date" value={admissionFormData.admissionDate} onChange={e => setAdmissionFormData({...admissionFormData, admissionDate: e.target.value})} /></label>
                    <label>Admission Mode: <input type="text" value={admissionFormData.admissionMode} onChange={e => setAdmissionFormData({...admissionFormData, admissionMode: e.target.value})} /></label>
                    <label>Admission Session: <input type="text" value={admissionFormData.admissionSession} onChange={e => setAdmissionFormData({...admissionFormData, admissionSession: e.target.value})} /></label>
                    <label>Academic Session: <input type="text" value={admissionFormData.academicSession} onChange={e => setAdmissionFormData({...admissionFormData, academicSession: e.target.value})} /></label>
                    <label>Current Year: <input type="text" value={admissionFormData.currentYear} onChange={e => setAdmissionFormData({...admissionFormData, currentYear: e.target.value})} /></label>
                    <label>Current Semester: <input type="text" value={admissionFormData.currentSemester} onChange={e => setAdmissionFormData({...admissionFormData, currentSemester: e.target.value})} /></label>
                    <label>Current Academic Status: <input type="text" value={admissionFormData.currentAcademicStatus} onChange={e => setAdmissionFormData({...admissionFormData, currentAcademicStatus: e.target.value})} /></label>
                    <label>Scholarship Applied: <input type="text" value={admissionFormData.scholarshipApplied} onChange={e => setAdmissionFormData({...admissionFormData, scholarshipApplied: e.target.value})} /></label>
                  </fieldset>
                  {/* Hostel Details */}
                  <fieldset>
                    <legend>Hostel Details</legend>
                    <label>Hostel Applied: <input type="text" value={admissionFormData.hostelApplied} onChange={e => setAdmissionFormData({...admissionFormData, hostelApplied: e.target.value})} /></label>
                  </fieldset>
                  {/* Contact Details */}
                  <fieldset>
                    <legend>Contact Details</legend>
                    <label>Contact Number: <input type="text" value={admissionFormData.contactNumber} onChange={e => setAdmissionFormData({...admissionFormData, contactNumber: e.target.value})} /></label>
                    <label>Father Contact Number: <input type="text" value={admissionFormData.fatherContactNumber} onChange={e => setAdmissionFormData({...admissionFormData, fatherContactNumber: e.target.value})} /></label>
                    <label>Correspondence Address: <input type="text" value={admissionFormData.correspondenceAddress} onChange={e => setAdmissionFormData({...admissionFormData, correspondenceAddress: e.target.value})} /></label>
                    <label>Permanent Address: <input type="text" value={admissionFormData.permanentAddress} onChange={e => setAdmissionFormData({...admissionFormData, permanentAddress: e.target.value})} /></label>
                    <label>Email: <input type="email" value={admissionFormData.email} onChange={e => setAdmissionFormData({...admissionFormData, email: e.target.value})} /></label>
                  </fieldset>
                  {/* Qualifications */}
                  <fieldset>
                    <legend>Qualification Details</legend>
                    {admissionFormData.qualifications.map((qual, index) => (
                      <div key={index} className="qualification-entry">
                        <label>Course: <input type="text" value={qual.course} onChange={e => {
                          const newQuals = [...admissionFormData.qualifications];
                          newQuals[index].course = e.target.value;
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }} /></label>
                        <label>Stream Name: <input type="text" value={qual.streamName} onChange={e => {
                          const newQuals = [...admissionFormData.qualifications];
                          newQuals[index].streamName = e.target.value;
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }} /></label>
                        <label>Board Name: <input type="text" value={qual.boardName} onChange={e => {
                          const newQuals = [...admissionFormData.qualifications];
                          newQuals[index].boardName = e.target.value;
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }} /></label>
                        <label>Roll Number: <input type="text" value={qual.rollNumber} onChange={e => {
                          const newQuals = [...admissionFormData.qualifications];
                          newQuals[index].rollNumber = e.target.value;
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }} /></label>
                        <label>Passing Year: <input type="text" value={qual.passingYear} onChange={e => {
                          const newQuals = [...admissionFormData.qualifications];
                          newQuals[index].passingYear = e.target.value;
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }} /></label>
                        <label>Subject Details: <input type="text" value={qual.subjectDetails} onChange={e => {
                          const newQuals = [...admissionFormData.qualifications];
                          newQuals[index].subjectDetails = e.target.value;
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }} /></label>
                        <label>Marks & Percentage: <input type="text" value={qual.marksPercentage} onChange={e => {
                          const newQuals = [...admissionFormData.qualifications];
                          newQuals[index].marksPercentage = e.target.value;
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }} /></label>
                        <button type="button" onClick={() => {
                          const newQuals = admissionFormData.qualifications.filter((_, i) => i !== index);
                          setAdmissionFormData({...admissionFormData, qualifications: newQuals});
                        }}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      setAdmissionFormData({...admissionFormData, qualifications: [...admissionFormData.qualifications, { course: '', streamName: '', boardName: '', rollNumber: '', passingYear: '', subjectDetails: '', marksPercentage: '' }]});
                    }}>Add Qualification</button>
                  </fieldset>
                  {/* Semester Results */}
                  <fieldset>
                    <legend>Year/Semester Result Details</legend>
                    {admissionFormData.semesterResults.map((result, index) => (
                      <div key={index} className="semester-result-entry">
                        <label>Year: <input type="text" value={result.year} onChange={e => {
                          const newResults = [...admissionFormData.semesterResults];
                          newResults[index].year = e.target.value;
                          setAdmissionFormData({...admissionFormData, semesterResults: newResults});
                        }} /></label>
                        <label>Semester: <input type="text" value={result.semester} onChange={e => {
                          const newResults = [...admissionFormData.semesterResults];
                          newResults[index].semester = e.target.value;
                          setAdmissionFormData({...admissionFormData, semesterResults: newResults});
                        }} /></label>
                        <label>Status: <input type="text" value={result.status} onChange={e => {
                          const newResults = [...admissionFormData.semesterResults];
                          newResults[index].status = e.target.value;
                          setAdmissionFormData({...admissionFormData, semesterResults: newResults});
                        }} /></label>
                        <label>Marks & Percentage: <input type="text" value={result.marksPercentage} onChange={e => {
                          const newResults = [...admissionFormData.semesterResults];
                          newResults[index].marksPercentage = e.target.value;
                          setAdmissionFormData({...admissionFormData, semesterResults: newResults});
                        }} /></label>
                        <label>Carry Over Papers: <input type="text" value={result.carryOverPapers} onChange={e => {
                          const newResults = [...admissionFormData.semesterResults];
                          newResults[index].carryOverPapers = e.target.value;
                          setAdmissionFormData({...admissionFormData, semesterResults: newResults});
                        }} /></label>
                        <button type="button" onClick={() => {
                          const newResults = admissionFormData.semesterResults.filter((_, i) => i !== index);
                          setAdmissionFormData({...admissionFormData, semesterResults: newResults});
                        }}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      setAdmissionFormData({...admissionFormData, semesterResults: [...admissionFormData.semesterResults, { year: '', semester: '', status: '', marksPercentage: '', carryOverPapers: '' }]});
                    }}>Add Semester Result</button>
                  </fieldset>
                  <div className="form-actions">
                    <button type="submit" className="action-btn primary">Save</button>
                    <button type="button" className="action-btn secondary" onClick={() => setShowAdmissionForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.map(adm => (
                      <tr key={adm.id}>
                        <td>{adm.studentName}</td>
                        <td>{adm.email}</td>
                        <td><span className={`status ${adm.status.toLowerCase()}`}>{adm.status}</span></td>
                        <td>
                          <button className="btn-sm" onClick={() => {
                            setSelectedStudent(adm);
                            setAdmissionFormData({
                              fatherName: adm.fatherName || '',
                              motherName: adm.motherName || '',
                              dateOfBirth: adm.dateOfBirth ? adm.dateOfBirth.split('T')[0] : '',
                              religion: adm.religion || '',
                              caste: adm.caste || '',
                              domicile: adm.domicile || '',
                              aadharNumber: adm.aadharNumber || '',
                              rollNumber: adm.rollNumber || '',
                              college: adm.college || '',
                              course: adm.course || '',
                              branch: adm.branch || '',
                              admissionDate: adm.admissionDate ? adm.admissionDate.split('T')[0] : '',
                              admissionMode: adm.admissionMode || '',
                              admissionSession: adm.admissionSession || '',
                              academicSession: adm.academicSession || '',
                              currentYear: adm.currentYear || '',
                              currentSemester: adm.currentSemester || '',
                              currentAcademicStatus: adm.currentAcademicStatus || '',
                              scholarshipApplied: adm.scholarshipApplied || '',
                              hostelApplied: adm.hostelApplied || '',
                              contactNumber: adm.contactNumber || '',
                              fatherContactNumber: adm.fatherContactNumber || '',
                              correspondenceAddress: adm.correspondenceAddress || '',
                              permanentAddress: adm.permanentAddress || '',
                              email: adm.email || '',
                              qualifications: adm.qualifications || [{ course: '', streamName: '', boardName: '', rollNumber: '', passingYear: '', subjectDetails: '', marksPercentage: '' }],
                              semesterResults: adm.semesterResults || [{ year: '', semester: '', status: '', marksPercentage: '', carryOverPapers: '' }]
                            });
                            setShowAdmissionForm(true);
                          }}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'profiles':
        return (
          <div className="module-section">
            <h2>Student Profiles</h2>
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => {
                setShowEditProfileForm(true);
                setEditingProfile(null);
              }}>Add Profile</button>
              <button className="action-btn secondary">Bulk Update</button>
              <button className="action-btn secondary">Export Data</button>
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
            </div>

            {/* Student Profiles Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentProfiles.map(profile => (
                    <tr key={profile._id}>
                      <td>{profile.student?.username || 'N/A'}</td>
                      <td>{profile.student?.email || 'N/A'}</td>
                      <td>{profile.rollNumber || 'N/A'}</td>
                      <td>{profile.course || 'N/A'}</td>
                      <td>{profile.branch || 'N/A'}</td>
                      <td><span className="status completed">Complete</span></td>
                      <td>
                        <button
                          className="btn-sm"
                          onClick={() => {
                            setEditingProfile(profile);
                            setShowEditProfileForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn-sm">View</button>
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

            {/* Edit Profile Form */}
            {showEditProfileForm && (
              <div className="edit-profile-form">
                <h3>{editingProfile ? 'Edit Student Profile' : 'Add Student Profile'}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (editingProfile) {
                      await academicCellApi.updateStudentProfile(editingProfile._id, admissionFormData);
                      alert('Profile updated successfully.');
                    } else {
                      await academicCellApi.saveDetailedProfile(admissionFormData);
                      alert('Profile created successfully.');
                    }
                    setShowEditProfileForm(false);
                    setEditingProfile(null);
                    fetchStudentProfiles();
                  } catch (error) {
                    alert('Error saving profile.');
                  }
                }}>
                  <div className="form-row">
                    <label>Roll Number: <input type="text" value={admissionFormData.rollNumber} onChange={e => setAdmissionFormData({...admissionFormData, rollNumber: e.target.value})} /></label>
                    <label>Course: <input type="text" value={admissionFormData.course} onChange={e => setAdmissionFormData({...admissionFormData, course: e.target.value})} /></label>
                    <label>Branch: <input type="text" value={admissionFormData.branch} onChange={e => setAdmissionFormData({...admissionFormData, branch: e.target.value})} /></label>
                  </div>
                  <div className="form-row">
                    <label>Father Name: <input type="text" value={admissionFormData.fatherName} onChange={e => setAdmissionFormData({...admissionFormData, fatherName: e.target.value})} /></label>
                    <label>Mother Name: <input type="text" value={admissionFormData.motherName} onChange={e => setAdmissionFormData({...admissionFormData, motherName: e.target.value})} /></label>
                  </div>
                  <div className="form-row">
                    <label>Contact Number: <input type="text" value={admissionFormData.contactNumber} onChange={e => setAdmissionFormData({...admissionFormData, contactNumber: e.target.value})} /></label>
                    <label>Email: <input type="email" value={admissionFormData.email} onChange={e => setAdmissionFormData({...admissionFormData, email: e.target.value})} /></label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="action-btn primary">Save</button>
                    <button type="button" className="action-btn secondary" onClick={() => {
                      setShowEditProfileForm(false);
                      setEditingProfile(null);
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      default:
        return <div className="module-section"><h2>{modules.find(m => m.id === activeModule)?.name}</h2><p>Content coming soon...</p></div>;
    }
  };

  return (
    <div className="academic-cell-dashboard">
      <header className="top-bar">
        <div className="top-bar-left">
          <h1 className="dashboard-title">Academic Cell Dashboard</h1>
        </div>
        <div className="top-bar-right">
          <div className="alerts">
            <span className="alert-icon">🔔</span>
            <span>{notifications.length} new alerts</span>
          </div>
          <div className="search-box">
            <input type="text" placeholder="Search students, courses..." />
            <button className="search-btn">🔍</button>
          </div>
          <div className="user-menu">
            <span>Academic Officer</span>
            <div className="user-avatar">AO</div>
          </div>
        </div>
      </header>
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
        <section className="metrics-widgets">
          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <div className="metric-number">{metrics.totalEnrolled}</div>
              <div className="metric-label">Total Enrolled</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <div className="metric-number">{metrics.newAdmissions}</div>
              <div className="metric-label">New Admissions</div>
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
            <div className="metric-icon">📄</div>
            <div className="metric-content">
              <div className="metric-number">{metrics.incompleteDocuments}</div>
              <div className="metric-label">Incomplete Docs</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AcademicCellDashboardPage;
