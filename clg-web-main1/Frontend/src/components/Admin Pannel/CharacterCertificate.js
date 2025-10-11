import React from 'react';

const CharacterCertificate = () => {
  return (
    <div className="menu-content">
      <h1>Character Certificate</h1>
      <p>Generate character certificates.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student ID:</label>
        <input type="text" />
        <label>Conduct:</label>
        <input type="text" />
        <button type="submit">Generate Certificate</button>
      </form>
    </div>
  );
};

export default CharacterCertificate;
