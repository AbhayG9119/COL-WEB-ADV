import React, { useState, useEffect } from 'react';

const SubmitAssignment = () => {
  const [selectedAssignmentID, setSelectedAssignmentID] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('Pending');
  const [submissionDate, setSubmissionDate] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  // Mock assignments for selection
  const mockAssignments = [
    { id: 1, title: 'Math Homework', deadline: '2023-10-15' },
    { id: 2, title: 'Science Project', deadline: '2023-10-20' },
    { id: 3, title: 'History Essay', deadline: '2023-09-30' }
  ];

  useEffect(() => {
    // Mock check status on load
    // Assuming no submission yet
    setSubmissionStatus('Pending');
  }, []);

  const selectedAssignment = mockAssignments.find(a => a.id.toString() === selectedAssignmentID);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!allowedTypes.includes(file.type)) {
        setValidationMessage('Only PDF or DOCX files allowed');
        setSubmissionFile(null);
        return;
      }
      if (file.size > maxSize) {
        setValidationMessage('File size must be less than 10MB');
        setSubmissionFile(null);
        return;
      }
      setSubmissionFile(file);
      setValidationMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionFile) {
      setValidationMessage('Please upload a file');
      return;
    }
    if (commentText.length > 250) {
      setValidationMessage('Comment must be less than 250 characters');
      return;
    }
    const isLate = selectedAssignment && new Date() > new Date(selectedAssignment.deadline);
    // Mock submit
    setSubmissionStatus(isLate ? 'Late Submission' : 'Submitted');
    setSubmissionDate(new Date().toISOString().split('T')[0]);
    alert('Assignment submitted successfully!');
  };

  const isSubmitDisabled = !submissionFile || !selectedAssignmentID;

  return (
    <div className="menu-content">
      <h1>Submit Assignment</h1>

      {/* AssignmentSelector */}
      <div className="assignment-selector">
        <select value={selectedAssignmentID} onChange={(e) => setSelectedAssignmentID(e.target.value)}>
          <option value="">Select Assignment</option>
          {mockAssignments.map(assignment => (
            <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
          ))}
        </select>
        {selectedAssignment && (
          <p>Deadline: {selectedAssignment.deadline}</p>
        )}
      </div>

      {/* UploadSection */}
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add remarks (optional)"
          maxLength="250"
        />
        <p>{commentText.length}/250 characters</p>
        {validationMessage && <p className="validation-message">{validationMessage}</p>}
      </div>

      {/* SubmitButton */}
      <button className="btn submit-btn" onClick={handleSubmit} disabled={isSubmitDisabled}>
        Submit Assignment
      </button>

      {/* SubmissionStatusCard */}
      <div className="status-card">
        <h3>Submission Status</h3>
        <p><strong>Status:</strong> {submissionStatus}</p>
        {submissionDate && <p><strong>Submitted On:</strong> {submissionDate}</p>}
        {submissionStatus === 'Late Submission' && <p className="late-flag">Late Submission</p>}
      </div>
    </div>
  );
};

export default SubmitAssignment;
