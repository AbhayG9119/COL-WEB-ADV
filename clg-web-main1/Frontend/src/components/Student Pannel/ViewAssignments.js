import React, { useState, useEffect } from 'react';

const ViewAssignments = () => {
  const [assignmentList, setAssignmentList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Mock data
    const mockAssignments = [
      {
        id: 1,
        title: 'Math Homework',
        description: 'Solve problems 1-10',
        subject: 'Mathematics',
        deadline: '2023-10-15',
        fileUrl: 'https://example.com/math.pdf',
        instructions: 'Submit in PDF format'
      },
      {
        id: 2,
        title: 'Science Project',
        description: 'Build a model',
        subject: 'Science',
        deadline: '2023-10-20',
        fileUrl: null,
        instructions: 'Include photos'
      },
      {
        id: 3,
        title: 'History Essay',
        description: 'Write about ancient civilizations',
        subject: 'History',
        deadline: '2023-09-30',
        fileUrl: 'https://example.com/history.pdf',
        instructions: 'Minimum 1000 words'
      }
    ];
    // Mock API call
    setAssignmentList(mockAssignments);
  }, []);

  const filteredAssignments = assignmentList.filter(assignment => {
    const matchesSubject = selectedSubject === '' || assignment.subject === selectedSubject;
    const matchesDate = (!selectedDateRange.start || new Date(assignment.deadline) >= new Date(selectedDateRange.start)) &&
                        (!selectedDateRange.end || new Date(assignment.deadline) <= new Date(selectedDateRange.end));
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesDate && matchesSearch;
  });

  const paginatedAssignments = filteredAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const handleCardClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const handleDownload = (fileUrl) => {
    if (fileUrl) {
      // Mock download
      alert('Download File: ' + fileUrl);
    }
  };

  const isOverdue = (deadline) => new Date(deadline) < new Date();

  const subjects = [...new Set(assignmentList.map(a => a.subject))];

  return (
    <div className="menu-content">
      <h1>View Assignments</h1>

      {/* AssignmentFilterBar */}
      <div className="filter-bar">
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
        </select>
        <input
          type="date"
          value={selectedDateRange.start}
          onChange={(e) => setSelectedDateRange({ ...selectedDateRange, start: e.target.value })}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={selectedDateRange.end}
          onChange={(e) => setSelectedDateRange({ ...selectedDateRange, end: e.target.value })}
          placeholder="End Date"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assignments..."
        />
      </div>

      {/* AssignmentList */}
      <div className="assignment-list">
        {paginatedAssignments.length === 0 ? (
          <p>No assignments found</p>
        ) : (
          paginatedAssignments.map(assignment => (
            <div key={assignment.id} className="assignment-card" onClick={() => handleCardClick(assignment)}>
              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p>Deadline: {assignment.deadline}</p>
              {isOverdue(assignment.deadline) && <span className="badge overdue">Overdue</span>}
              <button className="btn" onClick={(e) => { e.stopPropagation(); handleDownload(assignment.fileUrl); }} disabled={!assignment.fileUrl}>
                Download File
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}

      {/* AssignmentDetailsModal */}
      {showDetailsModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedAssignment.title}</h2>
            <p><strong>Description:</strong> {selectedAssignment.description}</p>
            <p><strong>Deadline:</strong> {selectedAssignment.deadline}</p>
            <p><strong>Instructions:</strong> {selectedAssignment.instructions}</p>
            <button className="btn" onClick={() => handleDownload(selectedAssignment.fileUrl)} disabled={!selectedAssignment.fileUrl}>
              Download File
            </button>
            <button className="btn close-btn" onClick={() => setShowDetailsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAssignments;
