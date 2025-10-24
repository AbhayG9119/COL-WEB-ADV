import React from 'react';
import './Cards.css';

const Cards = ({ role = 'Admin' }) => { // Mock role prop
  const access = {
    Admin: { idCard: true, admitGen: true, admitPrint: true, centerAssign: true },
    Staff: { idCard: false, admitGen: false, admitPrint: true, centerAssign: false },
    Student: { idCard: false, admitGen: false, admitPrint: true, centerAssign: false },
  };

  return (
    <div className="menu-content">
      <h1>ID & Admit Cards</h1>
      <p>Generate and print student ID and admit cards.</p>
      <div className="button-group">
        {access[role].idCard && <button className="btn">Print ID Card</button>}
        {access[role].admitGen && <button className="btn">Generate Admit Card</button>}
        {access[role].admitPrint && <button className="btn">Print Admit Card</button>}
        {access[role].centerAssign && <button className="btn">Examination Center</button>}
      </div>
      {access[role].idCard && (
        <>
          <h2>Print ID Card</h2>
          <p>Print student ID cards.</p>
        </>
      )}
      {access[role].admitGen && (
        <>
          <h2>Generate Admit Card</h2>
          <p>Create admit cards for exams.</p>
        </>
      )}
      {access[role].admitPrint && (
        <>
          <h2>Print Admit Card</h2>
          <p>Print generated admit cards.</p>
        </>
      )}
      {access[role].centerAssign && (
        <>
          <h2>Examination Center</h2>
          <p>Assign exam centers.</p>
        </>
      )}
    </div>
  );
};

export default Cards;
