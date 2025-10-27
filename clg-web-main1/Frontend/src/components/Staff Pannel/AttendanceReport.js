import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './AttendanceReport.css';

const AttendanceReport = () => {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    leave: 0,
    percentage: 0,
  });
  const [filters, setFilters] = useState({
    course: '',
    semester: '',
    dateFrom: '',
    dateTo: '',
    student: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table'); // table or chart

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch semesters when course changes
  useEffect(() => {
    if (filters.course) {
      fetchSemesters(filters.course);
    } else {
      setSemesters([]);
    }
  }, [filters.course]);

  // Fetch attendance when filters change
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          course: filters.course,
          semester: filters.semester,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          student: filters.student,
        });
        const response = await axios.get(`/api/attendance?${params}`);
        setAttendanceData(response.data.records);
        setSummary(response.data.summary);
      } catch (err) {
        setError('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    if (filters.course && filters.semester && filters.dateFrom && filters.dateTo) {
      fetchAttendance();
    } else {
      setAttendanceData([]);
      setSummary({ totalDays: 0, present: 0, absent: 0, leave: 0, percentage: 0 });
    }
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const fetchSemesters = async (course) => {
    try {
      const response = await axios.get(`/api/semesters?course=${course}`);
      setSemesters(response.data);
    } catch (err) {
      setError('Failed to fetch semesters');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 20, 10);
    doc.autoTable({
      head: [['Date', 'Subject', 'Status', 'Remarks']],
      body: attendanceData.map(record => [record.date, record.subject || '', record.status, record.remarks || '']),
    });
    doc.save('attendance-report.pdf');
  };

  const exportToCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Date,Subject,Status,Remarks\n' +
      attendanceData.map(record => `${record.date},${record.subject || ''},${record.status},${record.remarks || ''}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'attendance-report.csv');
    document.body.appendChild(link);
    link.click();
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'orange';
    return 'red';
  };

  return (
    <div className="attendance-report">
      <h1>View Attendance Summary</h1>
      {error && <div className="error">{error}</div>}

      {/* Filter Panel */}
      <div className="filter-panel">
        <div className="filter-group">
          <label htmlFor="summary-course-select">Course</label>
          <select
            id="summary-course-select"
            name="course"
            value={filters.course}
            onChange={handleFilterChange}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.name}>{course.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="summary-semester-select">Semester</label>
          <select
            id="summary-semester-select"
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            disabled={!filters.course}
          >
            <option value="">Select Semester</option>
            {semesters.map(sem => (
              <option key={sem.id} value={sem.name}>{sem.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="summary-date-from">Date From</label>
          <input
            id="summary-date-from"
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="summary-date-to">Date To</label>
          <input
            id="summary-date-to"
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="summary-student-search">Student Name/ID</label>
          <input
            id="summary-student-search"
            type="text"
            name="student"
            value={filters.student}
            onChange={handleFilterChange}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Attendance Summary */}
      {attendanceData.length > 0 && (
        <>
          <div className="summary-section">
            <h2>Attendance Summary</h2>
            <div className="summary-stats">
              <div>Total Working Days: {summary.totalDays}</div>
              <div>Days Present: {summary.present}</div>
              <div>Days Absent: {summary.absent}</div>
              <div>Days on Leave: {summary.leave}</div>
              <div style={{ color: getPercentageColor(summary.percentage) }}>
                Attendance %: {summary.percentage.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'active' : ''}>Table View</button>
            <button onClick={() => setViewMode('chart')} className={viewMode === 'chart' ? 'active' : ''}>Chart View</button>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.subject || ''}</td>
                    <td className={`status-${record.status.toLowerCase()}`}>{record.status}</td>
                    <td>{record.remarks || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Chart View Placeholder */}
          {viewMode === 'chart' && (
            <div className="chart-placeholder">
              <p>Chart view not implemented yet. Placeholder for Chart.js integration.</p>
            </div>
          )}

          {/* Export Buttons */}
          <div className="export-buttons">
            <button onClick={exportToPDF}>Export to PDF</button>
            <button onClick={exportToCSV}>Export to CSV</button>
          </div>
        </>
      )}

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default AttendanceReport;
