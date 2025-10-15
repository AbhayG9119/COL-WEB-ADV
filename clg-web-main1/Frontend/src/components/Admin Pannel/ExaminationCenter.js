import React from 'react';

const ExaminationCenter = () => {
  return (
    <div className="menu-content">
      <h1>Examination Center</h1>
      <p>Manage examination centers.</p>
      {/* Placeholder for form */}
      <form>
        <label>Center Name:</label>
        <input type="text" />
        <label>Location:</label>
        <input type="text" />
        <button type="submit">Add Center</button>
      </form>
    </div>
  );
};

export default ExaminationCenter;
