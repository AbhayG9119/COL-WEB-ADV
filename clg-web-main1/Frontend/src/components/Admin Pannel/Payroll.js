import React from 'react';

const Payroll = () => {
  return (
    <div className="menu-content">
      <h1>Payroll</h1>
      <p>Manage staff salaries and generate payslips.</p>
      <div className="button-group">
        <button className="btn">Salary Settings</button>
        <button className="btn">Generate Salary</button>
        <button className="btn">Generate Payslip</button>
      </div>
      <h2>Salary Settings</h2>
      <p>Set basic pay, allowances, deductions.</p>
      <h2>Generate Salary</h2>
      <p>Calculate salary based on attendance and settings.</p>
      <h2>Generate Payslip</h2>
      <p>Create and print payslips.</p>
    </div>
  );
};

export default Payroll;
