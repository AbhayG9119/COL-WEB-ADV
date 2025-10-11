import React from 'react';

const Dashboard = () => {
  return (
    <div className="menu-content">
      <h1>Student Dashboard</h1>
      <p>Welcome to your daily snapshot! Here's an overview of your academic activities.</p>

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
