import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentApi from '../services/studentApi';
import '../styles/StudentDashboard.css';

const BACKEND_BASE_URL = 'http://localhost:5000';

function StudentDashboardPageEnhanced() {
  const [profile, setProfile] = useState(null);
  const [detailedProfile, setDetailedProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="section-content profile-section">
            <h2>Profile & Admission</h2>
            {profile ? (
              <div className="profile-card enhanced-profile-card">
                <div className="profile-photo-container">
{profile.profilePicture ? (
  <img
    src={BACKEND_BASE_URL + profile.profilePicture}
    alt="Profile"
    className="profile-photo"
    onError={(e) => { e.target.onerror = null; e.target.src = '/default-profile.png'; }}
  />
) : (
  <div className="profile-photo-placeholder">No Photo</div>
)}
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <button onClick={handleUpload} disabled={uploading || !selectedFile}>
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </div>
                <div className="profile-details">
                  <p><strong>Name:</strong> {profile.name || profile.username}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Student ID:</strong> {profile.studentId}</p>
                  <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
                  <p><strong>Admission Date:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
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
                  <p>Course: {detailedProfile.course}</p>
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
                          <th>Course</th>
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
      case 'course':
        return (
          <div className="section-content">
            <h2>Course Registration</h2>
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
        return (
          <div className="section-content">
            <h2>Timetable & Attendance</h2>
            <div className="attendance-summary">
              <div className="attendance-item">
                <span>Total Classes: {attendance.totalClasses || 0}</span>
                <span className="attendance-percentage">Present: {attendance.present || 0}</span>
              </div>
              <div className="attendance-item">
                <span>Attendance Percentage: {attendance.percentage || 0}%</span>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(attendance.records || []).map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.subject}</td>
                    <td className={record.status === 'present' ? 'status-registered' : ''}>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <th>Subject</th>
                  <th>Exam Date</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.subject}</td>
                    <td>{result.date}</td>
                    <td className="grade">{result.grade}</td>
                  </tr>
                ))}
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
                  <button className="btn-download">Download</button>
                </div>
              ))}
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
          <li className={activeSection === 'course' ? 'active' : ''} onClick={() => setActiveSection('course')}>Course Registration</li>
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

export default StudentDashboardPageEnhanced;
        