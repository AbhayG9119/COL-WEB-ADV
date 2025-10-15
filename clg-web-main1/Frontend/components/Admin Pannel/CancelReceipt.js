import React from 'react';

const CancelReceipt = () => {
  return (
    <div className="menu-content">
      <h1>Cancel Receipt</h1>
      <p>Cancel issued fee receipts.</p>
      {/* Placeholder for form */}
      <form>
        <label>Receipt Number:</label>
        <input type="text" />
        <label>Reason for Cancellation:</label>
        <textarea></textarea>
        <button type="submit">Cancel Receipt</button>
      </form>
    </div>
  );
};

export default CancelReceipt;
