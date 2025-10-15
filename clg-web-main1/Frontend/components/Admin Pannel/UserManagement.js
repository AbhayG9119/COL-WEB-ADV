import React from 'react';

const UserManagement = () => {
  return (
    <div className="menu-content">
      <h1>User Management</h1>
      <p>Manage users (students, staff, parents) in the system.</p>
      <div className="button-group">
        <button className="btn">Add User</button>
        <button className="btn">Manage Users</button>
      </div>
      <h2>Add User</h2>
      <p>Register new users with roles: Admin, Teacher, Student.</p>
      {/* Placeholder for form */}
      <h2>Manage Users</h2>
      <p>Edit, delete, or reset passwords for existing users.</p>
      {/* Placeholder for user list */}
    </div>
  );
};

export default UserManagement;
