import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarkAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
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

  const fetchStudents = async () => {
    if (!selectedClass) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Assuming API endpoint to get students by class; add to backend if needed
      const res = await axios.get(`/api/students?class=${selectedClass}`, config); // Placeholder endpoint
      setStudents(res.data);
      // Initialize attendance states
      const initialAttendance = {};
      res.data.forEach(student => {
        initialAttendance[student._id] = 'present'; // Default
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSubject('');
    setStudents([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedSubject || !date) {
      setMessage('Please select class, subject, and date');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const studentsData = students.map(student => ({
        studentId: student._id,
        status: attendance[student._id] || 'absent'
      }));
      await axios.post('/api/staff/attendance/mark', {
        class: selectedClass,
        subject: selectedSubject,
        date,
        students: studentsData
      }, config);
      setMessage('Attendance marked successfully');
      setLoading(false);
    } catch (error) {
      setMessage('Failed to mark attendance');
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  return (
    <div className="mark-attendance">
      <h1>Mark Attendance</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Class:</label>
          <select value={selectedClass} onChange={handleClassChange} required>
            <option value="">Select Class</option>
            {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required disabled={!selectedClass}>
            <option value="">Select Subject</option>
            {/* Fetch subjects for class; placeholder */}
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>Mark Attendance</button>
      </form>
      {message && <div className="message">{message}</div>}
      {students.length > 0 && (
        <div className="students-table">
          <h3>Students in {selectedClass}</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>
                    <select value={attendance[student._id] || 'present'} onChange={(e) => handleStatusChange(student._id, e.target.value)}>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="leave">Leave</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedClass && <button onClick={fetchStudents} disabled={!selectedClass}>Load Students</button>}
    </div>
  );
};

export default MarkAttendance;
