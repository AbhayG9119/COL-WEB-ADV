import React, { useState } from 'react';
import './Attendance.css'; // Assuming we create a new CSS file for styles

const Attendance = () => {
  const [summary] = useState({
    totalDays: 120,
    presentDays: 102,
    absentDays: 18,
    percentage: 85
  });

  const [subjectAttendance] = useState([
    {
      subject_id: "PHY101",
      subject_name: "Mechanics",
      total_classes: 40,
      attended: 34,
      missed: 6,
      percentage: 85,
      status: "Eligible"
    },
    {
      subject_id: "CHE102",
      subject_name: "Organic Chemistry",
      total_classes: 35,
      attended: 28,
      missed: 7,
      percentage: 80,
      status: "Eligible"
    },
    {
      subject_id: "MAT103",
      subject_name: "Calculus",
      total_classes: 45,
      attended: 30,
      missed: 15,
      percentage: 67,
      status: "At Risk"
    }
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedSubjectAttendance = React.useMemo(() => {
    let sortableItems = [...subjectAttendance];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [subjectAttendance, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [showDailyPanel, setShowDailyPanel] = useState(false);

  const getStatusColor = (percentage) => {
    if (percentage > 85) return 'good';
    if (percentage >= 75) return 'warning';
    return 'critical';
  };

  const getStatusBadge = (percentage) => {
    if (percentage > 85) return 'Good';
    if (percentage >= 75) return 'Warning';
    return 'Critical';
  };

  const handleViewDailyLogs = (subject) => {
    setSelectedSubject(subject);
    // Sample daily logs for the subject
    setDailyLogs([
      { date: '2023-10-01', time_slot: '10:00–11:00', faculty: 'Dr. A. Sharma', status: 'Present' },
      { date: '2023-10-02', time_slot: '11:00–12:00', faculty: 'Dr. A. Sharma', status: 'Absent' },
      { date: '2023-10-03', time_slot: '10:00–11:00', faculty: 'Dr. A. Sharma', status: 'Present' }
    ]);
    setShowDailyPanel(true);
  };

  const closeDailyPanel = () => {
    setShowDailyPanel(false);
    setSelectedSubject(null);
  };

  return (
    <div className="menu-content">
      <h1>Attendance</h1>

      {/* Attendance Summary Card */}
      <div className="attendance-summary-card">
        <h2>Overall Attendance Summary</h2>
        <div className="summary-stats">
          <div className="stat">
            <label>Total Working Days</label>
            <span>{summary.totalDays}</span>
          </div>
          <div className="stat">
            <label>Days Present</label>
            <span>{summary.presentDays}</span>
          </div>
          <div className="stat">
            <label>Days Absent</label>
            <span>{summary.absentDays}</span>
          </div>
          <div className="stat">
            <label>Attendance %</label>
            <span>{summary.percentage}%</span>
          </div>
        </div>
        <div className="status-section">
          <div className={`status-badge ${getStatusColor(summary.percentage)}`}>
            {getStatusBadge(summary.percentage)}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${summary.percentage}%` }}></div>
          </div>
        </div>
        <div className="tooltip">Minimum 75% required for exam eligibility</div>
      </div>

      {/* Subject Attendance Table */}
      <div className="subject-attendance-table">
        <h2>Subject-wise Attendance</h2>
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('subject_name')} style={{ cursor: 'pointer' }}>
                Subject Name {sortConfig.key === 'subject_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('total_classes')} style={{ cursor: 'pointer' }}>
                Total Classes {sortConfig.key === 'total_classes' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('attended')} style={{ cursor: 'pointer' }}>
                Classes Attended {sortConfig.key === 'attended' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('missed')} style={{ cursor: 'pointer' }}>
                Classes Missed {sortConfig.key === 'missed' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => requestSort('percentage')} style={{ cursor: 'pointer' }}>
                Attendance % {sortConfig.key === 'percentage' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubjectAttendance.map((subject) => (
              <tr key={subject.subject_id} className={getStatusColor(subject.percentage)}>
                <td>{subject.subject_name}</td>
                <td>{subject.total_classes}</td>
                <td>{subject.attended}</td>
                <td>{subject.missed}</td>
                <td>{subject.percentage}%</td>
                <td>{subject.status}</td>
                <td>
                  <button onClick={() => handleViewDailyLogs(subject)}>View Daily Logs</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Attendance Panel (Modal) */}
      {showDailyPanel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Daily Attendance Logs - {selectedSubject?.subject_name}</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Faculty Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dailyLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.date}</td>
                    <td>{log.time_slot}</td>
                    <td>{log.faculty}</td>
                    <td>{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeDailyPanel}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
