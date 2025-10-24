import React, { useState, useEffect, useCallback } from 'react';
import { workApi } from '../../services/adminApi';

const StaffWorkUpdates = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [updates, setUpdates] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('updates'); // 'updates' or 'reports'

  const fetchUpdatesAndReports = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'updates') {
        const result = await workApi.getTaskUpdates(selectedTask);
        if (result.success) {
          setUpdates(result.data);
        }
      } else {
        const result = await workApi.getPendingReports();
        if (result.success) {
          // Filter reports for selected task
          const taskReports = result.data.filter(report => report.task_id.task_id === parseInt(selectedTask));
          setReports(taskReports);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTask, activeTab]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      fetchUpdatesAndReports();
    }
  }, [selectedTask, activeTab, fetchUpdatesAndReports]);

  const fetchTasks = async () => {
    try {
      const result = await workApi.getAllTasks();
      if (result.success) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleReviewReport = async (reportId, status, comments) => {
    try {
      const result = await workApi.reviewReport({
        report_id: reportId,
        status,
        comments
      });
      if (result.success) {
        // Refresh reports
        fetchUpdatesAndReports();
        alert(`Report ${status} successfully!`);
      } else {
        alert('Failed to review report');
      }
    } catch (error) {
      alert('Error reviewing report');
    }
  };

  const handleAddComment = async (updateId, comment) => {
    if (!comment.trim()) return;

    try {
      const result = await workApi.addComment({
        update_id: updateId,
        comment
      });
      if (result.success) {
        // Refresh updates
        fetchUpdatesAndReports();
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      alert('Error adding comment');
    }
  };

  const handleCloseTask = async (taskId) => {
    if (window.confirm('Are you sure you want to close this task?')) {
      try {
        const result = await workApi.closeTask(taskId);
        if (result.success) {
          alert('Task closed successfully!');
          fetchTasks();
          fetchUpdatesAndReports();
        } else {
          alert('Failed to close task');
        }
      } catch (error) {
        alert('Error closing task');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loadingData) {
    return (
      <div className="menu-content">
        <h1>Staff Work Updates</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="menu-content">
      <h1>Staff Work Updates</h1>
      <p>Track progress, review reports, and manage task updates.</p>

      <div className="filters">
        <div className="form-group">
          <label htmlFor="task-select">Select Task:</label>
          <select
            id="task-select"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
          >
            <option value="">Choose a task...</option>
            {tasks.map(task => (
              <option key={task.task_id} value={task.task_id}>
                {task.title} (ID: {task.task_id})
              </option>
            ))}
          </select>
        </div>

        {selectedTask && (
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'updates' ? 'active' : ''}`}
              onClick={() => setActiveTab('updates')}
            >
              Task Updates
            </button>
            <button
              className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Work Reports
            </button>
          </div>
        )}
      </div>

      {!selectedTask ? (
        <div className="no-selection">
          Please select a task to view updates and reports.
        </div>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div className="updates-container">
          {activeTab === 'updates' ? (
            <div className="updates-section">
              <h3>Task Updates Timeline</h3>
              {updates.length === 0 ? (
                <p>No updates available for this task.</p>
              ) : (
                <div className="updates-list">
                  {updates.map(update => (
                    <div key={update.update_id} className="update-item">
                      <div className="update-header">
                        <strong>{update.staff_id.name}</strong>
                        <span className="update-time">{formatDate(update.timestamp)}</span>
                      </div>
                      <div className="update-content">
                        {update.content}
                      </div>
                      {update.admin_comments.length > 0 && (
                        <div className="admin-comments">
                          <h4>Admin Comments:</h4>
                          {update.admin_comments.map((comment, index) => (
                            <div key={index} className="comment">
                              <strong>{comment.commented_by.name}:</strong> {comment.comment}
                              <span className="comment-time">({formatDate(comment.commented_at)})</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="comment-form">
                        <input
                          type="text"
                          placeholder="Add admin comment..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(update.update_id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="reports-section">
              <h3>Work Reports</h3>
              {reports.length === 0 ? (
                <p>No pending reports for this task.</p>
              ) : (
                <div className="reports-list">
                  {reports.map(report => (
                    <div key={report.report_id} className="report-item">
                      <div className="report-header">
                        <strong>{report.staff_id.name}</strong>
                        <span className="report-time">{formatDate(report.createdAt)}</span>
                        <span className={`status-badge status-${report.status}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="report-content">
                        {report.content}
                      </div>
                      {report.status === 'pending' && (
                        <div className="report-actions">
                          <button
                            className="btn-approve"
                            onClick={() => handleReviewReport(report.report_id, 'reviewed', '')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => {
                              const comments = prompt('Enter rejection comments:');
                              if (comments !== null) {
                                handleReviewReport(report.report_id, 'rejected', comments);
                              }
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {report.status === 'rejected' && report.admin_comments && (
                        <div className="rejection-comments">
                          <strong>Rejection Reason:</strong> {report.admin_comments}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="task-actions">
            <button
              className="btn-close-task"
              onClick={() => handleCloseTask(selectedTask)}
            >
              Close Task
            </button>
          </div>
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
          margin-bottom: 15px;
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

        .tab-buttons {
          display: flex;
          gap: 10px;
        }

        .tab-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }

        .tab-btn.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .no-selection {
          text-align: center;
          padding: 40px;
          color: #6c757d;
          font-style: italic;
        }

        .updates-container {
          margin-top: 20px;
        }

        .updates-list, .reports-list {
          margin-top: 15px;
        }

        .update-item, .report-item {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          background-color: white;
        }

        .update-header, .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .update-time, .report-time {
          color: #6c757d;
          font-size: 12px;
        }

        .update-content, .report-content {
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .admin-comments {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin-top: 10px;
        }

        .comment {
          margin-bottom: 5px;
          font-size: 14px;
        }

        .comment-time {
          color: #6c757d;
          font-size: 12px;
        }

        .comment-form input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 10px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .status-pending {
          background-color: #ffc107;
          color: #212529;
        }

        .status-reviewed {
          background-color: #28a745;
        }

        .status-rejected {
          background-color: #dc3545;
        }

        .report-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .btn-approve {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-reject {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .rejection-comments {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-top: 10px;
        }

        .task-actions {
          margin-top: 30px;
          text-align: center;
        }

        .btn-close-task {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-close-task:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};

export default StaffWorkUpdates;
