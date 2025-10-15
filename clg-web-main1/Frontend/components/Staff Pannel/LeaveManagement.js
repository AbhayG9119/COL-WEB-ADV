import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    type: 'sick',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/staff/leaves', config);
      setLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      await axios.post('/api/staff/leave/apply', {
        ...formData,
        days
      }, config);
      setMessage('Leave applied successfully');
      setFormData({ type: 'sick', startDate: '', endDate: '', reason: '' });
      fetchLeaves(); // Refresh list
    } catch (error) {
      setMessage('Failed to apply leave');
    }
    setLoading(false);
  };

  return (
    <div className="leave-management">
      <h1>Leave Management</h1>
      <div className="apply-leave">
        <h2>Apply for Leave</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type:</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              <option value="earned">Earned</option>
              <option value="maternity">Maternity</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Reason:</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading}>Apply Leave</button>
        </form>
        {message && <div className="message">{message}</div>}
      </div>
      <div className="leave-history">
        <h2>Leave History</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave._id}>
                <td>{leave.type}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.days}</td>
                <td>{leave.status}</td>
                <td>{leave.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveManagement;
