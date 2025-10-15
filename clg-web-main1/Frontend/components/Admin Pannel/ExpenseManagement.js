import React from 'react';

const ExpenseManagement = () => {
  return (
    <div className="menu-content">
      <h1>Expense Management</h1>
      <p>Track daily expenses and generate reports.</p>
      <div className="button-group">
        <button className="btn">Expense Entry</button>
        <button className="btn">Expense Reports</button>
      </div>
      <h2>Expense Entry</h2>
      <p>Add daily expenses like stationary, electricity, salary advances.</p>
      <h2>Expense Reports</h2>
      <p>Generate monthly or yearly expense reports.</p>
    </div>
  );
};

export default ExpenseManagement;
