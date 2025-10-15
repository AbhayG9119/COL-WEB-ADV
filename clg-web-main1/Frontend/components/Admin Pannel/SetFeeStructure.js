import React, { useState, useEffect } from 'react';

const SetFeeStructure = () => {
  const [sessions, setSessions] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [formData, setFormData] = useState({
    sessionId: '',
    classId: '',
    feeHeads: [{ name: '', amount: 0, isMandatory: true, description: '' }],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSessions();
    fetchFeeStructures();
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

  const fetchFeeStructures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/fee/structures', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFeeStructures(data);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeeHeadChange = (index, field, value) => {
    const updatedFeeHeads = [...formData.feeHeads];
    updatedFeeHeads[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({
      ...prev,
      feeHeads: updatedFeeHeads
    }));
  };

  const addFeeHead = () => {
    setFormData(prev => ({
      ...prev,
      feeHeads: [...prev.feeHeads, { name: '', amount: 0, isMandatory: true, description: '' }]
    }));
  };

  const removeFeeHead = (index) => {
    if (formData.feeHeads.length > 1) {
      const updatedFeeHeads = formData.feeHeads.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        feeHeads: updatedFeeHeads
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/erp/fee/structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Fee structure created successfully!');
        setFormData({
          sessionId: '',
          classId: '',
          feeHeads: [{ name: '', amount: 0, isMandatory: true, description: '' }],
          description: ''
        });
        fetchFeeStructures();
      } else {
        setMessage(data.message || 'Failed to create fee structure');
      }
    } catch (error) {
      setMessage('Error creating fee structure: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.feeHeads.reduce((total, head) => total + head.amount, 0);
  };

  return (
    <div className="menu-content">
      <h1>Set Fee Structure</h1>
      <p>Define class-wise fee structures with multiple fee heads.</p>

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
        <h3>Create Fee Structure</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Optional description"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <h4>Fee Heads</h4>
        {formData.feeHeads.map((head, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '15px',
            marginBottom: '10px',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr', gap: '10px', alignItems: 'end' }}>
              <div>
                <label>Fee Head Name:</label>
                <input
                  type="text"
                  value={head.name}
                  onChange={(e) => handleFeeHeadChange(index, 'name', e.target.value)}
                  placeholder="e.g., Tuition Fee, Library Fee"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Amount:</label>
                <input
                  type="number"
                  value={head.amount}
                  onChange={(e) => handleFeeHeadChange(index, 'amount', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={head.isMandatory}
                    onChange={(e) => handleFeeHeadChange(index, 'isMandatory', e.target.checked)}
                  />
                  Mandatory
                </label>
              </div>
              <div>
                {formData.feeHeads.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeeHead(index)}
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
            <div style={{ marginTop: '10px' }}>
              <label>Description:</label>
              <input
                type="text"
                value={head.description}
                onChange={(e) => handleFeeHeadChange(index, 'description', e.target.value)}
                placeholder="Optional description for this fee head"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </div>
        ))}

        <div style={{ marginBottom: '15px' }}>
          <button
            type="button"
            onClick={addFeeHead}
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
            Add Fee Head
          </button>
          <strong>Total Amount: ₹{calculateTotal().toFixed(2)}</strong>
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
          {loading ? 'Creating...' : 'Create Fee Structure'}
        </button>
      </form>

      <h3>Existing Fee Structures</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {feeStructures.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Session</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Class</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Fee Heads</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {feeStructures.map(structure => (
                <tr key={structure._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {structure.sessionId?.sessionId || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{structure.classId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {structure.feeHeads.map((head, index) => (
                      <div key={index}>
                        {head.name}: ₹{head.amount}
                        {head.isMandatory ? ' (Mandatory)' : ' (Optional)'}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    ₹{structure.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No fee structures found.</p>
        )}
      </div>
    </div>
  );
};

export default SetFeeStructure;
