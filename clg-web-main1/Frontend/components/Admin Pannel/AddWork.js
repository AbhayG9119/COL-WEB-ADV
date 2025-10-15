import React from 'react';

const AddWork = () => {
  return (
    <div className="menu-content">
      <h1>Add Work</h1>
      <p>Add new work tasks for staff.</p>
      {/* Placeholder for form */}
      <form>
        <label>Work Title:</label>
        <input type="text" />
        <label>Description:</label>
        <textarea></textarea>
        <label>Assigned To:</label>
        <input type="text" />
        <button type="submit">Add Work</button>
      </form>
    </div>
  );
};

export default AddWork;
