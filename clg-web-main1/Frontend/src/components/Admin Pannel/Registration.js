import React, { useState, useEffect } from 'react';

const Registration = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    newSemester: '',
    newYear: '',
    feeStatus: 'Pending',
    feeAmount: '',
    documents: [],
    remarks: ''
  });

  // Search students
  const searchStudents = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/registration/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to search students');

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setMessage('Error searching students: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Register student
  const registerStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/registration/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          ...formData
        })
      });

      if (!response.ok) throw new Error('Failed to register student');

      const data = await response.json();
      setMessage('Student registered successfully!');
      setSelectedStudent(null);
      setFormData({
        newSemester: '',
        newYear: '',
        feeStatus: 'Pending',
        feeAmount: '',
        documents: [],
        remarks: ''
      });
    } catch (error) {
      setMessage('Error registering student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="menu-content">
      <h1>Student Registration</h1>
      <p>Register existing students for new semester/year</p>

      {message && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? '#c62828' : '#2e7d32'
        }}>
          {message}
        </div>
      )}

      {/* Search Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Search Student</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button
            onClick={searchStudents}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {students.length > 0 && (
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
            {students.map((student) => (
              <div
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor: selectedStudent?._id === student._id ? '#e3f2fd' : 'white',
                  borderBottom: '1px solid #eee'
                }}
              >
                <strong>{student.firstName} {student.lastName}</strong> - {student.email}
                <br />
                <small>Student ID: {student.studentId} | Roll No: {student.rollNo} | {student.department} - Year {student.year}, Sem {student.semester}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Form */}
      {selectedStudent && (
        <form onSubmit={registerStudent} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Register Student</h3>

          <div style={{ marginBottom: '15px' }}>
            <strong>Selected Student:</strong> {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.studentId})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>New Semester:</label>
              <select
                name="newSemester"
                value={formData.newSemester}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div>
              <label>New Year:</label>
              <select
                name="newYear"
                value={formData.newYear}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div>
              <label>Fee Status:</label>
              <select
                name="feeStatus"
                value={formData.feeStatus}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>

            <div>
              <label>Fee Amount:</label>
              <input
                type="number"
                name="feeAmount"
                value={formData.feeAmount}
                onChange={handleInputChange}
                placeholder="Enter fee amount"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label>Remarks:</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Additional remarks..."
              rows="3"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Registration;
