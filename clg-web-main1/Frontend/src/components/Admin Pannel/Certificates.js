import React from 'react';

const Certificates = () => {
  return (
    <div className="menu-content">
      <h1>Certificates</h1>
      <p>Generate student certificates.</p>
      <div className="button-group">
        <button className="btn">Transfer Certificate</button>
        <button className="btn">Character Certificate</button>
      </div>
      <h2>Transfer Certificate</h2>
      <p>Generate TC for students.</p>
      <h2>Character Certificate</h2>
      <p>Generate character certificates.</p>
    </div>
  );
};

export default Certificates;
