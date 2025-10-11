import React from 'react';

const GenerateDiscount = () => {
  return (
    <div className="menu-content">
      <h1>Generate Discount</h1>
      <p>Apply scholarships or sibling discounts.</p>
      {/* Placeholder for form */}
      <form>
        <label>Student ID:</label>
        <input type="text" />
        <label>Discount Type:</label>
        <select>
          <option>Scholarship</option>
          <option>Sibling</option>
        </select>
        <label>Amount:</label>
        <input type="number" />
        <button type="submit">Apply Discount</button>
      </form>
    </div>
  );
};

export default GenerateDiscount;
