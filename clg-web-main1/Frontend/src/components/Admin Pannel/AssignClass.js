import React from 'react';

const AssignClass = () => {
  return (
    <div className="menu-content">
      <h1>Assign Class</h1>
      <p>Assign classes to staff members.</p>
      {/* Placeholder for form */}
      <form>
        <label>Staff ID:</label>
        <input type="text" />
        <label>Class:</label>
        <input type="text" placeholder="e.g., Class 10" />
        <label>Subject:</label>
        <input type="text" placeholder="e.g., Mathematics" />
        <button type="submit">Assign Class</button>
      </form>
    </div>
  );
};

export default AssignClass;
