import React, { useState } from 'react';
import { workApi } from '../../services/adminApi';
import './WorkManagement.css';

const AddWork = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await workApi.createTask(formData);
      if (result.success) {
        setMessage('Task created successfully!');
        setFormData({
          title: '',
          description: '',
          deadline: '',
          priority: 'Medium'
        });
      } else {
        setMessage(result.error || 'Failed to create task');
      }
    } catch (error) {
      setMessage('An error occurred while creating the task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Add Work</h1>
      <p>Create new tasks for staff members.</p>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="work-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter task title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline *</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>


    </div>
  );
};

export default AddWork;
