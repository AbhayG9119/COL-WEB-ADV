import React from 'react';

const ViewFeeLedger = () => {
  const fees = [
    { id: 1, month: 'September', amount: 1000, status: 'Paid', dueDate: '2023-09-30' },
    { id: 2, month: 'October', amount: 1000, status: 'Pending', dueDate: '2023-10-30' }
  ];

  return (
    <div className="menu-content">
      <h1>View Fee Ledger</h1>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {fees.map(fee => (
            <tr key={fee.id}>
              <td>{fee.month}</td>
              <td>{fee.amount}</td>
              <td>{fee.status}</td>
              <td>{fee.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFeeLedger;
