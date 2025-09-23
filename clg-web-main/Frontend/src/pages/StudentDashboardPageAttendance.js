import React, { useState, useEffect } from 'react';
import facultyApi from '../services/facultyApi';
import '../styles/FacultyAttendance.css';

function FacultyAttendancePage() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await facultyApi.getStudentsList(); // API: returns [{id, name, rollNo, department}]
      const initialData = res.data.map(s => ({ ...s, status: 'present' }));
      setStudents(initialData);
    } catch (err) {
      setError('Failed to load student list.');
    }
    setLoading(false);
  };

  const handleStatusChange = (id, status) => {
    setStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        date,
        records: students.map(s => ({
          studentId: s.id,
          status: s.status
        }))
      };
      await facultyApi.markAttendance(payload);
      alert('Attendance saved successfully!');
    } catch (err) {
      setError('Error saving attendance.');
    }
    setSaving(false);
  };

  return (
    <div className="faculty-attendance">
      <header className="attendance-header">
        <h1>Mark Attendance</h1>
        <div className="date-picker">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </header>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <div className="attendance-table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>{s.department}</td>
                  <td>
                    <select
                      value={s.status}
                      onChange={e => handleStatusChange(s.id, e.target.value)}
                      className={`status-${s.status}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="attendance-actions">
        <button
          className="btn-save"
          onClick={handleSaveAttendance}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
}

export default FacultyAttendancePage;