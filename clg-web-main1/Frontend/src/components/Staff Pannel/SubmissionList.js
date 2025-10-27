import React from 'react';

const SubmissionList = ({ submissions, onSelect }) => {
  if (submissions.length === 0) {
    return <p>No submissions yet</p>;
  }

  return (
    <div className="submission-list">
      <h2>Student Submissions</h2>
      <table role="table" aria-label="Submissions list">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Submission Date</th>
            <th>Status</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => (
            <tr
              key={submission.submission_id}
              onClick={() => onSelect(submission.submission_id)}
              style={{ cursor: 'pointer' }}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(submission.submission_id); }}
              aria-label={`Select submission by ${submission.student_name}`}
            >
              <td>{submission.student_name}</td>
              <td>{submission.submitted_on ? new Date(submission.submitted_on).toLocaleDateString() : 'N/A'}</td>
              <td>
                <span className={`status ${submission.status.toLowerCase()}`}>
                  {submission.status === 'Submitted' ? '✅' : '⏰'} {submission.status}
                </span>
              </td>
              <td>{submission.grade || 'Not graded'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;
