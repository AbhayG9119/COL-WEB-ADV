import React, { useState } from 'react';

const Settings = () => {
  const [preferences, setPreferences] = useState({
    language: 'English',
    notifications: true,
    theme: 'light'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const savePreferences = () => {
    // Save to localStorage or API
    localStorage.setItem('preferences', JSON.stringify(preferences));
    alert('Preferences saved!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="preferences">
        <h2>Preferences</h2>
        <label>
          Language:
          <select name="language" value={preferences.language} onChange={handleChange}>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </label>
        <label>
          Notifications:
          <input
            type="checkbox"
            name="notifications"
            checked={preferences.notifications}
            onChange={handleChange}
          />
        </label>
        <label>
          Theme:
          <select name="theme" value={preferences.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <button onClick={savePreferences}>Save Preferences</button>
      </div>
      <div className="logout">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Settings;
