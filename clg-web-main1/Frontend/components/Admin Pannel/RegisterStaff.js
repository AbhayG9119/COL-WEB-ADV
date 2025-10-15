import React from 'react';

const RegisterStaff = () => {
  return (
    <div className="menu-content">
      <h1>Register Staff</h1>
      <p>Add new staff members to the system.</p>
      {/* Placeholder for form */}
      <form>
        <label>Name:</label>
        <input type="text" />
        <label>Email:</label>
        <input type="email" />
        <label>Designation:</label>
        <select>
          <option>Teacher</option>
          <option>Admin</option>
        </select>
        <button type="submit">Register Staff</button>
      </form>
    </div>
  );
};

export default RegisterStaff;
