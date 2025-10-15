import React, { useState, useEffect } from 'react';

const AddSubject = () => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    subjectId: '',
    subjectName: '',
    subjectCode: '',
    classId: '',
    sessionId: '',
    department: 'B.A',
    credits: 1,
    is_elective: false,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

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
          is_elective: false,
          description: ''
        });
        // No need to fetch subjects for add only
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
      <h1>Add Subject</h1>
      <p>Add new subjects for different classes and departments.</p>

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
                <option key={session._id} value={session.session_name}>
                  {session.session_name} ({session.description})
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
              min="0"
              max="10"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Is Elective:</label>
            <select
              name="is_elective"
              value={formData.is_elective}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                is_elective: e.target.value === 'true'
              }))}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
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


    </div>
  );
};

export default AddSubject;
