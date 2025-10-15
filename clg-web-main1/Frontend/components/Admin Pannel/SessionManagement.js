import React, { useState, useEffect } from 'react';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    sessionId: '',
    startDate: '',
    endDate: '',
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
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Session created successfully!');
        setFormData({
          sessionId: '',
          startDate: '',
          endDate: '',
          description: ''
        });
        fetchSessions();
      } else {
        setMessage(data.message || 'Failed to create session');
      }
    } catch (error) {
      setMessage('Error creating session: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const activateSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/erp/session/${sessionId}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Session activated successfully!');
        fetchSessions();
      } else {
        setMessage(data.message || 'Failed to activate session');
      }
    } catch (error) {
      setMessage('Error activating session: ' + error.message);
    }
  };

  return (
    <div className="menu-content">
      <h1>Session Management</h1>
      <p>Create and manage academic sessions.</p>

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
        <h3>Create New Session</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Session ID:</label>
            <input
              type="text"
              name="sessionId"
              value={formData.sessionId}
              onChange={handleInputChange}
              placeholder="e.g., 2024-25"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Academic Year 2024-25"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
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
          {loading ? 'Creating...' : 'Create Session'}
        </button>
      </form>

      <h3>Existing Sessions</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {sessions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Session ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Start Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>End Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{session.sessionId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(session.startDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(session.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: session.isActive ? '#d4edda' : '#f8d7da',
                      color: session.isActive ? '#155724' : '#721c24'
                    }}>
                      {session.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {!session.isActive && (
                      <button
                        onClick={() => activateSession(session.sessionId)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sessions found.</p>
        )}
      </div>
    </div>
  );
};

export default SessionManagement;
