import React from 'react';

const Registration = () => {
  return (
    <div className="menu-content">
      <h1>Registration</h1>
      <p>Register new students for admission.</p>
      {/* Placeholder for form */}
      <form>
        <label>Name:</label>
        <input type="text" />
        <label>Email:</label>
        <input type="email" />
        <label>Class:</label>
        <input type="text" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
