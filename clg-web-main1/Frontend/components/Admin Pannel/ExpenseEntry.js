import React from 'react';

const ExpenseEntry = () => {
  return (
    <div className="menu-content">
      <h1>Expense Entry</h1>
      <p>Enter new expenses.</p>
      {/* Placeholder for form */}
      <form>
        <label>Description:</label>
        <input type="text" />
        <label>Amount:</label>
        <input type="number" />
        <label>Date:</label>
        <input type="date" />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseEntry;
