import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import './Alert.css';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    // Mock data for demonstration
    const mockAlerts = [
      { _id: '1', message: 'New assignment posted in Math class', type: 'info' },
      { _id: '2', message: 'Exam scheduled for next week', type: 'warning' }
    ];
    setAlerts(mockAlerts);
    // Uncomment below for real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
    //   const res = await axios.get('/api/alerts', config);
    //   setAlerts(res.data);
    // } catch (error) {
    //   console.error('Error fetching alerts:', error);
    // }
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert._id !== alertId));
  };

  return (
    <div className="menu-content">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="alert-icon" onClick={() => setShowAlerts(!showAlerts)}>
          🔔
          {alerts.length > 0 && <span className="alert-count">{alerts.length}</span>}
        </div>
      </div>
      <p>Welcome to your daily snapshot! Here's an overview of your academic activities.</p>

      {showAlerts && (
        <div className="alerts-panel">
          {alerts.length === 0 ? (
            <p>No new alerts.</p>
          ) : (
            alerts.map(alert => (
              <Alert
                key={alert._id}
                message={alert.message}
                type={alert.type}
                onClose={() => dismissAlert(alert._id)}
                duration={5000}
              />
            ))
          )}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Timetable</h3>
          <p>Math: 9:00 AM - 10:00 AM<br/>Science: 10:30 AM - 11:30 AM</p>
        </div>
        <div className="stat-card">
          <h3>Pending Assignments</h3>
          <p>3 assignments due this week</p>
        </div>
        <div className="stat-card">
          <h3>Notices</h3>
          <p>2 new notices from school</p>
        </div>
        <div className="stat-card">
          <h3>Attendance Summary</h3>
          <p>95% this month</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Exams</h3>
          <p>Math Exam on 15th Oct</p>
        </div>
        <div className="stat-card">
          <h3>Fee Due</h3>
          <p>₹500 pending</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
