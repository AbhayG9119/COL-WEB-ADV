import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import '../Alert.css';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    // Mock data for demonstration
    const mockAlerts = [
      { _id: '1', message: 'System maintenance scheduled for tonight', type: 'warning' },
      { _id: '2', message: 'New feature update available', type: 'info' }
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
        <h1>Dashboard</h1>
        <div className="alert-icon" onClick={() => setShowAlerts(!showAlerts)}>
          🔔
          {alerts.length > 0 && <span className="alert-count">{alerts.length}</span>}
        </div>
      </div>
      <p>Welcome to the Admin Dashboard. Here is a quick overview of the school management system.</p>

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
          <h3>Total Students</h3>
          <p>1200</p>
        </div>
        <div className="stat-card">
          <h3>Total Staff</h3>
          <p>150</p>
        </div>
        <div className="stat-card">
          <h3>Pending Fees</h3>
          <p>₹50000</p>
        </div>
        <div className="stat-card">
          <h3>Today’s Attendance</h3>
          <p>95%</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Exams</h3>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h3>Active Enquiries</h3>
          <p>25</p>
        </div>
      </div>
      <p>Use the side navigation to access different modules.</p>
    </div>
  );
};

export default Dashboard;
