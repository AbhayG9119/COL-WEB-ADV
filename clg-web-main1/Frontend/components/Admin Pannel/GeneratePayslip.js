import React from 'react';

const GeneratePayslip = () => {
  return (
    <div className="menu-content">
      <h1>Generate Payslip</h1>
      <p>Generate payslips for staff.</p>
      {/* Placeholder for form */}
      <form>
        <label>Month:</label>
        <input type="month" />
        <label>Staff ID:</label>
        <input type="text" />
        <button type="submit">Generate Payslip</button>
      </form>
    </div>
  );
};

export default GeneratePayslip;
