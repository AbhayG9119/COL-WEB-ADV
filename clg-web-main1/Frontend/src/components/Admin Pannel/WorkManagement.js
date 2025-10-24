import React, { useState } from 'react';
import AddWork from './AddWork';
import AssignWork from './AssignWork';
import AddWorkReport from './AddWorkReport';
import StaffWorkDetails from './StaffWorkDetails';
import StaffWorkUpdates from './StaffWorkUpdates';
import './WorkManagement.css';

const WorkManagement = () => {
  const [activeComponent, setActiveComponent] = useState('overview');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'add-work':
        return <AddWork />;
      case 'assign-work':
        return <AssignWork />;
      case 'add-report':
        return <AddWorkReport />;
      case 'work-details':
        return <StaffWorkDetails />;
      case 'work-updates':
        return <StaffWorkUpdates />;
      default:
        return (
          <div className="overview">
            <h1>Work Management System</h1>
            <p>Comprehensive task management for staff assignments, progress tracking, and reporting.</p>

            <div className="features-grid">
              <div className="feature-card" onClick={() => setActiveComponent('add-work')}>
                <h3>Add Work</h3>
                <p>Create new tasks with deadlines and priorities for staff members.</p>
                <button className="btn btn-primary">Create Task</button>
              </div>

              <div className="feature-card" onClick={() => setActiveComponent('assign-work')}>
                <h3>Assign Work</h3>
                <p>Assign created tasks to specific staff members with notes.</p>
                <button className="btn btn-primary">Assign Tasks</button>
              </div>

              <div className="feature-card" onClick={() => setActiveComponent('add-report')}>
                <h3>Add Work Report</h3>
                <p>Submit progress reports and completion status for assigned tasks.</p>
                <button className="btn btn-primary">Submit Report</button>
              </div>

              <div className="feature-card" onClick={() => setActiveComponent('work-details')}>
                <h3>Staff Work Details</h3>
                <p>View detailed task information and status for individual staff members.</p>
                <button className="btn btn-primary">View Details</button>
              </div>

              <div className="feature-card" onClick={() => setActiveComponent('work-updates')}>
                <h3>Staff Work Updates</h3>
                <p>Track task progress, review reports, and manage task lifecycle.</p>
                <button className="btn btn-primary">Manage Updates</button>
              </div>
            </div>

            <div className="quick-stats">
              <h3>Quick Actions</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Active Tasks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Pending Reports</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Completed Tasks</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="work-management">
      {activeComponent !== 'overview' && (
        <div className="breadcrumb">
          <button
            className="back-btn"
            onClick={() => setActiveComponent('overview')}
          >
            ← Back to Overview
          </button>
        </div>
      )}

      {renderComponent()}
    </div>
  );
};

export default WorkManagement;
