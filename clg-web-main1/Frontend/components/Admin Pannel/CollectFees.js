import React from 'react';

const CollectFees = () => {
  return (
    <div className="menu-content">
      <h1>Collect Fees</h1>
      <p>Collect fees from students.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student ID:</label>
        <input type="text" />
        <label>Amount:</label>
        <input type="number" />
        <label>Fee Type:</label>
        <select>
          <option>Tuition</option>
          <option>Transport</option>
          <option>Hostel</option>
        </select>
        <button type="submit">Collect Fee</button>
      </form>
    </div>
  );
};

export default CollectFees;
