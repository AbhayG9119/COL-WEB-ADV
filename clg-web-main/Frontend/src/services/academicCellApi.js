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

// Add a response interceptor to handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here, e.g., logout on 401
    return Promise.reject(error);
  }
);

const academicCellApi = {
  getMetrics: () => axiosInstance.get('/metrics'),
  getAdmissions: () => axiosInstance.get('/admissions'),
  getPendingProfiles: () => axiosInstance.get('/pending-profiles'),
  getDocuments: () => axiosInstance.get('/documents'),
  getCourses: () => axiosInstance.get('/courses'),
  getNotifications: () => axiosInstance.get('/notifications'),
  getTasks: () => axiosInstance.get('/tasks'),
  getCommunicationTemplates: () => axiosInstance.get('/communication-templates'),
  saveDetailedProfile: (profileData) => axiosInstance.post('/detailed-profile', profileData),

  // Student Profile Management
  getStudentProfiles: (params = {}) => axiosInstance.get('/student-profiles', { params }),
  getStudentProfile: (id) => axiosInstance.get(`/student-profiles/${id}`),
  getStudentProfileByStudentId: (studentId) => axiosInstance.get(`/student-profile/${studentId}`),
  updateStudentProfile: (id, profileData) => axiosInstance.put(`/student-profiles/${id}`, profileData),
};

export default academicCellApi;
