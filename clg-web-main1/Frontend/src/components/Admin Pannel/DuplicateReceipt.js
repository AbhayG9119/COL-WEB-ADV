import React from 'react';

const DuplicateReceipt = () => {
  return (
    <div className="menu-content">
      <h1>Duplicate Receipt</h1>
      <p>Generate duplicate fee receipts.</p>
      {/* Placeholder for form */}
      <form>
        <label>Original Receipt Number:</label>
        <input type="text" />
        <label>Reason:</label>
        <textarea></textarea>
        <button type="submit">Generate Duplicate</button>
      </form>
    </div>
  );
};

export default DuplicateReceipt;
