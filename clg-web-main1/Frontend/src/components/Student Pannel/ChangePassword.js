import React, { useState } from 'react';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!');
      return;
    }
    // Change password logic
    alert('Password changed successfully!');
  };

  return (
    <div className="menu-content">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" name="old" placeholder="Old Password" value={passwords.old} onChange={handleChange} required />
        <input type="password" name="new" placeholder="New Password" value={passwords.new} onChange={handleChange} required />
        <input type="password" name="confirm" placeholder="Confirm New Password" value={passwords.confirm} onChange={handleChange} required />
        <button type="submit" className="btn">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
