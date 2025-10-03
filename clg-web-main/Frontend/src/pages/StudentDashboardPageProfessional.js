import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentApi from '../services/studentApi';
import '../styles/StudentDashboard.css';
import '../styles/StudentDashboardProfessional.css';

const BACKEND_BASE_URL = 'http://localhost:5000';

// Expected documents list with backend enum mapping
const EXPECTED_DOCUMENTS = [
  { name: '10th', type: '10th_marksheet' },
  { name: '12th', type: '12th_marksheet' },
  { name: 'Aadhar Card', type: 'aadhar_card' },
  { name: 'Income Certificate', type: 'income_certificate' },
  { name: 'Caste Certificate', type: 'caste_certificate' },
  { name: 'Bank Passbook', type: 'bank_passbook' },
  { name: 'Transfer Certificate', type: 'transfer_certificate' },
  { name: 'Photo', type: 'photo' },
  { name: 'Signature', type: 'signature' }
];

function StudentDashboardPageProfessional() {
  const [profile, setProfile] = useState(null);
  const [detailedProfile, setDetailedProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [courseContent, setCourseContent] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const navigate = useNavigate();

  // Function to view documents
  const handleViewDocument = async (document) => {
    try {
      const response = await studentApi.getDocumentFile(document._id);
      if (response && response.data) {
        const blob = new Blob([response.data], { type: document.mimeType || 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        alert('Document not available for viewing');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Error viewing document');
    }
  };

  // Function to download study material
  const handleDownloadStudyMaterial = async (material) => {
    try {
      const response = await studentApi.downloadStudyMaterial(material._id);
      if (response && response.data) {
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = material.fileName;
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        alert('Study material not available for download');
      }
    } catch (error) {
      console.error('Error downloading study material:', error);
      alert('Error downloading study material');
    }
  };

  // Function to download document
  const handleDownloadDocument = async (document) => {
    try {
      const response = await studentApi.getDocumentFile(document._id);
      if (response && response.data) {
        const blob = new Blob([response.data], { type: document.mimeType || 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = document.fileName;
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        alert('Document not available for download');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('Token from localStorage:', token);
    console.log('Role from localStorage:', role);
    if (!token || role !== 'student') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const profileResponse = await studentApi.getProfile();
      console.log('Profile response:', profileResponse.data);
      setProfile(profileResponse.data);

      const detailedProfileResponse = await studentApi.getDetailedProfile();
      console.log('Detailed Profile response:', detailedProfileResponse.data);
      setDetailedProfile(detailedProfileResponse.data);

      const eventsResponse = await studentApi.getEvents();
      setEvents(eventsResponse.data);
      setRegisteredEvents(eventsResponse.data.filter(event =>
        event.registrations.some(reg => reg.studentId === profileResponse.data._id)
      ));

      const attendanceResponse = await studentApi.getAttendance();
      setAttendance(attendanceResponse.data);

      const examResultsResponse = await studentApi.getExamResults();
      setExamResults(examResultsResponse.data);

      const studyMaterialsResponse = await studentApi.getStudyMaterials();
      setStudyMaterials(studyMaterialsResponse.data);

      const courseContentResponse = await studentApi.getCourseContent();
      setCourseContent(courseContentResponse.data);

      const documentsResponse = await studentApi.getDocuments();
      setDocuments(documentsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      const response = await studentApi.uploadProfilePicture(formData);
      if (response.data && response.data.profilePicture) {
        setProfile(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
        setSelectedFile(null);
        alert('Profile picture uploaded successfully!');
      } else {
        setError('Failed to upload photo');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during photo upload';
      setError(errorMessage);
    }
    setUploading(false);
  };

  const handleFileChangeDoc = (e, docType) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedDocs(prev => ({ ...prev, [docType]: e.target.files[0] }));
    }
  };

  const handleUploadDocument = async (docName) => {
    const file = selectedDocs[docName];
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    setUploadingDoc(docName);
    setError('');
    try {
      // Find the corresponding backend document type
      const docConfig = EXPECTED_DOCUMENTS.find(doc => doc.name === docName);
      const backendDocType = docConfig ? docConfig.type : docName;

      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', backendDocType);
      await studentApi.uploadDocument(formData);
      alert(`${docName} uploaded successfully!`);
      // Clear selection
      setSelectedDocs(prev => ({ ...prev, [docName]: null }));
      // Refetch data to update documents list
      await fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during document upload';
      setError(errorMessage);
      alert(errorMessage);
    }
    setUploadingDoc('');
  };

  const handleEdit = () => {
    setEditedProfile({
      username: profile.username || '',
      email: profile.email || '',
      mobileNumber: profile.mobileNumber || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setError('');
    try {
      const response = await studentApi.updateProfile(editedProfile);
      if (response.data.success) {
        setProfile(prev => ({ ...prev, ...editedProfile }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during profile update';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="section-content profile-section">
            <h2>Profile & Admission</h2>
            {profile ? (
              <div className="profile-card enhanced-profile-card">
                <div className="student-avatar">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/default-profile.png'; }}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="profile-details">
                  {isEditing ? (
                    <>
                      <p><strong>Name:</strong> <input type="text" value={editedProfile.username} onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))} /></p>
                      <p><strong>Email:</strong> <input type="email" value={editedProfile.email} onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))} /></p>
                      <p><strong>Phone:</strong> <input type="text" value={editedProfile.mobileNumber} onChange={(e) => setEditedProfile(prev => ({ ...prev, mobileNumber: e.target.value }))} /></p>
                    </>
                  ) : (
                    <>
                      <p><strong>Name:</strong> {profile.name || profile.username}</p>
                      <p><strong>Email:</strong> {profile.email}</p>
                      <p><strong>Phone:</strong> {profile.mobileNumber || 'N/A'}</p>
                    </>
                  )}
                  <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
                  <p><strong>Year:</strong> {profile.year || 'N/A'}</p>
                  <p><strong>Semester:</strong> {profile.semester || 'N/A'}</p>
                  <p><strong>Admission Date:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="profile-actions">
                  {isEditing ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={handleEdit}>Edit Profile</button>
                  )}
                </div>
                <div className="profile-photo-container">
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <button onClick={handleUpload} disabled={uploading || !selectedFile}>
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </div>
                {error && <p className="error">{error}</p>}
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        );
      case 'detailedProfile':
        return (
          <div className="section-content detailed-profile-section">
            <h2>Detailed Profile</h2>
            {detailedProfile ? (
              <div className="detailed-profile-card">
                <section>
                  <h3>Personal Profile</h3>
                  <p>Father Name: {detailedProfile.fatherName}</p>
                  <p>Mother Name: {detailedProfile.motherName}</p>
                  <p>Date of Birth: {detailedProfile.dateOfBirth ? new Date(detailedProfile.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                  <p>Religion: {detailedProfile.religion}</p>
                  <p>Caste: {detailedProfile.caste}</p>
                  <p>Domicile: {detailedProfile.domicile}</p>
                  <p>Aadhar Number: {detailedProfile.aadharNumber}</p>
                </section>
                <section>
                  <h3>Academic Profile</h3>
                  <p>Roll Number: {detailedProfile.rollNumber}</p>
                  <p>College: {detailedProfile.college}</p>
                  <p>Department: {detailedProfile.course}</p>
                  <p>Branch: {detailedProfile.branch}</p>
                  <p>Admission Date: {detailedProfile.admissionDate ? new Date(detailedProfile.admissionDate).toLocaleDateString() : 'N/A'}</p>
                  <p>Admission Mode: {detailedProfile.admissionMode}</p>
                  <p>Admission Session: {detailedProfile.admissionSession}</p>
                  <p>Academic Session: {detailedProfile.academicSession}</p>
                  <p>Current Year: {detailedProfile.currentYear}</p>
                  <p>Current Semester: {detailedProfile.currentSemester}</p>
                  <p>Current Academic Status: {detailedProfile.currentAcademicStatus}</p>
                  <p>Scholarship Applied: {detailedProfile.scholarshipApplied}</p>
                </section>
                <section>
                  <h3>Hostel Details</h3>
                  <p>Hostel Applied: {detailedProfile.hostelApplied}</p>
                </section>
                <section>
                  <h3>Contact Details</h3>
                  <p>Contact Number: {detailedProfile.contactNumber}</p>
                  <p>Father Contact Number: {detailedProfile.fatherContactNumber}</p>
                  <p>Correspondence Address: {detailedProfile.correspondenceAddress}</p>
                  <p>Permanent Address: {detailedProfile.permanentAddress}</p>
                  <p>Email: {detailedProfile.email}</p>
                </section>
                <section>
                  <h3>Qualification Details</h3>
                  {detailedProfile.qualifications && detailedProfile.qualifications.length > 0 ? (
                    <table border="1" cellPadding="5" cellSpacing="0">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Stream Name</th>
                          <th>Board Name</th>
                          <th>Roll Number</th>
                          <th>Passing Year</th>
                          <th>Subject Details</th>
                          <th>Marks & Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedProfile.qualifications.map((qual, index) => (
                          <tr key={index}>
                            <td>{qual.course}</td>
                            <td>{qual.streamName}</td>
                            <td>{qual.boardName}</td>
                            <td>{qual.rollNumber}</td>
                            <td>{qual.passingYear}</td>
                            <td>{qual.subjectDetails}</td>
                            <td>{qual.marksPercentage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No qualification details available.</p>
                  )}
                </section>
                <section>
                  <h3>Year/Semester Result Details</h3>
                  {detailedProfile.semesterResults && detailedProfile.semesterResults.length > 0 ? (
                    <table border="1" cellPadding="5" cellSpacing="0">
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Semester</th>
                          <th>Status</th>
                          <th>Marks & Percentage</th>
                          <th>Carry Over Papers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedProfile.semesterResults.map((result, index) => (
                          <tr key={index}>
                            <td>{result.year}</td>
                            <td>{result.semester}</td>
                            <td>{result.status}</td>
                            <td>{result.marksPercentage}</td>
                            <td>{result.carryOverPapers}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No semester result details available.</p>
                  )}
                </section>
              </div>
            ) : (
              <p>Loading detailed profile...</p>
            )}
          </div>
        );
      case 'department':
        return (
          <div className="section-content">
            <h2>Department Registration</h2>
            {courseContent ? (
              <div>
                {courseContent.semesters.map((semester) => (
                  <div key={semester.semesterNumber} className="semester-section">
                    <h3>Semester {semester.semesterNumber}</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Subject Code</th>
                          <th>Subject Name</th>
                          <th>Credits</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.subjects.map((subject) => (
                          <tr key={subject.code}>
                            <td>{subject.code}</td>
                            <td>{subject.name}</td>
                            <td>{subject.credits}</td>
                            <td>{subject.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading course content...</p>
            )}
          </div>
        );
      case 'timetable':
        const totalClasses = attendance.totalClasses || 0;
        const presentClasses = attendance.present || 0;
        const absentClasses = totalClasses - presentClasses;
        const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

        return (
          <div className="section-content">
            <h2>Timetable & Attendance</h2>

            {/* Professional Attendance Statistics Cards */}
            <div className="attendance-stats-grid">
              <div className="stat-card present">
                <div className="circular-progress" style={{'--percentage': `${attendancePercentage}%`}}>
                  <div className="circular-progress-inner">
                    <span className="percentage-text">{attendancePercentage}%</span>
                  </div>
                </div>
                <h3>Overall Attendance</h3>
                <p>{presentClasses} out of {totalClasses} classes</p>
              </div>

              <div className="stat-card total">
                <div className="stat-number">{presentClasses}</div>
                <h3>Present</h3>
                <p>Classes attended</p>
              </div>

              <div className="stat-card absent">
                <div className="stat-number">{absentClasses}</div>
                <h3>Absent</h3>
                <p>Classes missed</p>
              </div>

              <div className="stat-card total">
                <div className="stat-number">{totalClasses}</div>
                <h3>Total Classes</h3>
                <p>Overall classes</p>
              </div>
            </div>

            {/* Subject-wise Attendance Breakdown */}
            <div className="subject-attendance-breakdown">
              <h3>Subject-wise Attendance</h3>
              <div className="subject-grid">
                {courseContent && courseContent.semesters && courseContent.semesters.map(semester =>
                  semester.subjects.map(subject => {
                    const subjectAttendance = (attendance.records || []).filter(record =>
                      record.subject === subject.name
                    );
                    const subjectPresent = subjectAttendance.filter(record => record.status === 'present').length;
                    const subjectTotal = subjectAttendance.length;
                    const subjectPercentage = subjectTotal > 0 ? Math.round((subjectPresent / subjectTotal) * 100) : 0;

                    return (
                      <div key={subject.code} className="subject-card">
                        <div className="subject-header">
                          <h4>{subject.name}</h4>
                          <span className="subject-code">{subject.code}</span>
                        </div>
                        <div className="subject-progress">
                          <div className="mini-circular-progress" style={{'--percentage': `${subjectPercentage}%`}}>
                            <span className="mini-percentage">{subjectPercentage}%</span>
                          </div>
                        </div>
                        <div className="subject-stats">
                          <span className="present-count">{subjectPresent} Present</span>
                          <span className="total-count">{subjectTotal} Total</span>
                        </div>
                        <div className="attendance-status">
                          {subjectTotal === 0 ? (
                            <span className="status-pending">No classes yet</span>
                          ) : subjectPercentage >= 75 ? (
                            <span className="status-good">Good Attendance</span>
                          ) : subjectPercentage >= 60 ? (
                            <span className="status-warning">Needs Improvement</span>
                          ) : (
                            <span className="status-danger">Low Attendance</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Detailed Attendance Records */}
            <div className="attendance-records">
              <h3>Recent Attendance Records</h3>
              <div className="records-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(attendance.records || []).slice(0, 10).map((record, index) => (
                      <tr key={index}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.subject}</td>
                        <td>
                          <span className={`status-badge ${record.status}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{record.facultyId?.username || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(attendance.records || []).length === 0 && (
                  <div className="no-records">
                    <p>No attendance records found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="section-content">
            <h2>Assignments</h2>
            <div className="assignment-list">
              {/* Assuming forms are assignments */}
              {profile && (
                <div className="assignment-item">
                  <h4>Submitted Forms</h4>
                  <p>You have submitted {profile.formsCount || 0} forms.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'exams':
        return (
          <div className="section-content">
            <h2>Exams & Results</h2>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Max Marks</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.category}</td>
                    <td>{result.subject}</td>
                    <td>{result.marks}</td>
                    <td>{result.maxMarks}</td>
                    <td className="grade">{result.grade}</td>
                    <td>{new Date(result.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {examResults.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No results available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case 'study':
        return (
          <div className="section-content">
            <h2>Study Material / LMS</h2>
            <div className="material-list">
              {studyMaterials.map((material, index) => (
                <div key={index} className="material-item">
                  <h4>{material.title}</h4>
                  <p>{material.description}</p>
                  <button
                    className="btn-download"
                    onClick={() => handleDownloadStudyMaterial(material)}
                    title="Download Material"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="section-content">
            <h2>Documents & Certificates</h2>

            {/* Document Summary - Always Visible */}
            <div className="documents-overview">
              <div className="documents-summary">
                <h3>Document Summary</h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-number">{documents ? documents.length : 0}</span>
                    <span className="stat-label">Total Documents</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{documents ? documents.filter(doc => doc.status === 'verified').length : 0}</span>
                    <span className="stat-label">Verified</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{documents ? documents.filter(doc => doc.status === 'pending').length : 0}</span>
                    <span className="stat-label">Pending</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{documents ? documents.filter(doc => doc.status === 'rejected').length : 0}</span>
                    <span className="stat-label">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Categories Status - Always Visible */}
            <div className="document-categories">
              <h3>Document Categories Status</h3>
              <div className="categories-grid">
                {[
                  {
                    name: 'Personal Photo',
                    docs: documents ? documents.filter(doc => doc.documentType === 'photo') : []
                  },
                  {
                    name: 'Aadhar Card',
                    docs: documents ? documents.filter(doc => doc.documentType === 'aadhar_card') : []
                  },
                  {
                    name: 'Mark Sheets',
                    docs: documents ? documents.filter(doc => doc.documentType === '10th_marksheet' || doc.documentType === '12th_marksheet') : []
                  },
                  {
                    name: 'Certificates',
                    docs: documents ? documents.filter(doc => doc.documentType === 'transfer_certificate' || doc.documentType === 'migration_certificate') : []
                  },
                  {
                    name: 'Domicile',
                    docs: documents ? documents.filter(doc => doc.documentType === 'income_certificate') : []
                  },
                  {
                    name: 'Caste Certificate',
                    docs: documents ? documents.filter(doc => doc.documentType === 'caste_certificate') : []
                  },
                  {
                    name: 'Other Documents',
                    docs: documents ? documents.filter(doc =>
                      doc.documentType !== 'photo' &&
                      doc.documentType !== 'aadhar_card' &&
                      doc.documentType !== '10th_marksheet' &&
                      doc.documentType !== '12th_marksheet' &&
                      doc.documentType !== 'transfer_certificate' &&
                      doc.documentType !== 'migration_certificate' &&
                      doc.documentType !== 'income_certificate' &&
                      doc.documentType !== 'caste_certificate'
                    ) : []
                  }
                ].map((category, index) => (
                  <div key={index} className="category-card">
                    <div className="category-header">
                      <h4>{category.name}</h4>
                    </div>
                    <div className="category-stats">
                      <span className="category-count">{category.docs.length}</span>
                      <span className="category-label">documents</span>
                    </div>
                    <div className="category-status">
                      {category.docs.filter(doc => doc.status === 'verified').length > 0 && (
                        <span className="status-approved">{category.docs.filter(doc => doc.status === 'verified').length} Verified</span>
                      )}
                      {category.docs.filter(doc => doc.status === 'pending').length > 0 && (
                        <span className="status-pending">{category.docs.filter(doc => doc.status === 'pending').length} Pending</span>
                      )}
                      {category.docs.filter(doc => doc.status === 'rejected').length > 0 && (
                        <span className="status-rejected">{category.docs.filter(doc => doc.status === 'rejected').length} Rejected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Table - Only show if documents exist */}
            {documents && documents.length > 0 && (
              <div className="documents-table-container">
                <h3>Uploaded Documents</h3>
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Original Name</th>
                      <th>File Size</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th>Uploaded Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document, index) => (
                      <tr key={index}>
                        <td>{document.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        <td>{document.fileName}</td>
                        <td>{document.fileSize ? `${(document.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${document.status.toLowerCase()}`}>
                            {document.status}
                          </span>
                        </td>
                        <td>{document.remarks || 'N/A'}</td>
                        <td>{new Date(document.uploadDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={() => handleViewDocument(document)}
                            title="View Document"
                          >
                            View
                          </button>
                          <button
                            className="btn-download"
                            onClick={() => handleDownloadDocument(document)}
                            title="Download Document"
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

            {/* Document Upload Section - Always Visible */}
            <div className="document-upload-section">
              <h4>Upload Documents</h4>
              <div className="upload-grid">
                {EXPECTED_DOCUMENTS.map((doc, index) => (
                  <div key={index} className="upload-item">
                    <span className="upload-name">{doc.name}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChangeDoc(e, doc.name)}
                    />
                    <button
                      className="btn-upload"
                      onClick={() => handleUploadDocument(doc.name)}
                      disabled={uploadingDoc === doc.name || !selectedDocs[doc.name]}
                    >
                      {uploadingDoc === doc.name ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                ))}
              </div>
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
        <h1>Student Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>Profile & Admission</li>
          <li className={activeSection === 'detailedProfile' ? 'active' : ''} onClick={() => setActiveSection('detailedProfile')}>View Profile</li>
          <li className={activeSection === 'documents' ? 'active' : ''} onClick={() => setActiveSection('documents')}>Documents</li>
          <li className={activeSection === 'department' ? 'active' : ''} onClick={() => setActiveSection('department')}>Department Registration</li>
          <li className={activeSection === 'timetable' ? 'active' : ''} onClick={() => setActiveSection('timetable')}>Timetable & Attendance</li>
          <li className={activeSection === 'assignments' ? 'active' : ''} onClick={() => setActiveSection('assignments')}>Assignments</li>
          <li className={activeSection === 'exams' ? 'active' : ''} onClick={() => setActiveSection('exams')}>Exams & Results</li>
          <li className={activeSection === 'study' ? 'active' : ''} onClick={() => setActiveSection('study')}>Study Material / LMS</li>
        </ul>
      </nav>
      <div className="dashboard-main">
        {renderSection()}
      </div>
    </div>
  );
}

export default StudentDashboardPageProfessional;
