import React, { useState, useEffect } from 'react';

const AssignClass = () => {
  const [staffId, setStaffId] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data for staff
    const mockStaff = [
      { id: 1, full_name: 'John Doe', designation_name: 'Teacher' },
      { id: 2, full_name: 'Jane Smith', designation_name: 'Professor' },
      { id: 3, full_name: 'Bob Johnson', designation_name: 'Lecturer' },
      { id: 4, full_name: 'Alice Brown', designation_name: 'Assistant Professor' },
      { id: 5, full_name: 'Charlie Wilson', designation_name: 'Instructor' }
    ];
    setStaffList(mockStaff);

    // Mock data for courses
    const mockClasses = [
      { id: 1, name: 'BA' },
      { id: 2, name: 'BSC' },
      { id: 3, name: 'BED' }
    ];
    setClasses(mockClasses);

    // Mock initial assignments
    const mockAssignments = [
      { id: 1, staff: 'John Doe', class: 'BA', subject: 'History' },
      { id: 2, staff: 'Jane Smith', class: 'BSC', subject: 'Physics' },
      { id: 3, staff: 'Bob Johnson', class: 'BED', subject: 'Education' }
    ];
    setAssignments(mockAssignments);
  }, []);

  useEffect(() => {
    if (classId) {
      // Mock data for subjects based on course
      let mockSubjects = [];
      if (classId === 1) { // BA
        mockSubjects = [
          { id: 1, name: 'History' },
          { id: 2, name: 'Political Science' },
          { id: 3, name: 'English Literature' }
        ];
      } else if (classId === 2) { // BSC
        mockSubjects = [
          { id: 1, name: 'Physics' },
          { id: 2, name: 'Chemistry' },
          { id: 3, name: 'Mathematics' }
        ];
      } else if (classId === 3) { // BED
        mockSubjects = [
          { id: 1, name: 'Education' },
          { id: 2, name: 'Psychology' },
          { id: 3, name: 'Teaching Methods' }
        ];
      }
      setSubjects(mockSubjects);
    } else {
      setSubjects([]);
      setSubjectId('');
    }
  }, [classId]);

  useEffect(() => {
    setIsValid(staffId && classId && subjectId);
  }, [staffId, classId, subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    // Mock assignment - simulate success and save to assignments
    setTimeout(() => {
      const selectedStaff = staffList.find(s => s.id === staffId);
      const selectedClass = classes.find(c => c.id === classId);
      const selectedSubject = subjects.find(s => s.id === subjectId);
      const newAssignment = {
        id: Date.now(),
        staff: selectedStaff.full_name,
        class: selectedClass.name,
        subject: selectedSubject.name
      };
      setAssignments(prev => [...prev, newAssignment]);
      setLoading(false);
      setMessage('Course assigned successfully');
      setStaffId('');
      setClassId('');
      setSubjectId('');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="menu-content">
      <h1>Assign Course</h1>
      <p>Assign courses to staff members.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Staff Name:</label>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} required>
            <option value="">Select Staff</option>
            {staffList.map(staff => (
              <option key={staff.id} value={staff.id}>{staff.full_name} ({staff.designation_name})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Course:</label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} required>
            <option value="">Select Course</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Subject:</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required disabled={!classId}>
            <option value="">Select Subject</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={!isValid || loading}>
          {loading ? 'Assigning...' : 'Assign Course'}
        </button>
      </form>
      {message && <div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}

      <h2>Assigned Courses</h2>
      {assignments.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Staff</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(assignment => (
              <tr key={assignment.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{assignment.staff}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{assignment.class}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{assignment.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assignments yet.</p>
      )}
    </div>
  );
};

export default AssignClass;
