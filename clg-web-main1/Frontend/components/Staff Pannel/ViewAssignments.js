import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/staff/assignments', config);
      setAssignments(res.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`/api/staff/assignments/${assignmentId}/submissions`, config);
      setSubmissions(res.data);
      setSelectedAssignment(assignmentId);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    setLoading(false);
  };

  const updateGrade = async (submissionId, grade) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/staff/submissions/${submissionId}/grade`, { grade }, config);
      fetchSubmissions(selectedAssignment); // Refresh
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  };

  return (
    <div className="view-assignments">
      <h1>View Assignments</h1>
      <div className="assignments-list">
        <h2>Your Assignments</h2>
        {assignments.map(assignment => (
          <div key={assignment._id} className="assignment-item">
            <h3>{assignment.title} - {assignment.class} ({assignment.subject})</h3>
            <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
            <button onClick={() => fetchSubmissions(assignment._id)}>View Submissions</button>
          </div>
        ))}
      </div>
      {selectedAssignment && (
        <div className="submissions">
          <h2>Submissions</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub._id}>
                    <td>{sub.studentName}</td>
                    <td>{sub.status}</td>
                    <td>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <input
                        type="text"
                        value={sub.grade}
                        onChange={(e) => updateGrade(sub._id, e.target.value)}
                        placeholder="Enter grade"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAssignments;
