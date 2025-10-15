import React from 'react';

const Admission = () => {
  return (
    <div className="menu-content">
      <h1>Registration & Admission</h1>
      <p>Handle student registration and final admission process.</p>
      <div className="button-group">
        <button className="btn">Registration</button>
        <button className="btn">New Admission</button>
      </div>
      <h2>Registration</h2>
      <p>Enter basic student details.</p>
      <h2>New Admission</h2>
      <p>Confirm admission with roll number, class, section.</p>
    </div>
  );
};

export default Admission;
