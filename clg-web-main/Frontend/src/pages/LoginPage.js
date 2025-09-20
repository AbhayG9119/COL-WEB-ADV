import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { adminAuth } from '../services/adminApi';
import '../styles/AdminLogin.css';

function LoginPage() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;

      if (role === 'admin') {
        // Use admin authentication
        const result = await adminAuth.login(email, password);
        if (result.success) {
          navigate('/admin/dashboard');
        } else {
          setError(result.error);
        }
      } else if (role === 'faculty') {
        response = await axios.post('http://localhost:5000/api/auth/faculty/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        navigate('/faculty/dashboard');
      } else if (role === 'student') {
        response = await axios.post('http://localhost:5000/api/auth/student/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">College Portal Login</h1>
          <p className="admin-login-subtitle">Access your dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="role" className="form-label">I AM A:</label>
            <select
              id="role"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-button"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        {role === 'admin' && (
          <p className="signup-link">
            Admin login requires admin credentials
          </p>
        )}

        {(role === 'student' || role === 'faculty') && (
          <p className="signup-link">
            Don't have an account?{' '}
            {role === 'student' ? (
              <a href="/signup">Sign up as Student</a>
            ) : (
              <span>Please contact admin for Faculty account</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
