import React from 'react';

const AssignWork = () => {
  return (
    <div className="menu-content">
      <h1>Assign Work</h1>
      <p>Assign work tasks to staff members.</p>
      {/* Placeholder for form */}
      <form>
        <label>Work ID:</label>
        <input type="text" />
        <label>Assign To:</label>
        <input type="text" />
        <label>Deadline:</label>
        <input type="date" />
        <button type="submit">Assign Work</button>
      </form>
    </div>
  );
};

export default AssignWork;
