import React, { useState, useEffect } from 'react';
import '../../styles/ComplaintsModule.css';

const RaiseComplaint = () => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    attachment: null
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    // Auto-fill current date
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date_raised: today }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    else if (formData.subject.length > 100) newErrors.subject = 'Subject must be max 100 characters';
    if (!formData.description) newErrors.description = 'Description is required';
    else if (formData.description.length < 30) newErrors.description = 'Description must be at least 30 characters';
    if (formData.attachment && formData.attachment.size > 5 * 1024 * 1024) newErrors.attachment = 'File size must be less than 5MB';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate unique ID
    const existingComplaints = JSON.parse(localStorage.getItem('studentComplaints') || '[]');
    const nextId = existingComplaints.length + 1;
    const complaintId = `CMP${new Date().getFullYear()}-${String(nextId).padStart(3, '0')}`;

    const newComplaint = {
      complaint_id: complaintId,
      category: formData.category,
      subject: formData.subject,
      description: formData.description,
      date_raised: formData.date_raised,
      status: 'Pending',
      attachment: formData.attachment ? formData.attachment.name : null,
      admin_remarks: ''
    };

    existingComplaints.push(newComplaint);
    localStorage.setItem('studentComplaints', JSON.stringify(existingComplaints));

    setToast('Complaint raised successfully!');
    setTimeout(() => setToast(''), 3000);

    // Reset form
    setFormData({
      category: '',
      subject: '',
      description: '',
      attachment: null,
      date_raised: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      category: '',
      subject: '',
      description: '',
      attachment: null,
      date_raised: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  return (
    <div className="menu-content">
      <h1>Raise Complaint</h1>
      {toast && <div className="toast">{toast}</div>}
      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={errors.category ? 'error' : ''}
          >
            <option value="">Select Category</option>
            <option value="Hostel">Hostel</option>
            <option value="Academics">Academics</option>
            <option value="Transport">Transport</option>
            <option value="Fees">Fees</option>
            <option value="Exam">Exam</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>
        <div className="form-group">
          <label>Subject *</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            maxLength="100"
            className={errors.subject ? 'error' : ''}
          />
          {errors.subject && <span className="error-text">{errors.subject}</span>}
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minLength="30"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
        <div className="form-group">
          <label>Attachment (Optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
          />
          {errors.attachment && <span className="error-text">{errors.attachment}</span>}
        </div>
        <div className="form-group">
          <label>Date Raised</label>
          <input
            type="date"
            value={formData.date_raised}
            readOnly
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn submit-btn">Submit</button>
          <button type="button" onClick={handleReset} className="btn reset-btn">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default RaiseComplaint;
