import React, { useState, useEffect } from 'react';

const HostelManagement = () => {
  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('fees');
  const [hostelForm, setHostelForm] = useState({
    hostelId: '',
    hostelName: '',
    roomType: 'Single',
    feeType: 'Monthly',
    amount: '',
    description: ''
  });
  const [assignmentForm, setAssignmentForm] = useState({
    studentId: '',
    hostelId: '',
    sessionId: '',
    roomNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHostels();
    fetchSessions();
    fetchStudents();
  }, []);

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostel/fees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHostels(data);
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
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

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch from all student models
      const endpoints = [
        'http://localhost:5000/api/student/bas',
        'http://localhost:5000/api/student/bsc',
        'http://localhost:5000/api/student/bed'
      ];

      const allStudents = [];
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            allStudents.push(...data.map(student => ({
              ...student,
              model: endpoint.split('/').pop().toUpperCase()
            })));
          }
        } catch (error) {
          console.error(`Error fetching from ${endpoint}:`, error);
        }
      }
      setStudents(allStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleHostelInputChange = (e) => {
    const { name, value } = e.target;
    setHostelForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostel/fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(hostelForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Hostel fee created successfully!');
        setHostelForm({
          hostelId: '',
          hostelName: '',
          roomType: 'Single',
          feeType: 'Monthly',
          amount: '',
          description: ''
        });
        fetchHostels();
      } else {
        setMessage(data.message || 'Failed to create hostel fee');
      }
    } catch (error) {
      setMessage('Error creating hostel fee: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostel/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assignmentForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Hostel assigned successfully!');
        setAssignmentForm({
          studentId: '',
          hostelId: '',
          sessionId: '',
          roomNumber: ''
        });
      } else {
        setMessage(data.message || 'Failed to assign hostel');
      }
    } catch (error) {
      setMessage('Error assigning hostel: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Hostel Management</h1>
      <p>Manage hostel fees and assign hostels to students.</p>

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

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('fees')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'fees' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manage Hostel Fees
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'assignments' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Assign Hostel
        </button>
      </div>

      {activeTab === 'fees' && (
        <form onSubmit={handleHostelSubmit} style={{ marginBottom: '30px' }}>
          <h3>Create Hostel Fee Structure</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>Hostel ID:</label>
              <input
                type="text"
                name="hostelId"
                value={hostelForm.hostelId}
                onChange={handleHostelInputChange}
                placeholder="e.g., H001"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Hostel Name:</label>
              <input
                type="text"
                name="hostelName"
                value={hostelForm.hostelName}
                onChange={handleHostelInputChange}
                placeholder="e.g., Boys Hostel A"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Room Type:</label>
              <select
                name="roomType"
                value={hostelForm.roomType}
                onChange={handleHostelInputChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>
            <div>
              <label>Fee Type:</label>
              <select
                name="feeType"
                value={hostelForm.feeType}
                onChange={handleHostelInputChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label>Amount (₹):</label>
              <input
                type="number"
                name="amount"
                value={hostelForm.amount}
                onChange={handleHostelInputChange}
                min="0"
                step="0.01"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={hostelForm.description}
                onChange={handleHostelInputChange}
                placeholder="Optional description"
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
            {loading ? 'Creating...' : 'Create Hostel Fee'}
          </button>
        </form>
      )}

      {activeTab === 'assignments' && (
        <form onSubmit={handleAssignmentSubmit} style={{ marginBottom: '30px' }}>
          <h3>Assign Hostel to Student</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>Student:</label>
              <select
                name="studentId"
                value={assignmentForm.studentId}
                onChange={handleAssignmentInputChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.firstName} {student.lastName} ({student.studentId}) - {student.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Hostel:</label>
              <select
                name="hostelId"
                value={assignmentForm.hostelId}
                onChange={handleAssignmentInputChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select Hostel</option>
                {hostels.map(hostel => (
                  <option key={hostel._id} value={hostel._id}>
                    {hostel.hostelName} - {hostel.roomType} ({hostel.feeType}: ₹{hostel.amount})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Session:</label>
              <select
                name="sessionId"
                value={assignmentForm.sessionId}
                onChange={handleAssignmentInputChange}
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
              <label>Room Number:</label>
              <input
                type="text"
                name="roomNumber"
                value={assignmentForm.roomNumber}
                onChange={handleAssignmentInputChange}
                placeholder="e.g., A-101"
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
            {loading ? 'Assigning...' : 'Assign Hostel'}
          </button>
        </form>
      )}

      <h3>Existing Hostel Fees</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {hostels.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Hostel ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Hostel Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Room Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fee Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map(hostel => (
                <tr key={hostel._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hostel.hostelId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hostel.hostelName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hostel.roomType}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hostel.feeType}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{hostel.amount}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: hostel.isActive ? '#d4edda' : '#f8d7da',
                      color: hostel.isActive ? '#155724' : '#721c24'
                    }}>
                      {hostel.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hostels found.</p>
        )}
      </div>
    </div>
  );
};

export default HostelManagement;
