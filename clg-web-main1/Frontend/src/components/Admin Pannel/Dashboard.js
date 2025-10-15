import React from 'react';

const Dashboard = () => {
  return (
    <div className="menu-content">
      <h1>Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Here is a quick overview of the school management system.</p>
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
