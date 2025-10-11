import React from 'react';

const NewAdmission = () => {
  return (
    <div className="menu-content">
      <h1>New Admission</h1>
      <p>Admit new students to the institution.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student Name:</label>
        <input type="text" />
        <label>Date of Birth:</label>
        <input type="date" />
        <label>Parent Contact:</label>
        <input type="tel" />
        <button type="submit">Admit Student</button>
      </form>
    </div>
  );
};

export default NewAdmission;
