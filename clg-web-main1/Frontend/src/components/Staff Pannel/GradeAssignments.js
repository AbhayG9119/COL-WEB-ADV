import React, { useState } from 'react';

const GradeAssignments = ({ submission, onSave, onCancel }) => {
  const [grade, setGrade] = useState(submission.grade || '');
  const [comments, setComments] = useState(submission.comments || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(submission.submission_id, grade, comments);
  };

  return (
    <div className="grading-panel modal" role="dialog" aria-modal="true" aria-labelledby="grading-title">
      <div className="modal-content">
        <h2 id="grading-title">Grade Submission</h2>
        <p><strong>Student:</strong> {submission.student_name}</p>
        <p><strong>Status:</strong> {submission.status}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="grade">Grade:</label>
            <select id="grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Select Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="comments">Comments:</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments..."
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default GradeAssignments;
