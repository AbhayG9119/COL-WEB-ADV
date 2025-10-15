import React from 'react';

const AddSubject = () => {
  return (
    <div className="menu-content">
      <h1>Add Subject</h1>
      <p>Assign subjects to classes.</p>
      {/* Placeholder for form */}
      <form>
        <label>Class:</label>
        <input type="text" placeholder="e.g., Class 10" />
        <label>Subject:</label>
        <input type="text" placeholder="e.g., Mathematics" />
        <button type="submit">Add Subject</button>
      </form>
    </div>
  );
};

export default AddSubject;
