import React, { useState, useEffect } from 'react';

const TransportManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('routes');
  const [routeForm, setRouteForm] = useState({
    routeId: '',
    routeName: '',
    fare: '',
    description: '',
    stops: [{ name: '', order: 1 }]
  });
  const [assignmentForm, setAssignmentForm] = useState({
    studentId: '',
    routeId: '',
    sessionId: '',
    pickupPoint: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRoutes();
    fetchSessions();
    fetchStudents();
  }, []);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/transport/routes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
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

  const handleRouteInputChange = (e) => {
    const { name, value } = e.target;
    setRouteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...routeForm.stops];
    updatedStops[index][field] = field === 'order' ? parseInt(value) || 1 : value;
    setRouteForm(prev => ({
      ...prev,
      stops: updatedStops
    }));
  };

  const addStop = () => {
    const newOrder = routeForm.stops.length + 1;
    setRouteForm(prev => ({
      ...prev,
      stops: [...prev.stops, { name: '', order: newOrder }]
    }));
  };

  const removeStop = (index) => {
    if (routeForm.stops.length > 1) {
      const updatedStops = routeForm.stops.filter((_, i) => i !== index);
      // Reorder the stops
      const reorderedStops = updatedStops.map((stop, i) => ({
        ...stop,
        order: i + 1
      }));
      setRouteForm(prev => ({
        ...prev,
        stops: reorderedStops
      }));
    }
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/transport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routeForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Transport route created successfully!');
        setRouteForm({
          routeId: '',
          routeName: '',
          fare: '',
          description: '',
          stops: [{ name: '', order: 1 }]
        });
        fetchRoutes();
      } else {
        setMessage(data.message || 'Failed to create transport route');
      }
    } catch (error) {
      setMessage('Error creating transport route: ' + error.message);
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
      const response = await fetch('http://localhost:5000/api/erp/transport/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assignmentForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Transport assigned successfully!');
        setAssignmentForm({
          studentId: '',
          routeId: '',
          sessionId: '',
          pickupPoint: ''
        });
      } else {
        setMessage(data.message || 'Failed to assign transport');
      }
    } catch (error) {
      setMessage('Error assigning transport: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Transport Management</h1>
      <p>Manage transport routes and assign transport to students.</p>

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
          onClick={() => setActiveTab('routes')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'routes' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manage Routes
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
          Assign Transport
        </button>
      </div>

      {activeTab === 'routes' && (
        <form onSubmit={handleRouteSubmit} style={{ marginBottom: '30px' }}>
          <h3>Create Transport Route</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>Route ID:</label>
              <input
                type="text"
                name="routeId"
                value={routeForm.routeId}
                onChange={handleRouteInputChange}
                placeholder="e.g., RT001"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Route Name:</label>
              <input
                type="text"
                name="routeName"
                value={routeForm.routeName}
                onChange={handleRouteInputChange}
                placeholder="e.g., City Center Route"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div>
              <label>Fare (₹):</label>
              <input
                type="number"
                name="fare"
                value={routeForm.fare}
                onChange={handleRouteInputChange}
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
                value={routeForm.description}
                onChange={handleRouteInputChange}
                placeholder="Optional description"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </div>

          <h4>Stops</h4>
          {routeForm.stops.map((stop, index) => (
            <div key={index} style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 0.5fr', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label>Stop Name:</label>
                  <input
                    type="text"
                    value={stop.name}
                    onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                    placeholder="e.g., Main Gate, Bus Stand"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Order:</label>
                  <input
                    type="number"
                    value={stop.order}
                    onChange={(e) => handleStopChange(index, 'order', e.target.value)}
                    min="1"
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  {routeForm.stops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStop(index)}
                      style={{
                        padding: '8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginBottom: '15px' }}>
            <button
              type="button"
              onClick={addStop}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Add Stop
            </button>
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
            {loading ? 'Creating...' : 'Create Route'}
          </button>
        </form>
      )}

      {activeTab === 'assignments' && (
        <form onSubmit={handleAssignmentSubmit} style={{ marginBottom: '30px' }}>
          <h3>Assign Transport to Student</h3>
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
              <label>Route:</label>
              <select
                name="routeId"
                value={assignmentForm.routeId}
                onChange={handleAssignmentInputChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select Route</option>
                {routes.map(route => (
                  <option key={route._id} value={route._id}>
                    {route.routeName} (₹{route.fare})
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
              <label>Pickup Point:</label>
              <input
                type="text"
                name="pickupPoint"
                value={assignmentForm.pickupPoint}
                onChange={handleAssignmentInputChange}
                placeholder="e.g., Main Gate"
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
            {loading ? 'Assigning...' : 'Assign Transport'}
          </button>
        </form>
      )}

      <h3>Existing Routes</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {routes.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Route ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Route Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fare</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Stops</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{route.routeId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{route.routeName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>₹{route.fare}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {route.stops.map((stop, index) => (
                      <div key={index}>
                        {stop.order}. {stop.name}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: route.isActive ? '#d4edda' : '#f8d7da',
                      color: route.isActive ? '#155724' : '#721c24'
                    }}>
                      {route.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No routes found.</p>
        )}
      </div>
    </div>
  );
};

export default TransportManagement;
