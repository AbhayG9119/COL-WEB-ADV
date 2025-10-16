import React from 'react';

const FeeSummaryTable = ({ fees, highlightUnpaid = true }) => {
  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + fee.paid, 0);
  const totalBalance = totalAmount - totalPaid;

  return (
    <div className="fee-summary">
      <h3>Fee Summary</h3>
      <table className="fee-table">
        <thead>
          <tr>
            <th>Fee Head</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => (
            <tr
              key={index}
              className={highlightUnpaid && fee.balance > 0 ? 'unpaid-row' : ''}
            >
              <td>{fee.head}</td>
              <td>₹{fee.amount.toLocaleString()}</td>
              <td>₹{fee.paid.toLocaleString()}</td>
              <td>₹{fee.balance.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="total-row">
            <td><strong>Total</strong></td>
            <td><strong>₹{totalAmount.toLocaleString()}</strong></td>
            <td><strong>₹{totalPaid.toLocaleString()}</strong></td>
            <td><strong>₹{totalBalance.toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default FeeSummaryTable;
