import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/AdminLogin.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setYear('');
    setSemester('');
  };

  const getYearOptions = () => {
    if (department === 'B.A' || department === 'B.Sc') {
      return [1, 2, 3];
    } else if (department === 'B.Ed') {
      return [1, 2];
    }
    return [];
  };

  const getSemesterOptions = () => {
    if (department === 'B.A' || department === 'B.Sc') {
      return [1, 2, 3, 4, 5, 6];
    } else if (department === 'B.Ed') {
      return [1, 2, 3, 4];
    }
    return [];
  };
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/student/signup', {
        username,
        email,
        department,
        year,
        semester,
        mobileNumber,
        password,
        captchaToken: captchaValue,
      });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      setCaptchaValue(null);
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Student Signup</h1>
          <p className="admin-login-subtitle">Create your student account</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
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
            />
          </div>



          <div className="form-group">
            <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              className="form-input"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department" className="form-label">Department</label>
            <select
              id="department"
              className="form-input"
              value={department}
              onChange={handleDepartmentChange}
              required
            >
              <option value="">Select Department</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.A">B.A</option>
              <option value="B.Ed">B.Ed</option>
            </select>
          </div>

          {department && (
            <>
              <div className="form-group">
                <label htmlFor="year" className="form-label">Year</label>
                <select
                  id="year"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  required
                >
                  <option value="">Select Year</option>
                  {getYearOptions().map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="semester" className="form-label">Semester</label>
                <select
                  id="semester"
                  className="form-input"
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  required
                >
                  <option value="">Select Semester</option>
                  {getSemesterOptions().map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </>
          )}

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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <ReCAPTCHA
              sitekey="6LcLptQrAAAAAHdtlrO3jVvYFwFUE_ixdSKWkzaP"
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !captchaValue}
            className="admin-login-button"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
