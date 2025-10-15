import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    title: '',
    description: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/staff/assigned-classes', config);
      setClasses(res.data.map(c => c.class));
    } catch (error) {
      console.error('Error fetching classes:', error);
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
      await axios.post('/api/staff/work/assign', formData, config);
      setMessage('Assignment created successfully');
      setFormData({ class: '', subject: '', title: '', description: '', dueDate: '' });
    } catch (error) {
      setMessage('Failed to create assignment');
    }
    setLoading(false);
  };

  return (
    <div className="create-assignment">
      <h1>Create Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Class:</label>
          <select name="class" value={formData.class} onChange={handleChange} required>
            <option value="">Select Class</option>
            {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <select name="subject" value={formData.subject} onChange={handleChange} required>
            <option value="">Select Subject</option>
            {/* Placeholder subjects; fetch dynamically if needed */}
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Due Date:</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>Create Assignment</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default CreateAssignment;
