import React, { useState, useEffect, useCallback } from 'react';
import { workApi, staffApi } from '../../services/adminApi';

const StaffWorkDetails = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [taskStatus, setTaskStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const fetchTaskStatus = useCallback(async () => {
    setLoading(true);
    try {
      const result = await workApi.getTaskStatus(selectedStaff);
      if (result.success) {
        setTaskStatus(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch task status:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStaff]);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (selectedStaff) {
      fetchTaskStatus();
    }
  }, [selectedStaff, fetchTaskStatus]);

  const fetchStaff = async () => {
    try {
      const result = await staffApi.getStaff();
      if (result.success) {
        setStaff(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#28a745';
      case 'In Progress': return '#ffc107';
      case 'Open': return '#6c757d';
      case 'Assigned': return '#007bff';
      case 'Closed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loadingData) {
    return (
      <div className="menu-content">
        <h1>Staff Work Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="menu-content">
      <h1>Staff Work Details</h1>
      <p>View detailed work information and status for staff members.</p>

      <div className="filters">
        <div className="form-group">
          <label htmlFor="staff-select">Select Staff Member:</label>
          <select
            id="staff-select"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            <option value="">All Staff</option>
            {staff.map(member => (
              <option key={member._id} value={member._id}>
                {member.name} - {member.designation}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading task details...</p>
      ) : (
        <div className="work-details-table">
          {taskStatus.length === 0 ? (
            <div className="no-data">
              {selectedStaff ? 'No tasks assigned to this staff member.' : 'Select a staff member to view their tasks.'}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {taskStatus.map(assignment => (
                  <tr key={assignment._id}>
                    <td>{assignment.task_id.task_id}</td>
                    <td>{assignment.task_id.title}</td>
                    <td className="description-cell">
                      {assignment.task_id.description.length > 50
                        ? `${assignment.task_id.description.substring(0, 50)}...`
                        : assignment.task_id.description}
                    </td>
                    <td>
                      <span className={`priority-badge priority-${assignment.task_id.priority.toLowerCase()}`}>
                        {assignment.task_id.priority}
                      </span>
                    </td>
                    <td>{formatDate(assignment.task_id.deadline)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(assignment.task_id.status) }}
                      >
                        {assignment.task_id.status}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${assignment.completion_percentage}%` }}
                        ></div>
                        <span className="progress-text">{assignment.completion_percentage}%</span>
                      </div>
                    </td>
                    <td>{formatDate(assignment.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style jsx>{`
        .filters {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group select {
          width: 300px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .work-details-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }

        .description-cell {
          max-width: 200px;
          word-wrap: break-word;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .priority-high {
          background-color: #dc3545;
        }

        .priority-medium {
          background-color: #ffc107;
          color: #212529;
        }

        .priority-low {
          background-color: #28a745;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .progress-bar {
          width: 100px;
          height: 20px;
          background-color: #e9ecef;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #007bff;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          color: #fff;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #6c757d;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default StaffWorkDetails;
