import React from 'react';

const WorkManagement = () => {
  return (
    <div className="menu-content">
      <h1>Work Management</h1>
      <p>Assign tasks to staff, track progress, and manage reports.</p>
      <div className="button-group">
        <button className="btn">Add Work</button>
        <button className="btn">Add Work Report</button>
        <button className="btn">Assign Work</button>
        <button className="btn">Staff Work Details</button>
        <button className="btn">Staff Work Updates</button>
      </div>
      <h2>Add Work</h2>
      <p>Create new tasks.</p>
      <h2>Add Work Report</h2>
      <p>Submit task completion reports.</p>
      <h2>Assign Work</h2>
      <p>Assign tasks to specific staff members.</p>
      <h2>Staff Work Details</h2>
      <p>View task list per staff.</p>
      <h2>Staff Work Updates</h2>
      <p>Track progress of assigned tasks.</p>
    </div>
  );
};

export default WorkManagement;
