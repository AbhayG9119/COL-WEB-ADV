import React from 'react';

const PrintAdmitCard = () => {
  return (
    <div className="menu-content">
      <h1>Print Admit Card</h1>
      <p>Print admit cards for exams.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student ID:</label>
        <input type="text" />
        <button type="submit">Print Admit Card</button>
      </form>
    </div>
  );
};

export default PrintAdmitCard;
