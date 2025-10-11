import React from 'react';

const AddUser = () => {
  return (
    <div className="menu-content">
      <h1>Add User</h1>
      <p>Register new users with roles: Admin, Teacher, Student.</p>
      {/* Placeholder for form */}
      <form>
        <label>Name:</label>
        <input type="text" />
        <label>Email:</label>
        <input type="email" />
        <label>Role:</label>
        <select>
          <option>Admin</option>
          <option>Teacher</option>
          <option>Student</option>
        </select>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
