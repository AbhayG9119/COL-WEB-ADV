





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
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [communicationTemplates, setCommunicationTemplates] = useState([]);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
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

  // Function to refresh admissions data
  const refreshAdmissionsData = async () => {
    try {
      const res = await academicCellApi.getStudentProfiles();
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

    // Fetch admissions (using student profiles for detailed data)
    academicCellApi.getStudentProfiles().then(res => setAdmissions(res.data.data || [])).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setAdmissions([]);
    });

    // Fetch pending profiles
    academicCellApi.getPendingProfiles().then(res => setPendingProfiles(res.data.data || [])).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setPendingProfiles([]);
    });



    // Fetch courses
    academicCellApi.getCourses().then(res => setCourses(res.data || [])).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setCourses([]);
    });

    // Fetch notifications
    academicCellApi.getNotifications().then(res => setNotifications(res.data.data || [])).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setNotifications([]);
    });

    // Fetch tasks
    academicCellApi.getTasks().then(res => setTasks(res.data.data || [])).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setTasks([]);
    });

  // Fetch communication templates
  academicCellApi.getCommunicationTemplates().then(res => setCommunicationTemplates(res.data || [])).catch(err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    }
    setCommunicationTemplates([]);
  });

  // Fetch students for document upload
  academicCellApi.getStudents().then(res => setStudentsList(res.data.data || [])).catch(err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    }
    setStudentsList([]);
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
    { id: 'attendance', name: 'Professional Attendance', icon: '📊' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈' },
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
                    // Validate required fields
                    if (!admissionFormData.student) {
                      alert('Student ID is required.');
                      return;
                    }

                    const payload = { ...admissionFormData };

                    // Ensure student field is included in payload
                    if (!payload.student && selectedStudent) {
                      payload.student = selectedStudent.student?._id || selectedStudent._id;
                    }

                    // Clean up payload - remove empty arrays if they are empty
                    if (payload.qualifications && payload.qualifications.length === 1 && !payload.qualifications[0].course) {
                      payload.qualifications = [];
                    }
                    if (payload.semesterResults && payload.semesterResults.length === 1 && !payload.semesterResults[0].year) {
                      payload.semesterResults = [];
                    }

                    // Remove fields not in the schema
                    const { studentName, ...cleanPayload } = payload;

                    // Collect files to upload
                    const documentTypeMap = {
                      tenthMarksheet: '10th_marksheet',
                      twelfthMarksheet: '12th_marksheet',
                      aadharCard: 'aadhar_card',
                      incomeCertificate: 'income_certificate',
                      casteCertificate: 'caste_certificate',
                      bankPassbook: 'bank_passbook',
                      transferCertificate: 'transfer_certificate',
                      photo: 'photo',
                      signature: 'signature'
                    };

                    const filesToUpload = [];
                    Object.entries(cleanPayload.documents).forEach(([key, value]) => {
                      if (value.file) {
                        filesToUpload.push({
                          documentType: documentTypeMap[key],
                          file: value.file,
                          remarks: value.remarks || ''
                        });
                      }
                    });

                    // Convert documents object to array format expected by backend (without files)
                    if (cleanPayload.documents) {
                      cleanPayload.documents = Object.entries(cleanPayload.documents)
                        .filter(([key, value]) => value.fileName || value.status !== 'Pending')
                        .map(([key, value]) => ({
                          documentType: documentTypeMap[key],
                          status: value.status.toLowerCase(),
                          uploadedAt: value.uploadDate ? new Date(value.uploadDate).toISOString() : new Date().toISOString()
                        }));
                    }

                    console.log('Submitting payload:', JSON.stringify(cleanPayload, null, 2));

                    let response;
                    // Determine if this is a create or update operation
                    if (selectedStudent && selectedStudent._id) {
                      console.log('Updating existing profile with ID:', selectedStudent._id);
                      response = await academicCellApi.updateStudentProfile(selectedStudent._id, cleanPayload);
                    } else {
                      console.log('Creating new profile');
                      response = await academicCellApi.saveDetailedProfile(cleanPayload);
                    }

                    if (response && response.data) {
                      // Upload documents if any
                      let uploadSuccessCount = 0;
                      let uploadErrors = [];
                      for (const fileItem of filesToUpload) {
                        try {
                          await academicCellApi.uploadStudentDocument(cleanPayload.student, fileItem.documentType, fileItem.file, fileItem.remarks);
                          uploadSuccessCount++;
                        } catch (uploadError) {
                          console.error(`Error uploading ${fileItem.documentType}:`, uploadError);
                          uploadErrors.push(fileItem.documentType);
                        }
                      }

                      // Show appropriate message
                      if (filesToUpload.length > 0) {
                        if (uploadErrors.length === 0) {
                          alert(`Admission data and all ${uploadSuccessCount} documents saved successfully.`);
                        } else {
                          alert(`Admission data saved, but ${uploadErrors.length} documents failed to upload: ${uploadErrors.join(', ')}`);
                        }
                      } else {
                        alert('Admission data saved successfully.');
                      }

                      setShowAdmissionForm(false);
                      setSelectedStudent(null);
                      // Refresh the admissions data
                      const refreshResponse = await academicCellApi.getStudentProfiles();
                      setAdmissions(refreshResponse.data.data || []);
                    } else {
                      alert('Failed to save admission data.');
                    }
                  } catch (error) {
                    console.error('Error saving admission data:', error);
                    console.error('Error response:', error.response);
                    console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
                    console.error('Error response status:', error.response?.status);

                    if (error.response?.status === 400) {
                      const errorMessage = error.response.data?.message || 'Please check all required fields are filled correctly.';
                      alert(`Validation error: ${errorMessage}`);
                    } else if (error.response?.status === 409) {
                      alert('Profile already exists for this student. Please use the Edit option instead.');
                    } else if (error.response?.status === 404) {
                      alert('Student not found. Please check the student ID and try again.');
                    } else if (error.response?.status === 401) {
                      alert('Authentication failed. Please login again.');
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    } else if (error.response?.status === 500) {
                      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Internal server error. Check backend logs for details.';
                      alert(`Server error: ${errorMessage}`);
                    } else {
                      const errorMessage = error.response?.data?.message || error.message;
                      alert(`Error saving admission data: ${errorMessage}`);
                    }
                  }
                }}>
                  {/* Student Information */}
                  <fieldset>
                    <legend>Student Information</legend>
                    <label>Student Name: <input type="text" value={admissionFormData.studentName} onChange={e => setAdmissionFormData({...admissionFormData, studentName: e.target.value})} placeholder="Enter student name" /></label>
                    <label>Student ID: <input type="text" value={admissionFormData.student} onChange={e => setAdmissionFormData({...admissionFormData, student: e.target.value})} placeholder="Enter student ID" /></label>
                  </fieldset>
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
                      <div key={`qual-${index}`} className="qualification-entry">
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
                      <div key={`semester-${index}`} className="semester-result-entry">
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
                  {/* Documents */}
                  <fieldset>
                    <legend>Documents</legend>
                    <label>10th Marksheet: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('tenthMarksheet', e.target.files[0])} /></label>
                    <label>12th Marksheet: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('twelfthMarksheet', e.target.files[0])} /></label>
                    <label>Aadhar Card: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('aadharCard', e.target.files[0])} /></label>
                    <label>Income Certificate: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('incomeCertificate', e.target.files[0])} /></label>
                    <label>Caste Certificate: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('casteCertificate', e.target.files[0])} /></label>
                    <label>Bank Passbook: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('bankPassbook', e.target.files[0])} /></label>
                    <label>Transfer Certificate: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('transferCertificate', e.target.files[0])} /></label>
                    <label>Photo: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('photo', e.target.files[0])} /></label>
                    <label>Signature: <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleDocumentChange('signature', e.target.files[0])} /></label>
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
                      <tr key={adm._id}>
                        <td>{adm.student?.username || 'N/A'}</td>
                        <td>{adm.email}</td>
                        <td><span className={`status ${adm.status ? adm.status.toLowerCase() : 'pending'}`}>{adm.status || 'Pending'}</span></td>
                        <td>
                          <button className="btn-sm" onClick={() => {
                            try {
                              setSelectedStudent(adm);
                              setAdmissionFormData({
                                student: adm.student?._id || adm._id, // Use student ID or admission ID
                                studentName: adm.student?.username || '',
                                fatherName: adm.fatherName || '',
                                motherName: adm.motherName || '',
                                dateOfBirth: adm.dateOfBirth ? new Date(adm.dateOfBirth).toISOString().split('T')[0] : '',
                                religion: adm.religion || '',
                                caste: adm.caste || '',
                                domicile: adm.domicile || '',
                                aadharNumber: adm.aadharNumber || '',
                                rollNumber: adm.rollNumber || '',
                                college: adm.college || '',
                                course: adm.course || '',
                                branch: adm.branch || '',
                                admissionDate: adm.admissionDate ? new Date(adm.admissionDate).toISOString().split('T')[0] : '',
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
                                semesterResults: adm.semesterResults || [{ year: '', semester: '', status: '', marksPercentage: '', carryOverPapers: '' }],
                                documents: adm.documents || {
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
                              setShowAdmissionForm(true);
                            } catch (error) {
                              console.error('Error setting edit form data:', error);
                              alert('Error loading edit form. Please try again.');
                            }
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

      case 'attendance':
        return (
          <div className="module-section">
            <h2>Professional Attendance Management</h2>
            <div className="quick-actions">
              <button className="action-btn primary">View Real-time Dashboard</button>
              <button className="action-btn secondary">Generate Report</button>
              <button className="action-btn secondary">Export Data</button>
            </div>

            {/* Real-time Status */}
            <div className="real-time-status">
              <div className="status-indicator">
                <span className="live-dot"></span>
                <span>Live Updates Active</span>
              </div>
              <div className="last-updated">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Attendance Overview Cards */}
            <div className="attendance-overview">
              <div className="overview-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <div className="card-number">1,247</div>
                  <div className="card-label">Total Records Today</div>
                </div>
              </div>
              <div className="overview-card">
                <div className="card-icon">✅</div>
                <div className="card-content">
                  <div className="card-number">892</div>
                  <div className="card-label">Present Today</div>
                </div>
              </div>
              <div className="overview-card">
                <div className="card-icon">❌</div>
                <div className="card-content">
                  <div className="card-number">234</div>
                  <div className="card-label">Absent Today</div>
                </div>
              </div>
              <div className="overview-card">
                <div className="card-icon">⏰</div>
                <div className="card-content">
                  <div className="card-number">121</div>
                  <div className="card-label">Late Today</div>
                </div>
              </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="activity-feed">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-time">2 mins ago</div>
                  <div className="activity-content">
                    <strong>John Doe</strong> marked present for Computer Science - Data Structures
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-time">5 mins ago</div>
                  <div className="activity-content">
                    <strong>Jane Smith</strong> marked absent for Mathematics - Calculus
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-time">8 mins ago</div>
                  <div className="activity-content">
                    <strong>Bob Johnson</strong> updated attendance for Physics - Mechanics
                  </div>
                </div>
              </div>
            </div>

            {/* Department-wise Attendance */}
            <div className="department-attendance">
              <h3>Department-wise Attendance</h3>
              <div className="department-grid">
                <div className="department-card">
                  <div className="department-name">Computer Science</div>
                  <div className="department-stats">
                    <div className="stat-item">
                      <span className="stat-label">Present:</span>
                      <span className="stat-value">156/180</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Attendance:</span>
                      <span className="stat-value">86.7%</span>
                    </div>
                  </div>
                </div>
                <div className="department-card">
                  <div className="department-name">Mathematics</div>
                  <div className="department-stats">
                    <div className="stat-item">
                      <span className="stat-label">Present:</span>
                      <span className="stat-value">89/95</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Attendance:</span>
                      <span className="stat-value">93.7%</span>
                    </div>
                  </div>
                </div>
                <div className="department-card">
                  <div className="department-name">Physics</div>
                  <div className="department-stats">
                    <div className="stat-item">
                      <span className="stat-label">Present:</span>
                      <span className="stat-value">134/150</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Attendance:</span>
                      <span className="stat-value">89.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="module-section">
            <h2>Document Verification</h2>
            <div className="quick-actions">
              <button className="action-btn primary">Bulk Verify</button>
              <button className="action-btn secondary">Export Report</button>
              <button className="action-btn secondary">Send Notifications</button>
            </div>

            {/* Document Verification Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>Status</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map(adm =>
                    Object.entries(adm.documents || {}).map(([docType, docData]) => (
                      <tr key={`${adm._id}-doc-${docType}`}>
                        <td>{adm.student?.username || 'N/A'}</td>
                        <td>{adm.rollNumber || 'N/A'}</td>
                        <td>{docType}</td>
                        <td>{docData.fileName || 'N/A'}</td>
                        <td><span className={`status ${docData.status ? docData.status.toLowerCase() : 'pending'}`}>{docData.status || 'Pending'}</span></td>
                        <td>{docData.uploadDate ? new Date(docData.uploadDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <button className="btn-sm" onClick={async () => {
                            try {
                              const updatedDocs = { ...(adm.documents || {}) };
                              updatedDocs[docType].status = 'Verified';
                              await academicCellApi.updateStudentProfile(adm._id, { documents: updatedDocs });
                              alert('Document verified successfully.');
                              refreshAdmissionsData();
                            } catch (error) {
                              alert('Error verifying document.');
                            }
                          }}>Verify</button>
                          <button className="btn-sm reject" onClick={async () => {
                            try {
                              const updatedDocs = { ...(adm.documents || {}) };
                              updatedDocs[docType].status = 'Rejected';
                              await academicCellApi.updateStudentProfile(adm._id, { documents: updatedDocs });
                              alert('Document rejected.');
                              refreshAdmissionsData();
                            } catch (error) {
                              alert('Error rejecting document.');
                            }
                          }}>Reject</button>
                          <button className="btn-sm">View</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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

        {/* Module Content */}
        <div className="module-content">
          {renderModuleContent()}
        </div>
      </main>
    </div>
  );
};

export default AcademicCellDashboardPage;
