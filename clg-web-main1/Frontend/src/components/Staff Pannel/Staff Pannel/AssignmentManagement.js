import React, { useState } from 'react';
import AssignmentForm from './AssignmentForm';
import AssignmentList from './AssignmentList';
import SubmissionList from './SubmissionList';
import GradeAssignments from './GradeAssignments';
import './AssignmentManagement.css';

const AssignmentManagement = ({ initialView = 'list' }) => {
  // Static sample data
  const initialAssignments = [
    {
      assignment_id: 'A101',
      title: 'Mechanics Lab Report',
      subject: 'Physics',
      deadline: '2025-11-05',
      resources: ['lab_manual.pdf']
    },
    {
      assignment_id: 'A102',
      title: 'Algebra Homework',
      subject: 'Math',
      deadline: '2025-11-10',
      resources: []
    }
  ];

  const initialSubmissions = {
    A101: [
      {
        submission_id: 'S101',
        student_name: 'Ravi Kumar',
        submitted_on: '2025-11-03',
        status: 'Submitted',
        grade: 'A',
        comments: 'Well done'
      },
      {
        submission_id: 'S102',
        student_name: 'Priya Sharma',
        submitted_on: null,
        status: 'Pending',
        grade: '',
        comments: ''
      }
    ],
    A102: []
  };

  const getInitialState = () => {
    if (initialView === 'submissions' && initialAssignments.length > 0) {
      return {
        selectedAssignment: initialAssignments[0].assignment_id,
        selectedSubmission: null,
        showForm: false,
        showGradingPanel: false
      };
    } else if (initialView === 'grading' && initialAssignments.length > 0 && initialSubmissions[initialAssignments[0].assignment_id].length > 0) {
      return {
        selectedAssignment: initialAssignments[0].assignment_id,
        selectedSubmission: initialSubmissions[initialAssignments[0].assignment_id][0].submission_id,
        showForm: false,
        showGradingPanel: true
      };
    } else {
      return {
        selectedAssignment: null,
        selectedSubmission: null,
        showForm: false,
        showGradingPanel: false
      };
    }
  };

  const initialState = getInitialState();

  const [assignments, setAssignments] = useState(initialAssignments);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedAssignment, setSelectedAssignment] = useState(initialState.selectedAssignment);
  const [selectedSubmission, setSelectedSubmission] = useState(initialState.selectedSubmission);
  const [showForm, setShowForm] = useState(initialState.showForm);
  const [showGradingPanel, setShowGradingPanel] = useState(initialState.showGradingPanel);

  // The flow is already handled in the render logic

  const handleCreateAssignment = (newAssignment) => {
    const assignment = {
      ...newAssignment,
      assignment_id: `A${assignments.length + 101}`,
      resources: [] // Static, no upload
    };
    setAssignments([...assignments, assignment]);
    setSubmissions({ ...submissions, [assignment.assignment_id]: [] });
    setShowForm(false);
  };

  const handleSelectAssignment = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setSelectedSubmission(null);
    setShowGradingPanel(false);
  };

  const handleSelectSubmission = (submissionId) => {
    setSelectedSubmission(submissionId);
    setShowGradingPanel(true);
  };

  const handleGradeSubmission = (submissionId, grade, comments) => {
    const updatedSubmissions = { ...submissions };
    const assignmentSubs = updatedSubmissions[selectedAssignment];
    const index = assignmentSubs.findIndex(sub => sub.submission_id === submissionId);
    if (index !== -1) {
      assignmentSubs[index] = { ...assignmentSubs[index], grade, comments };
      setSubmissions(updatedSubmissions);
    }
    setShowGradingPanel(false);
    setSelectedSubmission(null);
  };

  return (
    <div className="assignment-management">
      <h1>Assignment Management</h1>
      {!showForm && !selectedAssignment && (
        <>
          <button onClick={() => setShowForm(true)}>Create Assignment</button>
          <AssignmentList assignments={assignments} onSelect={handleSelectAssignment} />
        </>
      )}
      {showForm && (
        <AssignmentForm onSave={handleCreateAssignment} onCancel={() => setShowForm(false)} />
      )}
      {selectedAssignment && !showGradingPanel && (
        <>
          <button onClick={() => setSelectedAssignment(null)}>Back to Assignments</button>
          <SubmissionList
            submissions={submissions[selectedAssignment]}
            onSelect={handleSelectSubmission}
          />
        </>
      )}
      {showGradingPanel && selectedSubmission && (
        <GradeAssignments
          submission={submissions[selectedAssignment].find(sub => sub.submission_id === selectedSubmission)}
          onSave={handleGradeSubmission}
          onCancel={() => setShowGradingPanel(false)}
        />
      )}
    </div>
  );
};

export default AssignmentManagement;
