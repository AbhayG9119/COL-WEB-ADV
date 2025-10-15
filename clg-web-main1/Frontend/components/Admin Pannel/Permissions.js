import React from 'react';

const Permissions = () => {
  return (
    <div className="menu-content">
      <h1>Permissions</h1>
      <p>Assign permissions to roles for module access.</p>
      <div className="button-group">
        <button className="btn">Assign Permissions</button>
      </div>
      <p>Define which roles can access specific modules, e.g., Teachers can access Attendance and Assignments.</p>
    </div>
  );
};

export default Permissions;
