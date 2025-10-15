import React from 'react';

const SalarySettings = () => {
  return (
    <div className="menu-content">
      <h1>Salary Settings</h1>
      <p>Configure salary settings.</p>
      {/* Placeholder for form */}
      <form>
        <label>Basic Salary:</label>
        <input type="number" />
        <label>Allowance:</label>
        <input type="number" />
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default SalarySettings;
