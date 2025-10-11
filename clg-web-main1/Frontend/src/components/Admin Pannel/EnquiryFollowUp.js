import React from 'react';

const EnquiryFollowUp = () => {
  return (
    <div className="menu-content">
      <h1>Enquiry Follow-up</h1>
      <p>Follow up on enquiries.</p>
      {/* Placeholder for form */}
      <form>
        <label>Enquiry ID:</label>
        <input type="text" />
        <label>Follow-up Notes:</label>
        <textarea></textarea>
        <button type="submit">Add Follow-up</button>
      </form>
    </div>
  );
};

export default EnquiryFollowUp;
