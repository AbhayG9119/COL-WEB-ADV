import React, { useState, useEffect } from 'react';
import { staffApi } from '../../services/adminApi';

const AddDesignation = () => {
  const [designationName, setDesignationName] = useState('');
  const [designations, setDesignations] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDesignations = async () => {
      const result = await staffApi.getDesignations();
      if (result.success) {
        setDesignations(result.data);
      }
    };
    fetchDesignations();
  }, []);

  useEffect(() => {
    const trimmedName = designationName.trim();
    const isUnique = !designations.some(d => d.name.toLowerCase() === trimmedName.toLowerCase());
    setIsValid(trimmedName.length > 0 && trimmedName.length <= 50 && isUnique);
  }, [designationName, designations]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    const result = await staffApi.addDesignation(designationName.trim());
    if (result.success) {
      setDesignations(prev => [...prev, result.data]);
      setMessage('Designation added successfully');
      setDesignationName('');
    } else {
      setMessage(result.error || 'Failed to add designation');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="menu-content">
      <h1>Add Designation</h1>
      <p>Create new staff designations.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Designation Name:</label>
          <input
            type="text"
            value={designationName}
            onChange={(e) => setDesignationName(e.target.value)}
            maxLength={50}
            required
          />
          {designationName.trim() && !isValid && (
            <span style={{ color: 'red' }}>
              {designationName.trim().length === 0 ? 'Required' :
               designationName.length > 50 ? 'Max 50 chars' :
               'Already exists'}
            </span>
          )}
        </div>
        <button type="submit" disabled={!isValid || loading}>
          {loading ? 'Adding...' : 'Add Designation'}
        </button>
      </form>
      {message && <div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default AddDesignation;
