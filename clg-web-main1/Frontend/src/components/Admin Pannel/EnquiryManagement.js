import React from 'react';

const EnquiryManagement = () => {
  return (
    <div className="menu-content">
      <h1>Enquiry Management</h1>
      <p>Handle student enquiries, follow-ups, and visitor logs.</p>
      <div className="button-group">
        <button className="btn">Add Enquiry</button>
        <button className="btn">Enquiry Detail</button>
        <button className="btn">Enquiry Follow-up</button>
        <button className="btn">Add Visitor</button>
        <button className="btn">Visited List</button>
      </div>
      <h2>Add Enquiry</h2>
      <p>Record new student enquiries.</p>
      <h2>Enquiry Detail</h2>
      <p>View full enquiry information.</p>
      <h2>Enquiry Follow-up</h2>
      <p>Update status and set reminders for follow-ups.</p>
      <h2>Add Visitor</h2>
      <p>Log visitor details.</p>
      <h2>Visited List</h2>
      <p>View list of school visitors.</p>
    </div>
  );
};

export default EnquiryManagement;
