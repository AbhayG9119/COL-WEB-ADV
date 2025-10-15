import React, { useState, useEffect } from 'react';

const HostelFees = () => {
  const [sessions, setSessions] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    session_name: '',
    hostel_id: '',
    fee_amount: 0,
    cycle: 'monthly'
  });
  const [assignmentData, setAssignmentData] = useState({
    student_id: '',
    hostel_id: '',
    room_number: '',
    bed_number: '',
    start_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('fees');

  useEffect(() => {
    fetchSessions();
    fetchHostels();
    fetchStudents();
    fetchFees();
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

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostels', {
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

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostel/fees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFees(data);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostel/assignments', {
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
      [name]: name === 'fee_amount' ? parseFloat(value) || 0 : value
    }));
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
    if (!formData.hostel_id) {
      setMessage('Please select a hostel.');
      setLoading(false);
      return;
    }
    if (formData.fee_amount <= 0) {
      setMessage('Fee amount must be greater than 0.');
      setLoading(false);
      return;
    }
    if (!['monthly', 'yearly', 'term'].includes(formData.cycle)) {
      setMessage('Please select a valid fee cycle.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostel/fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Hostel fee set successfully!');
        setFormData({
          session_name: '',
          hostel_id: '',
          fee_amount: 0,
          cycle: 'monthly'
        });
        fetchFees();
      } else {
        setMessage(data.message || 'Failed to set hostel fee');
      }
    } catch (error) {
      setMessage('Error setting hostel fee: ' + error.message);
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
    if (!assignmentData.hostel_id) {
      setMessage('Please select a hostel.');
      setLoading(false);
      return;
    }
    if (!assignmentData.start_date) {
      setMessage('Please select a start date.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/hostel/assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assignmentData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Student assigned to hostel successfully!');
        setAssignmentData({
          student_id: '',
          hostel_id: '',
          room_number: '',
          bed_number: '',
          start_date: ''
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

  return (
    <div className="menu-content">
      <h1>Hostel Fees Management</h1>
      <p>Manage hostel fees and student assignments.</p>

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
          Set Fees
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

      {activeTab === 'fees' && (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
            <h3>Set Hostel Fee</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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
                <label>Hostel:</label>
                <select
                  name="hostel_id"
                  value={formData.hostel_id}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="">Select Hostel</option>
                  {hostels.map(hostel => (
                    <option key={hostel._id} value={hostel._id}>
                      {hostel.hostel_name} ({hostel.hostel_type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Fee Cycle:</label>
                <select
                  name="cycle"
                  value={formData.cycle}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="term">Term</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Fee Amount (₹):</label>
              <input
                type="number"
                name="fee_amount"
                value={formData.fee_amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
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
              {loading ? 'Setting...' : 'Set Fee'}
            </button>
          </form>

          <h3>Hostel Fees</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {fees.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Session</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Hostel</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fee Amount</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Cycle</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map(fee => (
                    <tr key={fee._id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {fee.session_name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {fee.hostel_id?.hostel_name} ({fee.hostel_id?.hostel_type})
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        ₹{fee.fee_amount?.toFixed(2) || '0.00'}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {fee.cycle ? fee.cycle.charAt(0).toUpperCase() + fee.cycle.slice(1) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hostel fees found.</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'assignments' && (
        <>
          <form onSubmit={handleAssignmentSubmit} style={{ marginBottom: '30px' }}>
            <h3>Assign Student to Hostel</h3>
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
                <label>Hostel:</label>
                <select
                  name="hostel_id"
                  value={assignmentData.hostel_id}
                  onChange={handleAssignmentChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="">Select Hostel</option>
                  {hostels.map(hostel => (
                    <option key={hostel._id} value={hostel._id}>
                      {hostel.hostel_name} ({hostel.hostel_type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label>Room Number:</label>
                <input
                  type="text"
                  name="room_number"
                  value={assignmentData.room_number}
                  onChange={handleAssignmentChange}
                  placeholder="e.g., 101"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Bed Number:</label>
                <input
                  type="text"
                  name="bed_number"
                  value={assignmentData.bed_number}
                  onChange={handleAssignmentChange}
                  placeholder="e.g., A1"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Start Date:</label>
                <input
                  type="date"
                  name="start_date"
                  value={assignmentData.start_date}
                  onChange={handleAssignmentChange}
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
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Hostel</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Room</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Bed</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment._id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {assignment.student_id?.first_name} {assignment.student_id?.last_name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {assignment.hostel_id?.hostel_name}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {assignment.room_number || 'N/A'}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {assignment.bed_number || 'N/A'}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {new Date(assignment.start_date).toLocaleDateString()}
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

export default HostelFees;
