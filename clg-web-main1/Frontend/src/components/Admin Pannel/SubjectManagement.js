import React, { useState, useEffect } from 'react';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    subjectId: '',
    subjectName: '',
    subjectCode: '',
    classId: '',
    sessionId: '',
    department: 'B.A',
    credits: 1,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubjects();
    fetchSessions();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/subject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Subject created successfully!');
        setFormData({
          subjectId: '',
          subjectName: '',
          subjectCode: '',
          classId: '',
          sessionId: '',
          department: 'B.A',
          credits: 1,
          description: ''
        });
        fetchSubjects();
      } else {
        setMessage(data.message || 'Failed to create subject');
      }
    } catch (error) {
      setMessage('Error creating subject: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Subject Management</h1>
      <p>Create and manage subjects for different classes and departments.</p>

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

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <h3>Add New Subject</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Subject ID:</label>
            <input
              type="text"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              placeholder="e.g., SUB001"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Subject Name:</label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleInputChange}
              placeholder="e.g., Mathematics"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Subject Code:</label>
            <input
              type="text"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleInputChange}
              placeholder="e.g., MATH101"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Class ID:</label>
            <input
              type="text"
              name="classId"
              value={formData.classId}
              onChange={handleInputChange}
              placeholder="e.g., Class-10, B.A-1st-Year"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Session:</label>
            <select
              name="sessionId"
              value={formData.sessionId}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Select Session</option>
              {sessions.map(session => (
                <option key={session._id} value={session.sessionId}>
                  {session.sessionId} ({session.description})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="B.A">B.A</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.Ed">B.Ed</option>
            </select>
          </div>
          <div>
            <label>Credits:</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleInputChange}
              min="1"
              max="10"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description"
              rows="3"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Subject'}
        </button>
      </form>

      <h3>Existing Subjects</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {subjects.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Subject ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Subject Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Subject Code</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Class</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Department</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Credits</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Session</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{subject.subjectId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{subject.subjectName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{subject.subjectCode}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{subject.classId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{subject.department}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{subject.credits}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {subject.sessionId?.sessionId}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: subject.isActive ? '#d4edda' : '#f8d7da',
                      color: subject.isActive ? '#155724' : '#721c24'
                    }}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No subjects found.</p>
        )}
      </div>
    </div>
  );
};

export default SubjectManagement;
