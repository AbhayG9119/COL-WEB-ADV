import React, { useState, useEffect } from 'react';
import '../../styles/ComplaintsModule.css';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filters, setFilters] = useState({ category: '', status: '', dateFrom: '', dateTo: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Mock data for complaints
  const mockComplaints = [
    {
      complaint_id: 'CMP2023-001',
      category: 'Hostel',
      subject: 'Room Cleaning Issue',
      description: 'The room has not been cleaned for the past week. Dust and dirt accumulation is affecting my health.',
      date_raised: '2023-10-15',
      status: 'Resolved',
      attachment: null,
      admin_remarks: 'Issue resolved. Cleaning staff has been notified.'
    },
    {
      complaint_id: 'CMP2023-002',
      category: 'Academics',
      subject: 'Late Assignment Submission',
      description: 'I was unable to submit my assignment on time due to technical issues with the portal.',
      date_raised: '2023-10-20',
      status: 'In Progress',
      attachment: 'assignment.pdf',
      admin_remarks: 'Under review by faculty.'
    },
    {
      complaint_id: 'CMP2023-003',
      category: 'Transport',
      subject: 'Bus Delay',
      description: 'The college bus was delayed by 30 minutes this morning, causing me to miss my first class.',
      date_raised: '2023-10-22',
      status: 'Pending',
      attachment: null,
      admin_remarks: ''
    },
    {
      complaint_id: 'CMP2023-004',
      category: 'Fees',
      subject: 'Incorrect Fee Receipt',
      description: 'The fee receipt generated shows incorrect amount. I paid extra but it\'s not reflected.',
      date_raised: '2023-10-18',
      status: 'Rejected',
      attachment: 'fee_receipt.pdf',
      admin_remarks: 'Please contact accounts department for clarification.'
    },
    {
      complaint_id: 'CMP2023-005',
      category: 'Exam',
      subject: 'Exam Hall Issue',
      description: 'The seating arrangement in the exam hall was incorrect, leading to confusion during the exam.',
      date_raised: '2023-10-25',
      status: 'Resolved',
      attachment: null,
      admin_remarks: 'Seating corrected for future exams.'
    },
    {
      complaint_id: 'CMP2023-006',
      category: 'Other',
      subject: 'Library Book Availability',
      description: 'The required book for my project is not available in the library despite being listed.',
      date_raised: '2023-10-28',
      status: 'In Progress',
      attachment: null,
      admin_remarks: 'Checking inventory.'
    }
  ];

  useEffect(() => {
    let storedComplaints = JSON.parse(localStorage.getItem('studentComplaints') || '[]');
    if (storedComplaints.length === 0) {
      // Populate with mock data if no complaints exist
      localStorage.setItem('studentComplaints', JSON.stringify(mockComplaints));
      storedComplaints = mockComplaints;
    }
    const sortedComplaints = storedComplaints.sort((a, b) => new Date(b.date_raised) - new Date(a.date_raised));
    setComplaints(sortedComplaints);
    setFilteredComplaints(sortedComplaints);
  }, []);

  useEffect(() => {
    let filtered = complaints;
    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(c => new Date(c.date_raised) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => new Date(c.date_raised) <= new Date(filters.dateTo));
    }
    setFilteredComplaints(filtered);
  }, [filters, complaints]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-in-progress';
      case 'Resolved': return 'status-resolved';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const isNew = (date) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(date) > threeDaysAgo;
  };

  return (
    <div className="menu-content">
      <h1>My Complaints</h1>
      <div className="filters">
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Hostel">Hostel</option>
          <option value="Academics">Academics</option>
          <option value="Transport">Transport</option>
          <option value="Fees">Fees</option>
          <option value="Exam">Exam</option>
          <option value="Other">Other</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} placeholder="From Date" />
        <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} placeholder="To Date" />
      </div>
      <table className="complaints-table">
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Category</th>
            <th>Subject</th>
            <th>Date Raised</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map(complaint => (
            <tr key={complaint.complaint_id}>
              <td>{complaint.complaint_id} {isNew(complaint.date_raised) && <span className="new-badge">New</span>}</td>
              <td>{complaint.category}</td>
              <td>{complaint.subject}</td>
              <td>{complaint.date_raised}</td>
              <td><span className={`status ${getStatusClass(complaint.status)}`}>{complaint.status}</span></td>
              <td><button className="view-btn" onClick={() => handleView(complaint)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedComplaint && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedComplaint.subject}</h2>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Category:</strong> {selectedComplaint.category}</p>
            <p><strong>Date Raised:</strong> {selectedComplaint.date_raised}</p>
            <p><strong>Status:</strong> <span className={`status ${getStatusClass(selectedComplaint.status)}`}>{selectedComplaint.status}</span></p>
            {selectedComplaint.attachment && (
              <p><strong>Attachment:</strong> <a href="#" onClick={() => alert('Attachment preview not implemented')}>{selectedComplaint.attachment}</a></p>
            )}
            <p><strong>Admin Remarks:</strong> {selectedComplaint.admin_remarks || 'No remarks yet'}</p>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
