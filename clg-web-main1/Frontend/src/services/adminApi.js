import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email, password, captchaValue, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        captchaToken: captchaValue,
        role
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      return { success: true, role: user.role };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  }
};

export const staffApi = {
  getDesignations: async () => {
    try {
      const response = await api.get('/staff/designations');
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to fetch designations' };
    }
  },
  addDesignation: async (name) => {
    try {
      const response = await api.post('/staff/designations', { name });
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to add designation' };
    }
  },
  registerStaff: async (staffData) => {
    try {
      const response = await api.post('/users/staff/register', staffData);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to register staff' };
    }
  },
  getStaff: async () => {
    try {
      const response = await api.get('/staff');
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to fetch staff' };
    }
  }
};

export const enquiryApi = {
  addEnquiry: async (enquiryData) => {
    try {
      const response = await api.post('/enquiries', enquiryData);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to add enquiry' };
    }
  },
  getEnquiries: async () => {
    try {
      const response = await api.get('/enquiries');
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to fetch enquiries' };
    }
  },
  updateEnquiry: async (id, updateData) => {
    try {
      const response = await api.put(`/enquiries/${id}`, updateData);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update enquiry' };
    }
  }
};

export const workApi = {
  addWork: async (workData) => {
    try {
      const response = await api.post('/works', workData);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to add work' };
    }
  },
  getWorks: async () => {
    try {
      const response = await api.get('/works');
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to fetch works' };
    }
  },
  addWorkReport: async (reportData) => {
    try {
      const response = await api.post('/work-reports', reportData);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to add work report' };
    }
  }
};
