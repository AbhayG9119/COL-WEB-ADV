import React, { useState } from 'react';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'B.A',
    year: '',
    semester: '',
    mobileNumber: '',
    designation: '',
    subject: '',
    subjectsTaught: '',
    qualifications: '',
    joiningDate: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          subjectsTaught: formData.subjectsTaught ? formData.subjectsTaught.split(',').map(s => s.trim()) : []
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User added successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'student',
          department: 'B.A',
          year: '',
          semester: '',
          mobileNumber: '',
          designation: '',
          subject: '',
          subjectsTaught: '',
          qualifications: '',
          joiningDate: '',
          phone: '',
          address: ''
        });
        // Optionally refresh the page or update state to show new user
        // window.location.reload(); // Uncomment if you want to refresh
      } else {
        setMessage(data.message || 'Failed to add user');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Add User</h1>
      <p>Register new users with roles: Admin, Faculty, Student.</p>

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

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
        </div>

        {formData.role === 'student' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label>Department:</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
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
                value={formData.year}
                onChange={handleChange}
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
                value={formData.semester}
                onChange={handleChange}
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
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </>
        )}

        {formData.role === 'faculty' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label>Designation:</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Department:</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
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
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Subjects Taught (comma-separated):</label>
              <input
                type="text"
                name="subjectsTaught"
                value={formData.subjectsTaught}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Physics"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Qualifications:</label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Joining Date:</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Address:</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Adding User...' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
