import React from 'react';

const AssignmentList = ({ assignments, onSelect }) => {
  if (assignments.length === 0) {
    return <p>No assignments created yet</p>;
  }

  return (
    <div className="assignment-list">
      <h2>Your Assignments</h2>
      <table role="table" aria-label="Assignments list">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => (
            <tr
              key={assignment.assignment_id}
              onClick={() => onSelect(assignment.assignment_id)}
              style={{ cursor: 'pointer' }}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(assignment.assignment_id); }}
              aria-label={`Select assignment ${assignment.title}`}
            >
              <td>{assignment.title}</td>
              <td>{assignment.subject}</td>
              <td>{new Date(assignment.deadline).toLocaleDateString()}</td>
              <td>Active</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentList;
