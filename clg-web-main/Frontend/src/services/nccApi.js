// NCC API service for handling NCC query form submission
import api from './adminApi';

export const nccApi = {
  submitQuery: async (queryData) => {
    try {
      const response = await api.post('/ncc-query', queryData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit NCC query'
      };
    }
  },

  getQueries: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/ncc-query?${query}`);
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch NCC queries'
      };
    }
  }
};

export default api;
