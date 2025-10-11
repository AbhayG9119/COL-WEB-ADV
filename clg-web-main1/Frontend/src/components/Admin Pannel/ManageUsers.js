import React from 'react';

const ManageUsers = () => {
  return (
    <div className="menu-content">
      <h1>Manage Users</h1>
      <p>Edit, delete, or reset passwords for existing users.</p>
      {/* Placeholder for user list */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Student</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
              <button>Reset Password</button>
            </td>
          </tr>
          {/* More rows */}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
