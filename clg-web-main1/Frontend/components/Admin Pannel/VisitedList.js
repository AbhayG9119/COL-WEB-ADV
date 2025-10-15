import React from 'react';

const VisitedList = () => {
  return (
    <div className="menu-content">
      <h1>Visited List</h1>
      <p>List of visited visitors.</p>
      {/* Placeholder for table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Contact</th>
            <th>Visit Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Smith</td>
            <td>Meeting</td>
            <td>123-456-7890</td>
            <td>2023-10-01</td>
          </tr>
          {/* More rows */}
        </tbody>
      </table>
    </div>
  );
};

export default VisitedList;
