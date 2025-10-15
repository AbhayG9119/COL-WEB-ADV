import React, { useState, useEffect } from 'react';

const TransportRoutesFare = () => {
  const [sessions, setSessions] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    session_name: '',
    route_name: '',
    stops: [{ name: '', distance: 0 }],
    base_fare: 0
  });
  const [assignmentData, setAssignmentData] = useState({
    student_id: '',
    route_id: '',
    stop_name: '',
    fare: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('routes');

  useEffect(() => {
    fetchSessions();
    fetchRoutes();
    fetchStudents();
    fetchAssignments();
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

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/transport/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index][field] = field === 'distance' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({
      ...prev,
      stops: updatedStops
    }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { name: '', distance: 0 }]
    }));
  };

  const removeStop = (index) => {
    if (formData.stops.length > 1) {
      const updatedStops = formData.stops.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        stops: updatedStops
      }));
    }
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validations
    if (!formData.session_name) {
      setMessage('Please select a session.');
      setLoading(false);
      return;
    }
    if (!formData.route_name.trim()) {
      setMessage('Please enter a route name.');
      setLoading(false);
      return;
    }
    if (formData.base_fare <= 0) {
      setMessage('Base fare must be greater than 0.');
      setLoading(false);
      return;
    }
    if (formData.stops.some(stop => !stop.name.trim() || stop.distance <= 0)) {
      setMessage('All stops must have a name and distance greater than 0.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/transport/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Transport route created successfully!');
        setFormData({
          session_name: '',
          route_name: '',
          stops: [{ name: '', distance: 0 }],
          base_fare: 0
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

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validations
    if (!assignmentData.student_id) {
      setMessage('Please select a student.');
      setLoading(false);
      return;
    }
    if (!assignmentData.route_id) {
      setMessage('Please select a route.');
      setLoading(false);
      return;
    }
    if (!assignmentData.stop_name.trim()) {
      setMessage('Please enter a stop name.');
      setLoading(false);
      return;
    }
    if (assignmentData.fare < 0) {
      setMessage('Fare cannot be negative.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/transport/assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assignmentData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Student assigned to transport route successfully!');
        setAssignmentData({
          student_id: '',
          route_id: '',
          stop_name: '',
          fare: 0
        });
        fetchAssignments();
      } else {
        setMessage(data.message || 'Failed to assign student');
      }
    } catch (error) {
      setMessage('Error assigning student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateFare = (routeId, stopName) => {
    const route = routes.find(r => r._id === routeId);
    if (!route) return 0;

    const stop = route.stops.find(s => s.name === stopName);
    if (!stop) return route.base_fare;

    // Simple fare calculation based on distance
    return route.base_fare + (stop.distance * 2); // ₹2 per km
  };

  const handleRouteChange = (e) => {
    const routeId = e.target.value;
    setAssignmentData(prev => ({
      ...prev,
      route_id: routeId,
      fare: calculateFare(routeId, prev.stop_name)
    }));
  };

  const handleStopNameChange = (e) => {
    const stopName = e.target.value;
    setAssignmentData(prev => ({
      ...prev,
      stop_name: stopName,
      fare: calculateFare(prev.route_id, stopName)
    }));
  };

  return (
    <div className="menu-content">
      <h1>Transport Routes & Fare Management</h1>
      <p>Manage bus routes, fares, and student assignments.</p>

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
          Student Assignments
        </button>
      </div>

      {activeTab === 'routes' && (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
            <h3>Create Transport Route</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Session:</label>
                <select
                  name="session_name"
                  value={formData.session_name}
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
                <label>Route Name:</label>
                <input
                  type="text"
                  name="route_name"
                  value={formData.route_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Route A, City Center Route"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Base Fare (₹):</label>
              <input
                type="number"
                name="base_fare"
                value={formData.base_fare}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <h4>Route Stops</h4>
            {formData.stops.map((stop, index) => (
              <div key={index} style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.5fr', gap: '10px', alignItems: 'end' }}>
                  <div>
                    <label>Stop Name:</label>
                    <input
                      type="text"
                      value={stop.name}
                      onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                      placeholder="e.g., School Gate, Main Road"
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Distance (km):</label>
                    <input
                      type="number"
                      value={stop.distance}
                      onChange={(e) => handleStopChange(index, 'distance', e.target.value)}
                      min="0"
                      step="0.1"
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    {formData.stops.length > 1 && (
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

          <h3>Existing Routes</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {routes.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Session</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Route Name</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Stops</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Base Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map(route => (
                    <tr key={route._id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {route.session_name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{route.route_name}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {route.stops.map((stop, index) => (
                          <div key={index}>
                            {stop.name} ({stop.distance} km)
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        ₹{route.base_fare?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No routes found.</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'assignments' && (
        <>
          <form onSubmit={handleAssignmentSubmit} style={{ marginBottom: '30px' }}>
            <h3>Assign Student to Transport Route</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Student:</label>
                <select
                  name="student_id"
                  value={assignmentData.student_id}
                  onChange={handleAssignmentChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.first_name} {student.last_name} ({student.student_id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Route:</label>
                <select
                  name="route_id"
                  value={assignmentData.route_id}
                  onChange={handleRouteChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="">Select Route</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.route_name} ({route.session_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Stop Name:</label>
                <input
                  type="text"
                  name="stop_name"
                  value={assignmentData.stop_name}
                  onChange={handleStopNameChange}
                  placeholder="e.g., School Gate"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Fare (₹):</label>
                <input
                  type="number"
                  name="fare"
                  value={assignmentData.fare}
                  onChange={handleAssignmentChange}
                  min="0"
                  step="0.01"
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
              {loading ? 'Assigning...' : 'Assign Student'}
            </button>
          </form>

          <h3>Student Assignments</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {assignments.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Student</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Route</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Stop</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment._id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {assignment.student_id?.first_name} {assignment.student_id?.last_name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {assignment.route_id?.route_name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {assignment.stop_name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        ₹{assignment.fare?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assignments found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TransportRoutesFare;
