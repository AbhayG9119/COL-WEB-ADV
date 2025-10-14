import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../services/adminApi';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/AdminLogin.css';

import adminImage from '../images/admin.jpg';
import staffImage from '../images/staff.jpg';
import studentImage from '../images/student.jpg';

function LoginPage() {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [failedLoginAttempt, setFailedLoginAttempt] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await auth.login(email, password, captchaValue, role);
      if (result.success) {
        const userRole = result.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'faculty') {
          navigate('/faculty/dashboard');
        } else if (userRole === 'student') {
          setFailedLoginAttempt(false);
          navigate('/student/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setCaptchaValue(null);
      if (role === 'student') {
        setFailedLoginAttempt(true);
        setForgotEmail(email);
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setError('');
    setLoading(true);
    try {
      if (!otpSent) {
        await axios.post('http://localhost:5000/api/auth/student/forgot-password', { email: forgotEmail });
        setOtpSent(true);
      } else if (otpSent && !newPassword) {
        await axios.post('http://localhost:5000/api/auth/student/verify-otp', { email: forgotEmail, otp });
        setError('');
        setSuccess('OTP verified. Please enter new password.');
      } else if (otpSent && newPassword) {
        await axios.post('http://localhost:5000/api/auth/student/reset-password', { email: forgotEmail, otp, newPassword });
        setError('');
        setSuccess('Password reset successful. Please login with new password.');
        setForgotPasswordMode(false);
        setOtpSent(false);
        setOtp('');
        setNewPassword('');
        setForgotEmail('');
        setFailedLoginAttempt(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error in forgot password process');
      setSuccess('');
    }
    setLoading(false);
  };

  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    setSuccess('');
    setForgotPasswordMode(false);
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
    setForgotEmail('');
    setFailedLoginAttempt(false);
    setEmail('');
    setPassword('');
    setCaptchaValue(null);
  };

  const getTitle = () => {
    switch (role) {
      case 'admin':
        return 'Admin Login';
      case 'faculty':
        return 'Staff Login';
      case 'student':
        return 'Student Login';
      default:
        return 'College Portal Login';
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case 'admin':
        return 'Secure access to administration panel';
      case 'faculty':
        return 'Access your staff dashboard';
      case 'student':
        return 'Access your student dashboard';
      default:
        return 'Access your dashboard';
    }
  };

  return (
    <div className="admin-login-container">
      <div className={`admin-login-card ${role === '' ? 'full-screen' : ''}`}>
        <div className="admin-login-header">
          <h1 className="admin-login-title">{getTitle()}</h1>
          <p className="admin-login-subtitle">{getSubtitle()}</p>
        </div>

        {role === '' && (
          <div className="login-selection">
            <div className="login-option" onClick={() => handleRoleClick('admin')}>
              <img src={adminImage} alt="Admin Login" className="login-image" />
              <button className="login-button">Admin Login</button>
            </div>
            <div className="login-option" onClick={() => handleRoleClick('faculty')}>
              <img src={staffImage} alt="Staff Login" className="login-image" />
              <button className="login-button">Staff Login</button>
            </div>
            <div className="login-option" onClick={() => handleRoleClick('student')}>
              <img src={studentImage} alt="Student Login" className="login-image" />
              <button className="login-button">Student Login</button>
            </div>
          </div>
        )}

        {role !== '' && !forgotPasswordMode && (
          <form onSubmit={handleSubmit} className="admin-login-form">
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
              {loading ? 'Authenticating...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => setForgotPasswordMode(true)}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>

            <button
              type="button"
              onClick={() => handleRoleClick('')}
              className="cancel-button"
            >
              Back to Login Selection
            </button>
          </form>
        )}

        {forgotPasswordMode && role === 'student' && (
          <div className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="forgotEmail" className="form-label">Registered Email Address</label>
              <input
                type="email"
                id="forgotEmail"
                className="form-input"
                placeholder="Enter your registered email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={otpSent || failedLoginAttempt}
              />
            </div>

            {otpSent && (
              <>
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    className="form-input"
                    placeholder="Enter the OTP sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-input"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="admin-login-button"
            >
              {loading ? 'Processing...' : otpSent ? (newPassword ? 'Reset Password' : 'Verify OTP') : 'Send OTP'}
            </button>

            <button
              onClick={() => {
                setForgotPasswordMode(false);
                setOtpSent(false);
                setOtp('');
                setNewPassword('');
                setForgotEmail('');
                setError('');
                setSuccess('');
                setFailedLoginAttempt(false);
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        )}

        {!forgotPasswordMode && role === 'student' && failedLoginAttempt && (
          <p className="forgot-password-link" onClick={() => setForgotPasswordMode(true)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
            Forgot Password?
          </p>
        )}

        {role === 'admin' && (
          <p className="signup-link">
            Admin login requires admin credentials
          </p>
        )}

        {(role === 'student' || role === 'faculty') && (
          <p className="signup-link">
            Don't have an account?{' '}
            {role === 'faculty' ? (
              <span>Please contact admin for Faculty account</span>
            ) : (
              <span>Please contact admin for Student account</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
