import React from 'react';

const LeaveDays = () => {
  return (
    <div className="menu-content">
      <h1>Leave Days</h1>
      <p>Manage staff leave days.</p>
      {/* Placeholder for form */}
      <form>
        <label>Staff ID:</label>
        <input type="text" />
        <label>Leave Type:</label>
        <select>
          <option>Sick Leave</option>
          <option>Casual Leave</option>
        </select>
        <label>Start Date:</label>
        <input type="date" />
        <label>End Date:</label>
        <input type="date" />
        <button type="submit">Apply Leave</button>
      </form>
    </div>
  );
};

export default LeaveDays;
