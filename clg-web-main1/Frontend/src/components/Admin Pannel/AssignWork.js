import React, { useState, useEffect } from 'react';
import { workApi, staffApi } from '../../services/adminApi';
import './WorkManagement.css';

const AssignWork = () => {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    task_id: '',
    staff_id: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResult, staffResult] = await Promise.all([
        workApi.getAllTasks(),
        staffApi.getStaff()
      ]);

      if (tasksResult.success) {
        // Filter tasks that are not yet assigned
        const unassignedTasks = tasksResult.data.filter(task => task.status === 'Open');
        setTasks(unassignedTasks);
      }

      if (staffResult.success) {
        setStaff(staffResult.data);
      }
    } catch (error) {
      setMessage('Failed to load data');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await workApi.assignTask(formData);
      if (result.success) {
        setMessage('Task assigned successfully!');
        setFormData({
          task_id: '',
          staff_id: '',
          notes: ''
        });
        // Refresh tasks list
        fetchData();
      } else {
        setMessage(result.error || 'Failed to assign task');
      }
    } catch (error) {
      setMessage('An error occurred while assigning the task');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="menu-content">
        <h1>Assign Work</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="menu-content">
      <h1>Assign Work</h1>
      <p>Assign tasks to staff members.</p>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="assign-form">
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
            {tasks.map(task => (
              <option key={task.task_id} value={task.task_id}>
                {task.title} (ID: {task.task_id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="staff_id">Assign To Staff *</label>
          <select
            id="staff_id"
            name="staff_id"
            value={formData.staff_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose staff member...</option>
            {staff.map(member => (
              <option key={member._id} value={member._id}>
                {member.name} - {member.designation}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any special instructions..."
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || tasks.length === 0 || staff.length === 0}
        >
          {loading ? 'Assigning...' : 'Assign Task'}
        </button>
      </form>

      {tasks.length === 0 && (
        <div className="info-message">
          No unassigned tasks available. Create new tasks first.
        </div>
      )}


    </div>
  );
};

export default AssignWork;
