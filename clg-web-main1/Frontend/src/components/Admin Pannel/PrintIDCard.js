import React from 'react';

const PrintIDCard = () => {
  return (
    <div className="menu-content">
      <h1>Print ID Card</h1>
      <p>Print ID cards for students/staff.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student/Staff ID:</label>
        <input type="text" />
        <button type="submit">Print ID Card</button>
      </form>
    </div>
  );
};

export default PrintIDCard;
