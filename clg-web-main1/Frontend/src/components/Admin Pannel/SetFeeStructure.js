import React from 'react';

const SetFeeStructure = () => {
  return (
    <div className="menu-content">
      <h1>Set Fee Structure</h1>
      <p>Define class-wise fees.</p>
      {/* Placeholder for form */}
      <form>
        <label>Class:</label>
        <input type="text" placeholder="e.g., Class 10" />
        <label>Fee Amount:</label>
        <input type="number" />
        <button type="submit">Set Fee</button>
      </form>
    </div>
  );
};

export default SetFeeStructure;
