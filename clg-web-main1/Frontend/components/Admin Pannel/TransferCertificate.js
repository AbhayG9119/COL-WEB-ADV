import React from 'react';

const TransferCertificate = () => {
  return (
    <div className="menu-content">
      <h1>Transfer Certificate</h1>
      <p>Generate transfer certificates.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student ID:</label>
        <input type="text" />
        <label>Reason:</label>
        <input type="text" />
        <button type="submit">Generate Certificate</button>
      </form>
    </div>
  );
};

export default TransferCertificate;
