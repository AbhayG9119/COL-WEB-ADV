import React from 'react';

const HostelFees = () => {
  return (
    <div className="menu-content">
      <h1>Hostel Fees</h1>
      <p>Define fees by room type.</p>
      {/* Placeholder for form */}
      <form>
        <label>Room Type:</label>
        <input type="text" placeholder="e.g., Single, Double" />
        <label>Fee:</label>
        <input type="number" />
        <button type="submit">Set Fee</button>
      </form>
    </div>
  );
};

export default HostelFees;
