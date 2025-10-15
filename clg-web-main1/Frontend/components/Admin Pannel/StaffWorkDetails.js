import React from 'react';

const StaffWorkDetails = () => {
  return (
    <div className="menu-content">
      <h1>Staff Work Details</h1>
      <p>View detailed work information for staff.</p>
      {/* Placeholder for table */}
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Work Title</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Smith</td>
            <td>Project Report</td>
            <td>Completed</td>
            <td>View Details</td>
          </tr>
          {/* More rows */}
        </tbody>
      </table>
    </div>
  );
};

export default StaffWorkDetails;
