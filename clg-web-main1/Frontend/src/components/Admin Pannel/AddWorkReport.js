import React, { useState, useEffect } from 'react';
import { workApi } from '../../services/adminApi';
import './WorkManagement.css';

const AddWorkReport = () => {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    task_id: '',
    content: '',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const result = await workApi.getTaskStatus();
      if (result.success) {
        // Filter assignments that belong to current user (staff)
        // In a real app, this would be handled by backend role-based filtering
        setAssignments(result.data);
      }
    } catch (error) {
      setMessage('Failed to load assigned tasks');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      attachments: files
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // For now, we'll submit without file uploads
      // File upload functionality would need backend support
      const submitData = {
        task_id: parseInt(formData.task_id),
        content: formData.content,
        attachments: [] // Placeholder for file URLs
      };

      const result = await workApi.submitReport(submitData);
      if (result.success) {
        setMessage('Report submitted successfully!');
        setFormData({
          task_id: '',
          content: '',
          attachments: []
        });
      } else {
        setMessage(result.error || 'Failed to submit report');
      }
    } catch (error) {
      setMessage('An error occurred while submitting the report');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="menu-content">
        <h1>Add Work Report</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="menu-content">
      <h1>Add Work Report</h1>
      <p>Submit progress reports for your assigned tasks.</p>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="task_id">Select Task *</label>
          <select
            id="task_id"
            name="task_id"
            value={formData.task_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose a task...</option>
            {assignments.map(assignment => (
              <option key={assignment.task_id} value={assignment.task_id}>
                {assignment.task_id.title} (ID: {assignment.task_id.task_id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Report Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Describe your progress, challenges faced, and next steps..."
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="attachments">Attachments (Optional)</label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <small className="help-text">
            Supported formats: PDF, DOC, DOCX, JPG, PNG
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || assignments.length === 0}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>

      {assignments.length === 0 && (
        <div className="info-message">
          No assigned tasks available. Please contact your administrator.
        </div>
      )}


    </div>
  );
};

export default AddWorkReport;
