import React from 'react';

const SessionManagement = () => {
  return (
    <div className="menu-content">
      <h1>Session Management</h1>
      <p>Create/update academic years and define classes, subjects, fees, etc.</p>
      {/* Placeholder for form */}
      <form>
        <label>Academic Year:</label>
        <input type="text" placeholder="e.g., 2023-2024" />
        <label>Classes:</label>
        <input type="text" placeholder="Comma separated" />
        <button type="submit">Save Session</button>
      </form>
    </div>
  );
};

export default SessionManagement;
