import React from 'react';

const AddEnquiry = () => {
  return (
    <div className="menu-content">
      <h1>Add Enquiry</h1>
      <p>Add new enquiries.</p>
      {/* Placeholder for form */}
      <form>
        <label>Name:</label>
        <input type="text" />
        <label>Email:</label>
        <input type="email" />
        <label>Message:</label>
        <textarea></textarea>
        <button type="submit">Add Enquiry</button>
      </form>
    </div>
  );
};

export default AddEnquiry;
