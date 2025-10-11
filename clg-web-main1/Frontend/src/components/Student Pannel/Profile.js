import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    class: '10th',
    rollNo: '123',
    section: 'A',
    phone: '1234567890',
    email: 'john@example.com',
    address: '123 Main St'
  });

  const handleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div className="menu-content">
      <h1>Student Profile</h1>
      <div>
        <h2>View Profile</h2>
        <p><strong>Name:</strong> {isEditing ? <input name="name" value={profile.name} onChange={handleChange} /> : profile.name}</p>
        <p><strong>Class:</strong> {profile.class}</p>
        <p><strong>Roll No:</strong> {profile.rollNo}</p>
        <p><strong>Section:</strong> {profile.section}</p>
        <p><strong>Phone:</strong> {isEditing ? <input name="phone" value={profile.phone} onChange={handleChange} /> : profile.phone}</p>
        <p><strong>Email:</strong> {isEditing ? <input name="email" value={profile.email} onChange={handleChange} /> : profile.email}</p>
        <p><strong>Address:</strong> {isEditing ? <input name="address" value={profile.address} onChange={handleChange} /> : profile.address}</p>
        <button className="btn" onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
