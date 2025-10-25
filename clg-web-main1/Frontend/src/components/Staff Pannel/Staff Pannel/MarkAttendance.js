import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MarkAttendance.css';

const MarkAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [filters, setFilters] = useState({
    course: '',
    semester: '',
    subject: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [markAllPresent, setMarkAllPresent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setSubjects([]);
      setStudents([]);
    }
  }, [filters.course]);

  // Fetch subjects when semester changes
  useEffect(() => {
    if (filters.semester) {
      fetchSubjects(filters.course, filters.semester);
    } else {
      setSubjects([]);
      setStudents([]);
    }
  }, [filters.semester]);

  // Fetch students when subject changes
  useEffect(() => {
    if (filters.subject) {
      fetchStudents(filters.course, filters.semester, filters.subject);
    } else {
      setStudents([]);
    }
  }, [filters.subject]);

  // Update attendance when students change or markAllPresent toggles
  useEffect(() => {
    if (students.length > 0) {
      const initialAttendance = {};
      students.forEach(student => {
        initialAttendance[student.rollNo] = {
          status: markAllPresent ? 'Present' : 'Absent',
          remarks: '',
        };
      });
      setAttendance(initialAttendance);
    }
  }, [students, markAllPresent]);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses...');
      const response = await axios.get('/api/courses');
      console.log('Courses response:', response.data);
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      // Mock data for demonstration
      setCourses([
        { id: 1, name: 'BA' },
        { id: 2, name: 'BSc' },
        { id: 3, name: 'B.Ed' }
      ]);
      setError('');
    }
  };

  const fetchSemesters = async (course) => {
    try {
      console.log('Fetching semesters for course:', course);
      const response = await axios.get(`/api/semesters?course=${course}`);
      console.log('Semesters response:', response.data);
      setSemesters(response.data);
    } catch (err) {
      console.error('Error fetching semesters:', err);
      // Mock data for demonstration
      setSemesters([
        { id: 1, name: 'Semester 1' },
        { id: 2, name: 'Semester 2' },
        { id: 3, name: 'Semester 3' }
      ]);
      setError('');
    }
  };

  const fetchSubjects = async (course, semester) => {
    try {
      console.log('Fetching subjects for course:', course, 'semester:', semester);
      const response = await axios.get(`/api/subjects?course=${course}&semester=${semester}`);
      console.log('Subjects response:', response.data);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      // Mock data for demonstration
      setSubjects([
        { id: 1, name: 'Subject 1' },
        { id: 2, name: 'Subject 2' },
        { id: 3, name: 'Subject 3' }
      ]);
      setError('');
    }
  };

  const fetchStudents = async (course, semester, subject) => {
    try {
      console.log('Fetching students for course:', course, 'semester:', semester, 'subject:', subject);
      const response = await axios.get(`/api/students?course=${course}&semester=${semester}&subject=${subject}`);
      console.log('Students response:', response.data);
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      // Mock data for demonstration
      setStudents([
        { rollNo: '101', name: 'Student A' },
        { rollNo: '102', name: 'Student B' },
        { rollNo: '103', name: 'Student C' }
      ]);
      setError('');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendanceChange = (rollNo, field, value) => {
    setAttendance(prev => ({
      ...prev,
      [rollNo]: { ...prev[rollNo], [field]: value }
    }));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!filters.course || !filters.semester || !filters.subject || !filters.date) {
      setError('Please select all filters');
      return;
    }
    const markedStudents = Object.keys(attendance).filter(rollNo => attendance[rollNo].status !== 'Absent');
    if (markedStudents.length === 0) {
      setError('Please mark attendance for at least one student');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        course: filters.course,
        semester: filters.semester,
        subject: filters.subject,
        date: filters.date,
        attendance: attendance,
      };
      await axios.post('/api/attendance', payload);
      setSuccess('Attendance marked successfully');
    } catch (err) {
      setError('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mark-attendance">
      <h1>Mark Student Attendance</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Filter Panel */}
      <div className="filter-panel">
        <div className="filter-group">
          <label htmlFor="attendance-course-select">Course</label>
          <select
            id="attendance-course-select"
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
          <label htmlFor="attendance-semester-select">Semester</label>
          <select
            id="attendance-semester-select"
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
          <label htmlFor="attendance-subject-select">Subject</label>
          <select
            id="attendance-subject-select"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            disabled={!filters.semester}
          >
            <option value="">Select Subject</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="attendance-date-select">Date</label>
          <input
            id="attendance-date-select"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Student Attendance Table */}
      {students.length > 0 && (
        <>
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search by name or roll no"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={markAllPresent}
                onChange={(e) => setMarkAllPresent(e.target.checked)}
              />
              Mark All Present
            </label>
          </div>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.rollNo}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>
                    <select
                      value={attendance[student.rollNo]?.status || 'Absent'}
                      onChange={(e) => handleAttendanceChange(student.rollNo, 'status', e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={attendance[student.rollNo]?.remarks || ''}
                      onChange={(e) => handleAttendanceChange(student.rollNo, 'remarks', e.target.value)}
                      placeholder="Optional remarks"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </>
      )}
    </div>
  );
};

export default MarkAttendance;
