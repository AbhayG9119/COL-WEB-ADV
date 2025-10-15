import React from 'react';

const Cards = () => {
  return (
    <div className="menu-content">
      <h1>ID & Admit Cards</h1>
      <p>Generate and print student ID and admit cards.</p>
      <div className="button-group">
        <button className="btn">Print ID Card</button>
        <button className="btn">Generate Admit Card</button>
        <button className="btn">Print Admit Card</button>
        <button className="btn">Examination Center</button>
      </div>
      <h2>Print ID Card</h2>
      <p>Print student ID cards.</p>
      <h2>Generate Admit Card</h2>
      <p>Create admit cards for exams.</p>
      <h2>Print Admit Card</h2>
      <p>Print generated admit cards.</p>
      <h2>Examination Center</h2>
      <p>Assign exam centers.</p>
    </div>
  );
};

export default Cards;
