import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { adminAuth } from '../services/adminApi';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/AdminLogin.css';

function LoginPage() {
  const [role, setRole] = useState('student');
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
      let response;

      if (role === 'admin') {
        // Use admin authentication
        const result = await adminAuth.login(email, password, captchaValue);
        if (result.success) {
          navigate('/admin/dashboard');
        } else {
          setError(result.error);
        }
      } else if (role === 'academic-cell') {
        response = await axios.post('http://localhost:5000/api/auth/academic-cell/login', { email, password, captchaToken: captchaValue });
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        navigate('/academic-cell-dashboard');
      } else if (role === 'faculty') {
        response = await axios.post('http://localhost:5000/api/auth/faculty/login', { email, password, captchaToken: captchaValue });
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        navigate('/faculty/dashboard');
      } else if (role === 'student') {
        response = await axios.post('http://localhost:5000/api/auth/student/login', { email, password, captchaToken: captchaValue });
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setFailedLoginAttempt(false);
        navigate('/student/dashboard');
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
        // Send OTP
        await axios.post('http://localhost:5000/api/auth/student/forgot-password', { email: forgotEmail });
        setOtpSent(true);
      } else if (otpSent && !newPassword) {
        // Verify OTP
        await axios.post('http://localhost:5000/api/auth/student/verify-otp', { email: forgotEmail, otp });
        setError('');
        setSuccess('OTP verified. Please enter new password.');
      } else if (otpSent && newPassword) {
        // Reset password
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

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">College Portal Login</h1>
          <p className="admin-login-subtitle">Access your dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        {!forgotPasswordMode && (
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
                <option value="academic-cell">Academic Cell</option>
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

        {role === 'academic-cell' && (
          <p className="signup-link">
            Academic Cell login for academic administration
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
