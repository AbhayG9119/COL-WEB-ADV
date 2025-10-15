import React from 'react';

const GenerateSalary = () => {
  return (
    <div className="menu-content">
      <h1>Generate Salary</h1>
      <p>Generate salaries for staff.</p>
      {/* Placeholder for form */}
      <form>
        <label>Month:</label>
        <input type="month" />
        <label>Staff ID:</label>
        <input type="text" />
        <button type="submit">Generate Salary</button>
      </form>
    </div>
  );
};

export default GenerateSalary;
