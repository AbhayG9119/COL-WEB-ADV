import React, { useState, useEffect } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setMessage('Failed to fetch users');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || user.username || '',
      email: user.email,
      role: user.role,
      department: user.department || '',
      year: user.year || '',
      semester: user.semester || '',
      mobileNumber: user.mobileNumber || '',
      designation: user.designation || '',
      subject: user.subject || '',
      subjectsTaught: user.subjectsTaught ? user.subjectsTaught.join(', ') : '',
      qualifications: user.qualifications || '',
      joiningDate: user.joiningDate ? user.joiningDate.split('T')[0] : '',
      phone: user.phone || '',
      address: user.address || '',
      staffId: user.staffId || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${editingUser._id}/${editingUser.role}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editForm,
          subjectsTaught: editForm.subjectsTaught ? editForm.subjectsTaught.split(',').map(s => s.trim()) : []
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User updated successfully!');
        setEditingUser(null);
        fetchUsers();
      } else {
        setMessage(data.message || 'Failed to update user');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name || user.username || user.email}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/${user.role}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('User deleted successfully!');
        fetchUsers();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to delete user');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage('Please enter a new password');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/reset-password/${resetPasswordUser._id}/${resetPasswordUser.role}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        setMessage('Password reset successfully!');
        setResetPasswordUser(null);
        setNewPassword('');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="menu-content">Loading users...</div>;
  }

  return (
    <div className="menu-content">
      <h1>Manage Users</h1>
      <p>Edit, delete, or reset passwords for existing users.</p>

      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          border: '1px solid',
          borderColor: message.includes('successfully') ? '#c3e6cb' : '#f5c6cb',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Department</th>
              <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                  {user.name || user.username || user.email}
                </td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.email}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6', textTransform: 'capitalize' }}>{user.role}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{user.department || '-'}</td>
                <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setResetPasswordUser(user)}
                    style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2>Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              {/* Similar form fields as AddUser, but pre-filled */}
              <div style={{ marginBottom: '15px' }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              {/* Add other fields based on role - similar to AddUser component */}
              {editingUser.role === 'student' && (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label>Department:</label>
                    <select
                      name="department"
                      value={editForm.department}
                      onChange={handleEditFormChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      <option value="B.A">B.A</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="B.Ed">B.Ed</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Year:</label>
                    <input
                      type="number"
                      name="year"
                      value={editForm.year}
                      onChange={handleEditFormChange}
                      required
                      min="1"
                      max="3"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Semester:</label>
                    <input
                      type="number"
                      name="semester"
                      value={editForm.semester}
                      onChange={handleEditFormChange}
                      required
                      min="1"
                      max="6"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Mobile Number:</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={editForm.mobileNumber}
                      onChange={handleEditFormChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                </>
              )}

              {editingUser.role === 'faculty' && (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <label>Staff ID:</label>
                    <input
                      type="text"
                      name="staffId"
                      value={editForm.staffId}
                      onChange={handleEditFormChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Designation:</label>
                    <input
                      type="text"
                      name="designation"
                      value={editForm.designation}
                      onChange={handleEditFormChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Department:</label>
                    <select
                      name="department"
                      value={editForm.department}
                      onChange={handleEditFormChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      <option value="B.A">B.A</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="B.Ed">B.Ed</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Subject:</label>
                    <input
                      type="text"
                      name="subject"
                      value={editForm.subject}
                      onChange={handleEditFormChange}
                      required
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Subjects Taught (comma-separated):</label>
                    <input
                      type="text"
                      name="subjectsTaught"
                      value={editForm.subjectsTaught}
                      onChange={handleEditFormChange}
                      placeholder="e.g., Mathematics, Physics"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Qualifications:</label>
                    <input
                      type="text"
                      name="qualifications"
                      value={editForm.qualifications}
                      onChange={handleEditFormChange}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Joining Date:</label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={editForm.joiningDate}
                      onChange={handleEditFormChange}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditFormChange}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label>Address:</label>
                    <textarea
                      name="address"
                      value={editForm.address}
                      onChange={handleEditFormChange}
                      rows="3"
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2>Reset Password</h2>
            <p>Reset password for {resetPasswordUser.name || resetPasswordUser.username || resetPasswordUser.email}</p>

            <div style={{ marginBottom: '15px' }}>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleResetPassword}
                style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Reset Password
              </button>
              <button
                onClick={() => { setResetPasswordUser(null); setNewPassword(''); }}
                style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
