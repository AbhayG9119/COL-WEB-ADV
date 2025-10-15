import React from 'react';

const AddDesignation = () => {
  return (
    <div className="menu-content">
      <h1>Add Designation</h1>
      <p>Create new staff designations.</p>
      {/* Placeholder for form */}
      <form>
        <label>Designation Name:</label>
        <input type="text" />
        <label>Description:</label>
        <textarea></textarea>
        <button type="submit">Add Designation</button>
      </form>
    </div>
  );
};

export default AddDesignation;
