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
  markAttendance: (attendanceData) => axios.post(`${API_BASE_URL}/attendance`, attendanceData, { headers: getAuthHeaders() }),
  getAttendanceRecords: (params) => axios.get(`${API_BASE_URL}/attendance`, { headers: getAuthHeaders(), params }),
  updateAttendanceRecord: (recordId, status) =>
    axios.put(`${API_BASE_URL}/attendance/${recordId}`, { status }, { headers: getAuthHeaders() }),
};

export default facultyApi;
