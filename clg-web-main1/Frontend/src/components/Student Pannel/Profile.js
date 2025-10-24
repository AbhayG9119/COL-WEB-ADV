import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    department: '',
    year: '',
    semester: '',
    mobileNumber: '',
    email: '',
    profilePhoto: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setSaving(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/student/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profile.name,
          mobileNumber: profile.mobileNumber
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.student);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="menu-content">
        <h1>Student Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="menu-content">
      <h1>Student Profile</h1>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
      <div>
        <h2>View Profile</h2>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {profile.profilePhoto ? (
            <img
              src={`http://localhost:5000/uploads/profile-pictures/${profile.profilePhoto}`}
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
              display: profile.profilePhoto ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #ccc',
              margin: '0 auto'
            }}
          >
            <span style={{ fontSize: '48px', color: '#666' }}>👤</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <a href="/student/upload-photo" style={{ color: '#007bff', textDecoration: 'none' }}>
              {profile.profilePhoto ? 'Change Photo' : 'Upload Photo'}
            </a>
          </div>
        </div>
        <p><strong>Name:</strong> {isEditing ? <input name="name" value={profile.name || ''} onChange={handleChange} /> : profile.name}</p>
        <p><strong>Department:</strong> {profile.department}</p>
        <p><strong>Year:</strong> {profile.year}</p>
        <p><strong>Semester:</strong> {profile.semester}</p>
        <p><strong>Phone:</strong> {isEditing ? <input name="mobileNumber" value={profile.mobileNumber || ''} onChange={handleChange} /> : profile.mobileNumber}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <button className="btn" onClick={isEditing ? handleSave : handleEdit} disabled={saving}>
          {saving ? 'Saving...' : (isEditing ? 'Save' : 'Edit Profile')}
        </button>
      </div>
    </div>
  );
};

export default Profile;
