import axios from 'axios';

// Create an axios instance with baseURL and interceptors for auth
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/student',
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
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const studentApi = {
  getProfile: () => axiosInstance.get('/profile'),
  getDetailedProfile: () => axiosInstance.get('/detailed-profile'),
  getEvents: () => axiosInstance.get('/events'),
  registerForEvent: (eventId) =>
    axiosInstance.post(`/events/${eventId}/register`),
  getForms: (page = 1, limit = 10, filter = {}) =>
    axiosInstance.get('/forms', { params: { page, limit, ...filter } }),
  getFormById: (formId) =>
    axiosInstance.get(`/forms/${formId}`),
  submitForm: (formData) =>
    axiosInstance.post('/forms', formData),
  updateForm: (formId, formData) =>
    axiosInstance.put(`/forms/${formId}`, formData),
  deleteForm: (formId) =>
    axiosInstance.delete(`/forms/${formId}`),
  uploadProfilePicture: (formData) =>
    axiosInstance.post('/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getAttendance: () => axiosInstance.get('/attendance'),
  getExamResults: () => axiosInstance.get('/exam-results'),
  getStudyMaterials: () => axiosInstance.get('/study-materials'),
  getCourseContent: () => axiosInstance.get('/course-content'),
};

export default studentApi;
