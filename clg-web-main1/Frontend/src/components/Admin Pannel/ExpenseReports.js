import React from 'react';

const ExpenseReports = () => {
  return (
    <div className="menu-content">
      <h1>Expense Reports</h1>
      <p>View expense reports.</p>
      {/* Placeholder for table */}
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Office Supplies</td>
            <td>$100</td>
            <td>2023-10-01</td>
          </tr>
          {/* More rows */}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseReports;
