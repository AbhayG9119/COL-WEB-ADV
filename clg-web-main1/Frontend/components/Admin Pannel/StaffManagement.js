import React from 'react';

const StaffManagement = () => {
  return (
    <div className="menu-content">
      <h1>Staff Management</h1>
      <p>Manage staff designations, registration, attendance, assignments, and leaves.</p>
      <div className="button-group">
        <button className="btn">Add Designation</button>
        <button className="btn">Register Staff</button>
        <button className="btn">Staff Attendance</button>
        <button className="btn">Assign Class</button>
        <button className="btn">Leave Days</button>
      </div>
      <h2>Add Designation</h2>
      <p>Add roles like Teacher, Clerk, Principal.</p>
      <h2>Register Staff</h2>
      <p>Enter staff details and assign designation.</p>
      <h2>Staff Attendance</h2>
      <p>Mark attendance manually or via biometric.</p>
      <h2>Assign Class</h2>
      <p>Assign teachers to classes and subjects.</p>
      <h2>Leave Days</h2>
      <p>Manage staff leave applications and approvals.</p>
    </div>
  );
};

export default StaffManagement;
