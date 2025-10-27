import React, { useState } from 'react';

const AssignmentForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    deadline: '',
    resources: ''
  });
  const [errors, setErrors] = useState({});

  const subjects = ['Physics', 'Math', 'English', 'Science'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="assignment-form">
      <h2>Create Assignment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            aria-describedby={errors.subject ? 'subject-error' : null}
          >
            <option value="">Select Subject</option>
            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
          {errors.subject && <span id="subject-error" className="error">{errors.subject}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            aria-describedby={errors.title ? 'title-error' : null}
          />
          {errors.title && <span id="title-error" className="error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            aria-describedby={errors.deadline ? 'deadline-error' : null}
          />
          {errors.deadline && <span id="deadline-error" className="error">{errors.deadline}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="resources">Resources (optional):</label>
          <input
            type="text"
            id="resources"
            name="resources"
            value={formData.resources}
            onChange={handleChange}
            placeholder="e.g., link or file name"
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AssignmentForm;
