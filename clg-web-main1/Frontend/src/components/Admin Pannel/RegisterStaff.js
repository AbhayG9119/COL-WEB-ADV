import React, { useState, useEffect } from 'react';
import { staffApi } from '../../services/adminApi';

const RegisterStaff = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    designationId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    address: ''
  });
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
    const { fullName, email, phoneNumber, gender, designationId, joiningDate } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const dobValid = !formData.dateOfBirth || new Date(formData.dateOfBirth) <= new Date();
    setIsValid(
      fullName.trim().length > 0 && fullName.length <= 100 &&
      emailRegex.test(email) &&
      phoneRegex.test(phoneNumber) &&
      gender &&
      designationId &&
      joiningDate &&
      dobValid
    );
  }, [formData]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    const result = await staffApi.registerStaff(formData);
    setLoading(false);
    if (result.success) {
      setMessage('Staff registered successfully');
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        designationId: '',
        joiningDate: new Date().toISOString().split('T')[0],
        address: ''
      });
    } else {
      setMessage(result.error || 'Failed to register staff');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="menu-content">
      <h1>Register Staff</h1>
      <p>Add new staff members to the system.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            pattern="\d{10}"
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label>Designation:</label>
          <select name="designationId" value={formData.designationId} onChange={handleChange} required>
            <option value="">Select Designation</option>
            {designations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Joining Date:</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            maxLength={250}
          />
        </div>
        <button type="submit" disabled={!isValid || loading}>
          {loading ? 'Registering...' : 'Register Staff'}
        </button>
      </form>
      {message && <div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default RegisterStaff;
