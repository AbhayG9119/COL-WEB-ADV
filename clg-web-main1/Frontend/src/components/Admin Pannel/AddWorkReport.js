import React from 'react';

const AddWorkReport = () => {
  return (
    <div className="menu-content">
      <h1>Add Work Report</h1>
      <p>Add reports for completed work.</p>
      {/* Placeholder for form */}
      <form>
        <label>Work ID:</label>
        <input type="text" />
        <label>Report:</label>
        <textarea></textarea>
        <label>Status:</label>
        <select>
          <option>Completed</option>
          <option>In Progress</option>
        </select>
        <button type="submit">Add Report</button>
      </form>
    </div>
  );
};

export default AddWorkReport;
