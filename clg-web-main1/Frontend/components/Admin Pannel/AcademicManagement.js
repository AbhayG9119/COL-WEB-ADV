import React from 'react';

const AcademicManagement = () => {
  return (
    <div className="menu-content">
      <h1>Academic Management</h1>
      <p>Set up academic year, fees, transport, hostel, discounts, and subjects.</p>
      <div className="button-group">
        <button className="btn">Session Management</button>
        <button className="btn">Set Fee Structure</button>
        <button className="btn">Transport Routes & Fare</button>
        <button className="btn">Hostel Fees</button>
        <button className="btn">Generate Discount</button>
        <button className="btn">Add Subject</button>
      </div>
      <h2>Session Management</h2>
      <p>Create/update academic years and define classes, subjects, fees, etc.</p>
      <h2>Set Fee Structure</h2>
      <p>Define class-wise fees.</p>
      <h2>Transport Routes & Fare</h2>
      <p>Set bus routes and charges.</p>
      <h2>Hostel Fees</h2>
      <p>Define fees by room type.</p>
      <h2>Generate Discount</h2>
      <p>Apply scholarships or sibling discounts.</p>
      <h2>Add Subject</h2>
      <p>Assign subjects to classes.</p>
    </div>
  );
};

export default AcademicManagement;
