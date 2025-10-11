import React from 'react';

const ViewAssignments = () => {
  const assignments = [
    { id: 1, title: 'Math Homework', description: 'Solve problems 1-10', deadline: '2023-10-15', status: 'Pending' },
    { id: 2, title: 'Science Project', description: 'Build a model', deadline: '2023-10-20', status: 'Submitted' }
  ];

  return (
    <div className="menu-content">
      <h1>View Assignments</h1>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p>Deadline: {assignment.deadline}</p>
            <p>Status: {assignment.status}</p>
            <button className="btn">Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAssignments;
