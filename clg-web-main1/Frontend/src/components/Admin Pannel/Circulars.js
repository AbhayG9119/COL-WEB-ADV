import React from 'react';

const Circulars = () => {
  return (
    <div className="menu-content">
      <h1>Circulars / Notice</h1>
      <p>Create and manage notices for students and staff.</p>
      <div className="button-group">
        <button className="btn">Create Notice</button>
        <button className="btn">View Notices</button>
      </div>
      <h2>Create Notice</h2>
      <p>Add new notices like exam dates, holidays, meetings.</p>
      <h2>View Notices</h2>
      <p>Manage existing notices.</p>
    </div>
  );
};

export default Circulars;
