import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { enquiryApi } from '../../services/adminApi';

const AddVisitor = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    purpose: '',
    linkedEnquiryId: ''
  });
  const [enquiries, setEnquiries] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const result = await enquiryApi.getEnquiries();
      if (result.success) {
        setEnquiries(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries');
    }
  };

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
      case 'purpose':
        if (!value.trim()) error = 'Purpose is required';
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

    // Check for duplicate visitor
    if (name === 'contact' && value && /^\d{10}$/.test(value)) {
      checkDuplicateVisitor(value);
    }
  };

  const checkDuplicateVisitor = async (contact) => {
    try {
      const result = await enquiryApi.getVisitedList({ contact, recent: true });
      if (result.success && result.data.length > 0) {
        const lastVisit = result.data[0];
        const lastVisitDate = new Date(lastVisit.inTime);
        const now = new Date();
        const hoursDiff = (now - lastVisitDate) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setDuplicateWarning(`Warning: This contact visited ${Math.round(hoursDiff)} hours ago for "${lastVisit.purpose}".`);
        } else {
          setDuplicateWarning('');
        }
      } else {
        setDuplicateWarning('');
      }
    } catch (error) {
      console.error('Failed to check duplicate visitor');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear duplicate warning if contact changes
    if (name === 'contact') {
      setDuplicateWarning('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'linkedEnquiryId') { // linkedEnquiryId is optional
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        inTime: new Date().toISOString()
      };

      const result = await enquiryApi.addVisitor(dataToSend);
      if (result.success) {
        toast.success('Visitor logged successfully');
        setFormData({
          name: '',
          contact: '',
          purpose: '',
          linkedEnquiryId: ''
        });
        setErrors({});
        setDuplicateWarning('');
        // Show confirmation and option to view visited list
        if (window.confirm('Visitor logged successfully. Would you like to view the visited list?')) {
          // Navigate to visited list (assuming navigation is handled elsewhere)
        }
      } else {
        toast.error(result.error || 'Failed to add visitor');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Add Visitor</h1>

      {duplicateWarning && (
        <div className="warning-message">
          {duplicateWarning}
        </div>
      )}

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
            placeholder="Enter visitor name"
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
          <label>Purpose *</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.purpose ? 'error' : ''}
            placeholder="Purpose of visit"
          />
          {errors.purpose && <span className="error-text">{errors.purpose}</span>}
        </div>

        <div className="form-group">
          <label>Linked Enquiry (Optional)</label>
          <select
            name="linkedEnquiryId"
            value={formData.linkedEnquiryId}
            onChange={handleChange}
          >
            <option value="">Select enquiry if applicable</option>
            {enquiries.map(enquiry => (
              <option key={enquiry.id} value={enquiry.id}>
                {enquiry.name} - {enquiry.contact} ({enquiry.stream})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Visitor'}
        </button>
      </form>
    </div>
  );
};

export default AddVisitor;
