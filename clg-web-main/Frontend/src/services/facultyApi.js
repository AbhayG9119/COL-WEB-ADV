import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/faculty';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const facultyApi = {
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
};

export default facultyApi;
