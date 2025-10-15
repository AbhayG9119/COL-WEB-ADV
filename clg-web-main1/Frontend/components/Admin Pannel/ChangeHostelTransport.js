import React from 'react';

const ChangeHostelTransport = () => {
  return (
    <div className="menu-content">
      <h1>Change Hostel Transport</h1>
      <p>Update hostel and transport options for students.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student ID:</label>
        <input type="text" />
        <label>New Hostel:</label>
        <input type="text" />
        <label>New Transport Route:</label>
        <input type="text" />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ChangeHostelTransport;
