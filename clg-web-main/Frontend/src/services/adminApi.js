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
  }
};

export default api;
