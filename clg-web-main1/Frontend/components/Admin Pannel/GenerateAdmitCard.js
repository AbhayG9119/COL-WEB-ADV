import React from 'react';

const GenerateAdmitCard = () => {
  return (
    <div className="menu-content">
      <h1>Generate Admit Card</h1>
      <p>Generate admit cards for exams.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student ID:</label>
        <input type="text" />
        <label>Exam:</label>
        <input type="text" />
        <button type="submit">Generate Admit Card</button>
      </form>
    </div>
  );
};

export default GenerateAdmitCard;
