import React, { useState, useEffect } from 'react';

const GenerateDiscount = () => {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    session_name: '',
    discount_type: 'percent',
    value: 0,
    reason: '',
    applied_on: 'overall',
    target_id: '',
    cap_amount: 0,
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSessions();
    fetchStudents();
    fetchFeeHeads();
    fetchTransportRoutes();
    fetchHostels();
    fetchDiscounts();
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

  const fetchFeeHeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/fee/heads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFeeHeads(data);
      }
    } catch (error) {
      console.error('Error fetching fee heads:', error);
    }
  };

  const fetchTransportRoutes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/transport/routes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransportRoutes(data);
      }
    } catch (error) {
      console.error('Error fetching transport routes:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['value', 'cap_amount'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleAppliedOnChange = (e) => {
    const appliedOn = e.target.value;
    setFormData(prev => ({
      ...prev,
      applied_on: appliedOn,
      target_id: '' // Reset target_id when applied_on changes
    }));
  };

  const getTargetOptions = () => {
    switch (formData.applied_on) {
      case 'head':
        return feeHeads;
      case 'transport':
        return transportRoutes;
      case 'hostel':
        return hostels;
      default:
        return [];
    }
  };

  const getTargetDisplayName = (target) => {
    switch (formData.applied_on) {
      case 'head':
        return target.name;
      case 'transport':
        return target.route_name;
      case 'hostel':
        return target.hostel_name;
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validations
    if (!formData.student_id) {
      setMessage('Please select a student.');
      setLoading(false);
      return;
    }
    if (!formData.session_name) {
      setMessage('Please select a session.');
      setLoading(false);
      return;
    }
    if (!formData.reason.trim()) {
      setMessage('Please provide a reason for the discount.');
      setLoading(false);
      return;
    }
    if (formData.discount_type === 'percent' && (formData.value <= 0 || formData.value > 100)) {
      setMessage('Percent discount must be between 1 and 100.');
      setLoading(false);
      return;
    }
    if (formData.discount_type === 'fixed' && formData.value <= 0) {
      setMessage('Fixed discount amount must be greater than 0.');
      setLoading(false);
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      setMessage('Please select both start and end dates.');
      setLoading(false);
      return;
    }
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setMessage('End date must be after start date.');
      setLoading(false);
      return;
    }
    if (formData.discount_type === 'fixed' && formData.cap_amount < 0) {
      setMessage('Cap amount cannot be negative.');
      setLoading(false);
      return;
    }

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
        setMessage('Discount created successfully!');
        setFormData({
          student_id: '',
          session_name: '',
          discount_type: 'percent',
          value: 0,
          reason: '',
          applied_on: 'overall',
          target_id: '',
          cap_amount: 0,
          start_date: '',
          end_date: ''
        });
        fetchDiscounts();
      } else {
        setMessage(data.message || 'Failed to create discount');
      }
    } catch (error) {
      setMessage('Error creating discount: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Fee Discount Management</h1>
      <p>Create and manage student fee discounts.</p>

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
        <h3>Create Discount</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Student:</label>
            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Discount Type:</label>
            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label>Value {formData.discount_type === 'percent' ? '(%)' : '(₹)'}:</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              min="0"
              max={formData.discount_type === 'percent' ? 100 : undefined}
              step={formData.discount_type === 'percent' ? 1 : 0.01}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          {formData.discount_type === 'fixed' && (
            <div>
              <label>Cap Amount (₹):</label>
              <input
                type="number"
                name="cap_amount"
                value={formData.cap_amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Applied On:</label>
            <select
              name="applied_on"
              value={formData.applied_on}
              onChange={handleAppliedOnChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="overall">Overall Fees</option>
              <option value="head">Specific Fee Head</option>
              <option value="transport">Transport</option>
              <option value="hostel">Hostel</option>
            </select>
          </div>
          {['head', 'transport', 'hostel'].includes(formData.applied_on) && (
            <div>
              <label>Target {formData.applied_on.charAt(0).toUpperCase() + formData.applied_on.slice(1)}:</label>
              <select
                name="target_id"
                value={formData.target_id}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select Target</option>
                {getTargetOptions().map(target => (
                  <option key={target._id} value={target._id}>
                    {getTargetDisplayName(target)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Reason:</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="e.g., Merit scholarship, Sibling discount, Financial aid"
            required
            rows="3"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
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
          {loading ? 'Creating...' : 'Create Discount'}
        </button>
      </form>

      <h3>Existing Discounts</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {discounts.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Session</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Value</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Applied On</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Reason</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(discount => (
                <tr key={discount._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.student_id?.first_name} {discount.student_id?.last_name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.session_name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.discount_type === 'percent' ? 'Percent' : 'Fixed'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.discount_type === 'percent'
                      ? `${discount.value}%`
                      : `₹${discount.value.toFixed(2)}`
                    }
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.applied_on.charAt(0).toUpperCase() + discount.applied_on.slice(1)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {discount.reason}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: discount.status === 'active' ? '#d4edda' : '#f8d7da',
                      color: discount.status === 'active' ? '#155724' : '#721c24'
                    }}>
                      {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
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

export default GenerateDiscount;
