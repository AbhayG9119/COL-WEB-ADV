import React, { useState, useEffect } from 'react';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    sessionId: '',
    discountType: 'Scholarship',
    amount: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDiscounts();
    fetchSessions();
    fetchStudents();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/discounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDiscounts(data);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
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
      const response = await fetch('http://localhost:5000/api/erp/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Discount applied successfully!');
        setFormData({
          studentId: '',
          sessionId: '',
          discountType: 'Scholarship',
          amount: '',
          reason: ''
        });
        fetchDiscounts();
      } else {
        setMessage(data.message || 'Failed to apply discount');
      }
    } catch (error) {
      setMessage('Error applying discount: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Fee Discount Management</h1>
      <p>Apply fee discounts to students for various reasons.</p>

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
        <h3>Apply Fee Discount</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Student:</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
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
            <label>Discount Type:</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="Scholarship">Scholarship</option>
              <option value="Sibling">Sibling</option>
              <option value="Merit">Merit</option>
              <option value="Financial Aid">Financial Aid</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Discount Amount (₹):</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Reason:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Reason for discount"
            rows="3"
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
          {loading ? 'Applying...' : 'Apply Discount'}
        </button>
      </form>

      <h3>Applied Discounts</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {discounts.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Session</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Discount Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Reason</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(discount => (
                <tr key={discount._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.studentId?.firstName} {discount.studentId?.lastName}
                    <br />
                    <small>({discount.studentId?.studentId})</small>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.sessionId?.sessionId}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.discountType}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    ₹{discount.amount}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.reason || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: discount.isActive ? '#d4edda' : '#f8d7da',
                      color: discount.isActive ? '#155724' : '#721c24'
                    }}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No discounts found.</p>
        )}
      </div>
    </div>
  );
};

export default DiscountManagement;
