import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { enquiryApi } from '../../services/adminApi';

const AddEnquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    stream: '',
    source: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'contact':
        if (!value.trim()) error = 'Contact is required';
        else if (!/^\d{10}$/.test(value)) error = 'Contact must be 10 digits';
        break;
      case 'stream':
        if (!value.trim()) error = 'Stream is required';
        break;
      case 'source':
        if (!value.trim()) error = 'Source is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await enquiryApi.addEnquiry(formData);
      if (result.success) {
        toast.success('Enquiry added successfully');
        setFormData({
          name: '',
          contact: '',
          stream: '',
          source: '',
          remarks: ''
        });
        setErrors({});
        // Option to add follow-up immediately
        if (window.confirm('Would you like to add a follow-up now?')) {
          // Navigate to follow-up or open modal (assuming navigation is handled elsewhere)
        }
      } else {
        toast.error(result.error || 'Failed to add enquiry');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Add Enquiry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name ? 'error' : ''}
            placeholder="Enter full name"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Contact *</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.contact ? 'error' : ''}
            placeholder="10-digit mobile number"
            maxLength="10"
          />
          {errors.contact && <span className="error-text">{errors.contact}</span>}
        </div>

        <div className="form-group">
          <label>Stream *</label>
          <select
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.stream ? 'error' : ''}
          >
            <option value="">Select Stream</option>
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
            <option value="Engineering">Engineering</option>
            <option value="Medical">Medical</option>
          </select>
          {errors.stream && <span className="error-text">{errors.stream}</span>}
        </div>

        <div className="form-group">
          <label>Source *</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.source ? 'error' : ''}
          >
            <option value="">Select Source</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Call">Call</option>
            <option value="Web">Web</option>
            <option value="Referral">Referral</option>
            <option value="Advertisement">Advertisement</option>
          </select>
          {errors.source && <span className="error-text">{errors.source}</span>}
        </div>

        <div className="form-group">
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Additional remarks"
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Enquiry'}
        </button>
      </form>
    </div>
  );
};

export default AddEnquiry;
