import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming Axios is installed; for API calls

const Dashboard = () => {
  const [assignedClasses, setAssignedClasses] = useState(0);
  const [todayTimetable, setTodayTimetable] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming JWT token stored
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch assigned classes count
        const classesRes = await axios.get('/api/staff/assigned-classes', config);
        setAssignedClasses(classesRes.data.length || 0);

        // Fetch today's timetable (assume today is Monday for demo; use Date in prod)
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const timetableRes = await axios.get(`/api/staff/timetable?day=${today}`, config);
        setTodayTimetable(timetableRes.data);

        // Fetch pending assignments count (due today or soon)
        const assignmentsRes = await axios.get('/api/staff/work/assignments', config);
        const pending = assignmentsRes.data.filter(a => new Date(a.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length; // Within 7 days
        setPendingAssignments(pending);

        // Fetch unread messages count
        const messagesRes = await axios.get('/api/staff/messages/inbox', config);
        const unread = messagesRes.data.filter(m => !m.isRead).length;
        setUnreadMessages(unread);

        // Fetch monthly attendance summary (current month)
        const month = new Date().toISOString().slice(0, 7); // YYYY-MM
        const attendanceRes = await axios.get(`/api/staff/attendance/monthly?month=${month}`, config);
        if (attendanceRes.data.summary && attendanceRes.data.summary.length > 0) {
          const totalPresent = attendanceRes.data.summary.reduce((sum, s) => sum + s.present, 0);
          const totalDays = attendanceRes.data.summary[0].total; // Assuming uniform
          setAttendanceSummary({ present: totalPresent, total: totalDays * attendanceRes.data.summary.length });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="staff-dashboard">
      <h1>Staff Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Assigned Classes</h3>
          <p>{assignedClasses}</p>
        </div>
        <div className="card">
          <h3>Today's Timetable</h3>
          <ul>
            {todayTimetable.map((slot, idx) => (
              <li key={idx}>{slot.period}: {slot.class} - {slot.subject} ({slot.time})</li>
            ))}
            {todayTimetable.length === 0 && <li>No classes today</li>}
          </ul>
        </div>
        <div className="card">
          <h3>Pending Assignments</h3>
          <p>{pendingAssignments}</p>
        </div>
        <div className="card">
          <h3>Unread Messages</h3>
          <p>{unreadMessages}</p>
        </div>
        <div className="card">
          <h3>Attendance Summary (This Month)</h3>
          <p>Present: {attendanceSummary.present} / Total: {attendanceSummary.total}</p>
          <p>Percentage: {attendanceSummary.total > 0 ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100) : 0}%</p>
        </div>
      </div>
      <div className="recent-notices">
        <h3>Recent Notices</h3>
        {/* Placeholder; fetch from /api/circulars in full impl */}
        <p>No recent notices available.</p>
      </div>
    </div>
  );
};

export default Dashboard;
