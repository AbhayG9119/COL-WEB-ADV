import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    designation: '',
    department: '',
    qualifications: '',
    joiningDate: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: null
  });

  // Helper function to format date for input
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/staff/profile', config);
      console.log('Profile data received:', res.data);
      console.log('Profile picture field:', res.data.profilePicture);
      setProfile(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:5000/api/staff/profile', profile, config);
      setEditing(false);
      // Refetch profile to ensure we have latest data
      await fetchProfile();
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="staff-profile">
      <h1>Staff Profile</h1>
      {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Profile Picture Display */}
      <div className="profile-picture-section" style={{ marginBottom: '20px', textAlign: 'center' }}>
        {profile.profilePicture ? (
          <img
            src={`http://localhost:5000/uploads/profile-pictures/${profile.profilePicture}`}
            alt="Profile"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #007bff'
            }}
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              // Hide broken image and show fallback
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            display: profile.profilePicture ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #ccc',
            margin: '0 auto'
          }}
        >
          <span style={{ fontSize: '48px', color: '#666' }}>👤</span>
        </div>
        <div style={{ marginTop: '10px' }}>
          <a href="/staff/upload-photo" style={{ color: '#007bff', textDecoration: 'none' }}>
            {profile.profilePicture ? 'Change Photo' : 'Upload Photo'}
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} disabled={!editing} required />
        </div>
        <div className="form-group">
          <label>Designation:</label>
          <input type="text" name="designation" value={profile.designation} onChange={handleChange} disabled={!editing} required />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input type="text" name="department" value={profile.department} onChange={handleChange} disabled={!editing} required />
        </div>
        <div className="form-group">
          <label>Qualifications:</label>
          <textarea name="qualifications" value={profile.qualifications} onChange={handleChange} disabled={!editing} />
        </div>
        <div className="form-group">
          <label>Joining Date:</label>
          <input type="date" name="joiningDate" value={formatDateForInput(profile.joiningDate)} onChange={handleChange} disabled={!editing} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} disabled={!editing} required />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="tel" name="phone" value={profile.phone} onChange={handleChange} disabled={!editing} />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea name="address" value={profile.address} onChange={handleChange} disabled={!editing} />
        </div>
        <button type="button" onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
        {editing && <button type="submit">Save Changes</button>}
      </form>
      <div className="profile-actions">
        <a href="/staff/upload-photo">Upload Photo</a>
        {/* Link to contact info update if separate */}
      </div>
    </div>
  );
};

export default Profile;
