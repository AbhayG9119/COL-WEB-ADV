import React from 'react';

const StaffAttendance = () => {
  return (
    <div className="menu-content">
      <h1>Staff Attendance</h1>
      <p>Manage staff attendance records.</p>
      {/* Placeholder for form */}
      <form>
        <label>Staff ID:</label>
        <input type="text" />
        <label>Date:</label>
        <input type="date" />
        <label>Status:</label>
        <select>
          <option>Present</option>
          <option>Absent</option>
        </select>
        <button type="submit">Mark Attendance</button>
      </form>
    </div>
  );
};

export default StaffAttendance;
