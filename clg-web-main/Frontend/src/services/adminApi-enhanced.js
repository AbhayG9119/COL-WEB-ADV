// Admin API service for handling authentication and data fetching
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // Redirect to login page
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Admin authentication functions
export const adminAuth = {
  // Login admin
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');

      return { success: true, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return !!(token && role === 'admin');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

// Admin data functions
export const adminData = {
  // Get all contacts with pagination and search
  getContacts: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/data/contacts?${query}`);
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch contacts'
      };
    }
  },

  // Get all admission queries with pagination and search
  getAdmissionQueries: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/data/admission-queries?${query}`);
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch admission queries'
      };
    }
  },

  // Get all NCC queries with pagination and search
  getNCCQueries: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/data/ncc-queries?${query}`);
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch NCC queries'
      };
    }
  },

  // Get all events
  getEvents: async () => {
    try {
      const response = await api.get('/admin/data/events');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch events'
      };
    }
  },

  // Get all courses
  getCourses: async () => {
    try {
      const response = await api.get('/admin/data/courses');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch courses'
      };
    }
  },

  // Get all hods
  getHods: async () => {
    try {
      const response = await api.get('/admin/data/hods');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch hods'
      };
    }
  },

  // Get all students
  getStudents: async () => {
    try {
      const response = await api.get('/admin/data/students');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch students'
      };
    }
  },

  // Get all faculty
  getFaculty: async () => {
    try {
      const response = await api.get('/admin/data/faculty');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch faculty'
      };
    }
  },

  // Get single faculty by ID
  getFacultyById: async (facultyId) => {
    try {
      const response = await api.get(`/admin/data/faculty/${facultyId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch faculty'
      };
    }
  },

  // Update faculty by ID
  updateFaculty: async (facultyId, facultyData) => {
    try {
      const response = await api.put(`/admin/data/faculty/${facultyId}`, facultyData);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update faculty'
      };
    }
  },

  // Delete faculty by ID
  deleteFaculty: async (facultyId) => {
    try {
      const response = await api.delete(`/admin/data/faculty/${facultyId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete faculty'
      };
    }
  },

  // Upload faculty profile picture
  uploadFacultyPicture: async (facultyId, file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await api.post(`/admin/data/faculty/${facultyId}/upload-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload profile picture'
      };
    }
  },

  // Get faculty statistics
  getFacultyStats: async () => {
    try {
      const response = await api.get('/admin/data/faculty/stats');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch faculty statistics'
      };
    }
  },

  // Get all student profiles with pagination and search
  getStudentProfiles: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/data/student-profiles?${query}`);
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch student profiles'
      };
    }
  },

  // Get student profile statistics
  getStudentProfileStats: async () => {
    try {
      const response = await api.get('/admin/data/student-profiles/stats');
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch student profile statistics'
      };
    }
  },

  // ===== ENHANCED FORM MANAGEMENT METHODS =====

  // Reply to contact form
  replyToContact: async (contactId, replyMessage) => {
    try {
      const response = await api.post(`/admin/data/contacts/${contactId}/reply`, { replyMessage });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reply to contact'
      };
    }
  },

  // Archive contact form
  archiveContact: async (contactId) => {
    try {
      const response = await api.put(`/admin/data/contacts/${contactId}/archive`);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to archive contact'
      };
    }
  },

  // Delete contact form
  deleteContact: async (contactId) => {
    try {
      const response = await api.delete(`/admin/data/contacts/${contactId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete contact'
      };
    }
  },

  // Update admission query status
  updateAdmissionQueryStatus: async (queryId, status) => {
    try {
      const response = await api.put(`/admin/data/admission-queries/${queryId}/status`, { status });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update query status'
      };
    }
  },

  // Respond to admission query
  respondToAdmissionQuery: async (queryId, reply) => {
    try {
      const response = await api.post(`/admin/data/admission-queries/${queryId}/respond`, { response: reply });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to respond to query'
      };
    }
  },

  // Archive admission query
  archiveAdmissionQuery: async (queryId) => {
    try {
      const response = await api.put(`/admin/data/admission-queries/${queryId}/archive`);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to archive query'
      };
    }
  },

  // Delete admission query
  deleteAdmissionQuery: async (queryId) => {
    try {
      const response = await api.delete(`/admin/data/admission-queries/${queryId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete query'
      };
    }
  },

  // Update NCC query status
  updateNCCQueryStatus: async (queryId, status) => {
    try {
      const response = await api.put(`/admin/data/ncc-queries/${queryId}/status`, { status });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update NCC query status'
      };
    }
  },

  // Respond to NCC query
  respondToNCCQuery: async (queryId, reply) => {
    try {
      const response = await api.post(`/admin/data/ncc-queries/${queryId}/respond`, { response: reply });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to respond to NCC query'
      };
    }
  },

  // Archive NCC query
  archiveNCCQuery: async (queryId) => {
    try {
      const response = await api.put(`/admin/data/ncc-queries/${queryId}/archive`);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to archive NCC query'
      };
    }
  },

  // Delete NCC query
  deleteNCCQuery: async (queryId) => {
    try {
      const response = await api.delete(`/admin/data/ncc-queries/${queryId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete NCC query'
      };
    }
  },

  // Export data
  exportContacts: async (format = 'csv') => {
    try {
      const response = await api.get(`/admin/data/contacts/export?format=${format}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export contacts'
      };
    }
  },

  exportAdmissionQueries: async (format = 'csv') => {
    try {
      const response = await api.get(`/admin/data/admission-queries/export?format=${format}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export admission queries'
      };
    }
  },

  exportNCCQueries: async (format = 'csv') => {
    try {
      const response = await api.get(`/admin/data/ncc-queries/export?format=${format}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export NCC queries'
      };
    }
  }
};

export default api;