import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceReport = () => {
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/staff/assigned-classes', config);
      setClasses(res.data.map(c => c.class));
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let url = `/api/staff/attendance/${reportType}`;
      if (reportType === 'daily') {
        url += `?date=${date}&class=${selectedClass}`;
      } else {
        url += `?month=${month}&class=${selectedClass}`;
      }
      const res = await axios.get(url, config);
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
    setLoading(false);
  };

  const exportCSV = () => {
    // Simple CSV export
    const headers = ['Student', 'Status', 'Date'];
    const csv = [headers.join(','), ...report.map(r => `${r.studentName},${r.status},${r.date}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${reportType}.csv`;
    a.click();
  };

  return (
    <div className="attendance-report">
      <h1>Attendance Report</h1>
      <div className="filters">
        <label>Report Type:</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
        {reportType === 'daily' ? (
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        ) : (
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        )}
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
        </select>
        <button onClick={fetchReport} disabled={loading}>Generate Report</button>
        {report.length > 0 && <button onClick={exportCSV}>Export CSV</button>}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : report.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {report.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.studentName}</td>
                <td>{entry.status}</td>
                <td>{entry.date}</td>
                <td>{entry.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No report data available.</p>
      )}
    </div>
  );
};

export default AttendanceReport;
