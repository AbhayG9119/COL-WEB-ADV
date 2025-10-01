import axios from 'axios';

// Create an axios instance with baseURL for academic cell API
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/academic-cell',
});

// Add a request interceptor to include Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle global errors including 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const academicCellApi = {
  // Authentication
  login: async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/academic-cell/login', {
        email,
        password
      });
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Dashboard API calls
  getDashboardMetrics: () => axiosInstance.get('/dashboard/metrics'),

  // Student Management
  getStudents: (params = {}) => axiosInstance.get('/students', { params }),
  getStudentById: (id) => axiosInstance.get(`/students/${id}`),
  updateStudentStatus: (id, statusData) => axiosInstance.patch(`/students/${id}/status`, statusData),

  // Student Profile Management
  getStudentProfiles: (params = {}) => axiosInstance.get('/student-profiles', { params }),
  getStudentProfile: (id) => axiosInstance.get(`/student-profiles/${id}`),
  updateStudentProfile: (id, profileData) => axiosInstance.put(`/student-profiles/${id}`, profileData),

  // Course Management
  getCourses: () => axiosInstance.get('/courses'),
  createCourse: (courseData) => axiosInstance.post('/courses', courseData),
  updateCourse: (id, courseData) => axiosInstance.put(`/courses/${id}`, courseData),

  // Document Management
  getDocuments: (params = {}) => axiosInstance.get('/documents', { params }),
  verifyDocument: (id, verificationData) => axiosInstance.patch(`/documents/${id}/verify`, verificationData),

  // Document Management from Student Profiles
  getProfileDocuments: (params = {}) => axiosInstance.get('/documents/profiles', { params }),
  getDocumentFileFromProfile: (profileId, documentType) => axiosInstance.get(`/documents/profiles/${profileId}/${documentType}/file`, {
    responseType: 'blob'
  }),
  verifyDocumentInProfile: (profileId, documentType, verificationData) =>
    axiosInstance.patch(`/documents/profiles/${profileId}/${documentType}/verify`, verificationData),
  getDocumentsGroupedByStudent: () => axiosInstance.get('/documents/grouped-by-student'),

  // Task Management
  getTasks: (params = {}) => axiosInstance.get('/tasks', { params }),
  createTask: (taskData) => axiosInstance.post('/tasks', taskData),
  updateTaskStatus: (id, statusData) => axiosInstance.patch(`/tasks/${id}/status`, statusData),

  // Communication Templates
  getCommunicationTemplates: () => axiosInstance.get('/communication-templates'),
  createCommunicationTemplate: (templateData) => axiosInstance.post('/communication-templates', templateData),

  // Notifications
  getNotifications: (params = {}) => axiosInstance.get('/notifications', { params }),
  createNotification: (notificationData) => axiosInstance.post('/notifications', notificationData),

  // Profile Management
  getProfile: () => axiosInstance.get('/profile'),
  updateProfile: (profileData) => axiosInstance.patch('/profile', profileData),

  // Enhanced Document Management
  uploadStudentDocument: (studentId, documentType, file, remarks) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    if (remarks) formData.append('remarks', remarks);

    return axiosInstance.post(`/students/${studentId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getStudentDocuments: (studentId) => axiosInstance.get(`/students/${studentId}/documents`),
  updateDocumentStatus: (documentId, status, remarks) =>
    axiosInstance.patch(`/documents/${documentId}/status`, { status, remarks }),
  deleteDocument: (documentId) => axiosInstance.delete(`/documents/${documentId}`),
  getDocumentFile: (documentId) => axiosInstance.get(`/documents/${documentId}/file`, {
    responseType: 'blob'
  }),
  getDocumentStats: () => axiosInstance.get('/documents/stats'),
  updateStudentContact: (studentId, contactData) =>
    axiosInstance.patch(`/students/${studentId}/contact`, contactData),

  // Admission Form Management
  saveAdmissionForm: (formData) => axiosInstance.post('/admission-form', formData),

  // Legacy methods (for backward compatibility)
  getMetrics: () => axiosInstance.get('/dashboard/metrics'),
  getAdmissions: () => axiosInstance.get('/students'),
  getPendingProfiles: () => axiosInstance.get('/student-profiles'),
  getDocuments: () => axiosInstance.get('/documents'),
  getNotifications: () => axiosInstance.get('/notifications'),
  getTasks: () => axiosInstance.get('/tasks'),
  getCommunicationTemplates: () => axiosInstance.get('/communication-templates'),
  saveDetailedProfile: (profileData) => axiosInstance.post('/student-profiles', profileData),
  getStudentProfileByStudentId: (studentId) => axiosInstance.get(`/student-profiles?studentId=${studentId}`),
};

export default academicCellApi;
