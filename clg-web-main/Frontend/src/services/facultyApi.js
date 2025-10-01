import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/faculty';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const facultyApi = {
  // Existing methods
  getEvents: () => axios.get(`${API_BASE_URL}/events`, { headers: getAuthHeaders() }),
  createEvent: (eventData) => axios.post(`${API_BASE_URL}/events`, eventData, { headers: getAuthHeaders() }),
  approveEvent: (eventId, status) =>
    axios.patch(`${API_BASE_URL}/events/${eventId}/approve`, { status }, { headers: getAuthHeaders() }),
  getStudents: () => axios.get(`${API_BASE_URL}/students`, { headers: getAuthHeaders() }),

  // Enhanced student endpoints for professional attendance system
  getAllStudents: () => axios.get(`${API_BASE_URL}/students/all`, { headers: getAuthHeaders() }),
  getStudentsByDepartment: (department) => axios.get(`${API_BASE_URL}/students/department/${department}`, { headers: getAuthHeaders() }),

  // Enhanced attendance endpoints
  markAttendance: (attendanceData) => axios.post(`${API_BASE_URL}/attendance`, attendanceData, { headers: getAuthHeaders() }),
  markBulkAttendance: (attendanceData) => axios.post(`${API_BASE_URL}/attendance/bulk`, attendanceData, { headers: getAuthHeaders() }),
  getAttendanceRecords: (params) => axios.get(`${API_BASE_URL}/attendance`, { headers: getAuthHeaders(), params }),
  getDetailedAttendanceRecords: (params) => axios.get(`${API_BASE_URL}/attendance/detailed`, { headers: getAuthHeaders(), params }),
  getDayWiseAttendanceRecords: (params) => {
    console.log('Calling getDayWiseAttendanceRecords with params:', params);
    return axios.get(`${API_BASE_URL}/attendance/day-wise`, { headers: getAuthHeaders(), params })
      .then(response => {
        console.log('getDayWiseAttendanceRecords success:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Error in getDayWiseAttendanceRecords:', error);

        // If it's a 500 error or network error, return empty array instead of throwing
        if (error.response?.status === 500 || error.code === 'NETWORK_ERROR') {
          console.log('Returning empty array for day-wise attendance due to server error');
          return { data: [] };
        }

        // For other errors (like 400, 401, 403), still throw the error
        throw error;
      });
  },
  getAttendanceStatistics: (params) => axios.get(`${API_BASE_URL}/attendance/statistics`, { headers: getAuthHeaders(), params }),
  updateAttendanceRecord: (recordId, status) =>
    axios.put(`${API_BASE_URL}/attendance/${recordId}`, { status }, { headers: getAuthHeaders() }),

  // New methods for enhanced faculty dashboard
  // Faculty Management
  getFaculty: () => axios.get(`${API_BASE_URL}/faculty`, { headers: getAuthHeaders() }),
  createFaculty: (facultyData) => axios.post(`${API_BASE_URL}/faculty`, facultyData, { headers: getAuthHeaders() }),
  updateFaculty: (facultyId, facultyData) => axios.put(`${API_BASE_URL}/faculty/${facultyId}`, facultyData, { headers: getAuthHeaders() }),
  deleteFaculty: (facultyId) => axios.delete(`${API_BASE_URL}/faculty/${facultyId}`, { headers: getAuthHeaders() }),

  // Student Management (enhanced)
  createStudent: (studentData) => axios.post(`${API_BASE_URL}/students`, studentData, { headers: getAuthHeaders() }),
  updateStudent: (id, studentData) => axios.put(`${API_BASE_URL}/students/${id}`, studentData, { headers: getAuthHeaders() }),
  deleteStudent: (id) => axios.delete(`${API_BASE_URL}/students/${id}`, { headers: getAuthHeaders() }),
  bulkUploadStudents: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/students/bulk-upload`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
  },

  // Result Management
  getResults: () => axios.get(`${API_BASE_URL}/results`, { headers: getAuthHeaders() }),
  uploadMarks: (resultData) => axios.post(`${API_BASE_URL}/results`, resultData, { headers: getAuthHeaders() }),
  updateMarks: (resultId, marksData) => axios.put(`${API_BASE_URL}/results/${resultId}`, marksData, { headers: getAuthHeaders() }),
  bulkUploadMarks: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/results/bulk-upload`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
  },

  // Fee Management
  getFees: () => axios.get(`${API_BASE_URL}/fees`, { headers: getAuthHeaders() }),
  createFeeRecord: (feeData) => axios.post(`${API_BASE_URL}/fees`, feeData, { headers: getAuthHeaders() }),
  updateFeeRecord: (feeId, feeData) => axios.put(`${API_BASE_URL}/fees/${feeId}`, feeData, { headers: getAuthHeaders() }),
  bulkUploadFees: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/fees/bulk-upload`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
  },
  generateFeeReport: (params) => axios.get(`${API_BASE_URL}/fees/report`, { headers: getAuthHeaders(), params }),

  // Document Approval
  getDocuments: () => axios.get(`${API_BASE_URL}/documents`, { headers: getAuthHeaders() }),
  approveDocument: (documentId, status) => axios.patch(`${API_BASE_URL}/documents/${documentId}/approve`, { status }, { headers: getAuthHeaders() }),
  downloadDocument: (documentId) => axios.get(`${API_BASE_URL}/documents/${documentId}`, {
    headers: getAuthHeaders(),
    responseType: 'blob'
  }),

  // Noticeboard (enhanced events)
  createNotice: (noticeData) => axios.post(`${API_BASE_URL}/notices`, noticeData, { headers: getAuthHeaders() }),
  getNotices: () => axios.get(`${API_BASE_URL}/notices`, { headers: getAuthHeaders() }),
  getSentNotifications: () => axios.get(`${API_BASE_URL}/sent-notifications`, { headers: getAuthHeaders() }),

  // Reports
  generateReport: (reportType, params) => axios.get(`${API_BASE_URL}/reports/${reportType}`, { headers: getAuthHeaders(), params }),

  // Notifications
  sendNotification: (notificationData) => axios.post(`${API_BASE_URL}/notices`, {
    title: "Faculty Notification",
    content: notificationData.message,
    recipients: notificationData.studentIds
  }, { headers: getAuthHeaders() }),

  // Dashboard endpoints
  getDashboardTotals: () => axios.get(`${API_BASE_URL}/dashboard/totals`, { headers: getAuthHeaders() }),
  getAttendanceTrends: () => axios.get(`${API_BASE_URL}/dashboard/attendance-trends`, { headers: getAuthHeaders() }),
  getPerformance: () => axios.get(`${API_BASE_URL}/dashboard/performance`, { headers: getAuthHeaders() }),
  getPerformanceData: () => axios.get(`${API_BASE_URL}/dashboard/performance`, { headers: getAuthHeaders() }),
  getRecentNotices: () => axios.get(`${API_BASE_URL}/notices`, { headers: getAuthHeaders(), params: { limit: 5, sort: '-createdAt' } }),

  // Role-based access control
  checkPermission: (permission) => axios.get(`${API_BASE_URL}/permissions/${permission}`, { headers: getAuthHeaders() }),

  // Profile Management
  getProfile: () => axios.get(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() }),
  updateProfile: (profileData) => axios.put(`${API_BASE_URL}/profile`, profileData, { headers: getAuthHeaders() }),
  uploadProfilePicture: (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      return axios.post(`${API_BASE_URL}/profile/picture`, formData, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },
  uploadDocuments: (files) => {
    const formData = new FormData();
    if (files.idProof) formData.append('idProof', files.idProof);
    if (files.qualificationCertificates) {
      files.qualificationCertificates.forEach(file => formData.append('qualificationCertificates', file));
    }
    if (files.appointmentLetter) formData.append('appointmentLetter', files.appointmentLetter);
    return axios.post(`${API_BASE_URL}/profile/documents`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
  },

  // Study Material / LMS endpoints
  uploadStudyMaterial: (formData) => axios.post(`${API_BASE_URL}/study-materials`, formData, {
    headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
  }),
  getStudyMaterials: () => axios.get(`${API_BASE_URL}/study-materials`, { headers: getAuthHeaders() }),
  deleteStudyMaterial: (materialId) => axios.delete(`${API_BASE_URL}/study-materials/${materialId}`, { headers: getAuthHeaders() }),

  // Admissions and Student Profiles endpoints (moved from Academic Cell)
  getAdmissions: (params) => axios.get(`${API_BASE_URL}/admissions`, { headers: getAuthHeaders(), params }),
  createAdmission: (admissionData) => axios.post(`${API_BASE_URL}/admissions`, admissionData, { headers: getAuthHeaders() }),
  updateAdmissionStatus: (admissionId, status) => axios.patch(`${API_BASE_URL}/admissions/${admissionId}/status`, { status }, { headers: getAuthHeaders() }),
  getMetrics: () => axios.get(`${API_BASE_URL}/metrics`, { headers: getAuthHeaders() }),
  getStudentProfiles: (params) => axios.get(`${API_BASE_URL}/student-profiles`, { headers: getAuthHeaders(), params }),
  getPendingProfiles: () => axios.get(`${API_BASE_URL}/student-profiles/pending`, { headers: getAuthHeaders() }),
  updateStudentProfile: (profileId, profileData) => axios.put(`${API_BASE_URL}/student-profiles/${profileId}`, profileData, { headers: getAuthHeaders() }),
  saveDetailedProfile: (profileData) => axios.post(`${API_BASE_URL}/student-profiles`, profileData, { headers: getAuthHeaders() }),
  uploadStudentDocument: (studentId, documentType, file, remarks) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    if (remarks) formData.append('remarks', remarks);
    return axios.post(`${API_BASE_URL}/student-profiles/${studentId}/documents`, formData, {
      headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
    });
  },
  getCourses: () => axios.get(`${API_BASE_URL}/courses`, { headers: getAuthHeaders() }),
  getNotifications: () => axios.get(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() }),
  getTasks: () => axios.get(`${API_BASE_URL}/tasks`, { headers: getAuthHeaders() }),
  getCommunicationTemplates: () => axios.get(`${API_BASE_URL}/communication-templates`, { headers: getAuthHeaders() }),
  getStudents: () => axios.get(`${API_BASE_URL}/students-list`, { headers: getAuthHeaders() }),

  // New API call for basic student profiles for faculty dashboard admission section
  getBasicStudentProfiles: () => axios.get(`${API_BASE_URL}/student-profiles/basic`, { headers: getAuthHeaders() }),
};

export default facultyApi;