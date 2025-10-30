import React, { useState, useEffect } from 'react';
import './Settings.css'; // Assuming we create a CSS file for styling

const Settings = () => {
  // State for preferences
  const [preferences, setPreferences] = useState({
    language: 'English',
    smsAlerts: true,
    emailAlerts: true,
    theme: 'light'
  });

  // State for change password
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State for visibility toggles
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // State for messages
  const [messages, setMessages] = useState({
    password: { type: '', text: '' },
    notifications: { type: '', text: '' },
    language: { type: '', text: '' }
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  // Handle preference changes
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Validate and save password
  const savePassword = () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessages(prev => ({ ...prev, password: { type: 'error', text: 'All fields are required' } }));
      return;
    }
    if (newPassword === oldPassword) {
      setMessages(prev => ({ ...prev, password: { type: 'error', text: 'New password must be different from old password' } }));
      return;
    }
    if (newPassword.length < 8) {
      setMessages(prev => ({ ...prev, password: { type: 'error', text: 'New password must be at least 8 characters long' } }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessages(prev => ({ ...prev, password: { type: 'error', text: 'New passwords do not match' } }));
      return;
    }

    // Mock API call
    setMessages(prev => ({ ...prev, password: { type: 'success', text: 'Updating password...' } }));
    setTimeout(() => {
      // Simulate API success
      setMessages(prev => ({ ...prev, password: { type: 'success', text: 'Password updated successfully!' } }));
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessages(prev => ({ ...prev, password: { type: '', text: '' } })), 3000);
    }, 1000);
  };

  // Save notification preferences
  const saveNotifications = () => {
    if (!preferences.smsAlerts && !preferences.emailAlerts) {
      setMessages(prev => ({ ...prev, notifications: { type: 'error', text: 'At least one notification method must be selected' } }));
      return;
    }

    // Mock API call
    setMessages(prev => ({ ...prev, notifications: { type: 'success', text: 'Saving preferences...' } }));
    setTimeout(() => {
      localStorage.setItem('preferences', JSON.stringify(preferences));
      setMessages(prev => ({ ...prev, notifications: { type: 'success', text: 'Preferences saved!' } }));
      setTimeout(() => setMessages(prev => ({ ...prev, notifications: { type: '', text: '' } })), 3000);
    }, 1000);
  };

  // Apply language selection
  const applyLanguage = () => {
    // Mock API call
    setMessages(prev => ({ ...prev, language: { type: 'success', text: 'Applying language...' } }));
    setTimeout(() => {
      localStorage.setItem('preferences', JSON.stringify(preferences));
      setMessages(prev => ({ ...prev, language: { type: 'success', text: 'Language updated!' } }));
      // Reload UI if needed (for demo, just update state)
      setTimeout(() => setMessages(prev => ({ ...prev, language: { type: '', text: '' } })), 3000);
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      {/* Change Password Section */}
      <div className="section">
        <h2>Change Password</h2>
        <div className="form-panel">
          <div className="input-field">
            <label>Old Password</label>
            <div className="password-input">
              <input
                type={showPasswords.old ? 'text' : 'password'}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter old password"
              />
              <button type="button" onClick={() => togglePasswordVisibility('old')}>
                {showPasswords.old ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className="input-field">
            <label>New Password</label>
            <div className="password-input">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
              <button type="button" onClick={() => togglePasswordVisibility('new')}>
                {showPasswords.new ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordData.newPassword && (
              <div className="strength-meter">
                <div className={`strength strength-${getPasswordStrength(passwordData.newPassword)}`}></div>
              </div>
            )}
          </div>
          <div className="input-field">
            <label>Confirm New Password</label>
            <div className="password-input">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
              <button type="button" onClick={() => togglePasswordVisibility('confirm')}>
                {showPasswords.confirm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button onClick={savePassword}>Save Password</button>
        </div>
        {messages.password.text && (
          <div className={`message-box ${messages.password.type}`}>
            {messages.password.text}
          </div>
        )}
      </div>

      {/* Notification Preferences Section */}
      <div className="section">
        <h2>Notification Preferences</h2>
        <div className="toggle-panel">
          <label>
            <input
              type="checkbox"
              name="smsAlerts"
              checked={preferences.smsAlerts}
              onChange={handlePreferenceChange}
            />
            Receive SMS Alerts
          </label>
          <label>
            <input
              type="checkbox"
              name="emailAlerts"
              checked={preferences.emailAlerts}
              onChange={handlePreferenceChange}
            />
            Receive Email Alerts
          </label>
          <button onClick={saveNotifications}>Save Preferences</button>
        </div>
        {messages.notifications.text && (
          <div className={`message-box ${messages.notifications.type}`}>
            {messages.notifications.text}
          </div>
        )}
      </div>

      {/* Language Selection Section */}
      <div className="section">
        <h2>Language Settings</h2>
        <div className="language-panel">
          <label>
            Select Language:
            <select name="language" value={preferences.language} onChange={handlePreferenceChange}>
              <option value="English">English</option>
            </select>
          </label>
          <button onClick={applyLanguage}>Apply Language</button>
        </div>
        {messages.language.text && (
          <div className={`message-box ${messages.language.type}`}>
            {messages.language.text}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="logout">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Settings;
