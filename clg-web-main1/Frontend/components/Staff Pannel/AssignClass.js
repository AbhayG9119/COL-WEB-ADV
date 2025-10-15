import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignClass = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
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

  const handleAssign = async () => {
    if (!selectedClass || !selectedSubject) {
      setMessage('Please select class and subject');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/staff/assign-class', { class: selectedClass, subject: selectedSubject }, config);
      setMessage('Class assigned successfully');
    } catch (error) {
      setMessage('Failed to assign class');
    }
  };

  return (
    <div className="assign-class">
      <h1>Assign Class/Subject</h1>
      <div className="form-group">
        <label>Class:</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
          <option value="">Select Class</option>
          {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Subject:</label>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
          <option value="">Select Subject</option>
          {/* Placeholder subjects */}
          <option value="Math">Math</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
        </select>
      </div>
      <button onClick={handleAssign}>Assign</button>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AssignClass;
