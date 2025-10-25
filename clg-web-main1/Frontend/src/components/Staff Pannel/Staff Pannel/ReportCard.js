import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportCard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/staff/students', config); // Assume endpoint for assigned students
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const generateReportCard = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`/api/staff/report-card/${selectedStudent}`, config);
      setReportCard(res.data);
    } catch (error) {
      console.error('Error generating report card:', error);
    }
    setLoading(false);
  };

  return (
    <div className="report-card">
      <h1>Report Card</h1>
      <div className="select-student">
        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student._id} value={student._id}>{student.name} - {student.class}</option>
          ))}
        </select>
        <button onClick={generateReportCard} disabled={loading || !selectedStudent}>Generate Report</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : reportCard ? (
        <div className="report-details">
          <h2>Report for {reportCard.studentName}</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {reportCard.subjects.map(subject => (
                <tr key={subject.subject}>
                  <td>{subject.subject}</td>
                  <td>{subject.grade}</td>
                  <td>{subject.attendancePercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>Overall Grade:</strong> {reportCard.overallGrade}</p>
          <p><strong>Overall Attendance:</strong> {reportCard.overallAttendance}%</p>
        </div>
      ) : (
        <p>Select a student to generate report card.</p>
      )}
    </div>
  );
};

export default ReportCard;
