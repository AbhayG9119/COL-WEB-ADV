import React from 'react';

const AddVisitor = () => {
  return (
    <div className="menu-content">
      <h1>Add Visitor</h1>
      <p>Add new visitors.</p>
      {/* Placeholder for form */}
      <form>
        <label>Name:</label>
        <input type="text" />
        <label>Purpose:</label>
        <input type="text" />
        <label>Contact:</label>
        <input type="text" />
        <button type="submit">Add Visitor</button>
      </form>
    </div>
  );
};

export default AddVisitor;
