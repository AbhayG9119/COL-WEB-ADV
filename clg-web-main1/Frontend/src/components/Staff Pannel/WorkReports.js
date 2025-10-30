import React, { useState } from 'react';

// Hardcoded user role for testing (can be replaced with actual auth)
const userRole = 'faculty'; // Options: 'admin', 'faculty', 'student'

// Mock data for submitted work reports
const mockReports = [
  {
    id: 1,
    taskTitle: 'Prepare Semester Syllabus',
    submittedBy: 'Faculty',
    submittedOn: '2023-10-12',
    status: 'Submitted',
    remarks: 'Syllabus prepared and attached.',
    file: { name: 'Syllabus.pdf', size: '2.1 MB', type: 'pdf' },
    reviewed: false
  },
  {
    id: 2,
    taskTitle: 'Organize Workshop',
    submittedBy: 'Faculty',
    submittedOn: '2023-10-10',
    status: 'Reviewed',
    remarks: 'Workshop plan attached. Awaiting feedback.',
    file: { name: 'Workshop_Plan.docx', size: '1.5 MB', type: 'docx' },
    reviewed: true,
    reviewComments: 'Approved. Proceed with execution.'
  },
  {
    id: 3,
    taskTitle: 'Update Student Records',
    submittedBy: 'Faculty',
    submittedOn: '2023-10-15',
    status: 'Completed',
    remarks: 'Records updated successfully.',
    file: { name: 'Updated_Records.xlsx', size: '0.8 MB', type: 'xlsx' },
    reviewed: true,
    reviewComments: 'Verified and marked complete.'
  },
  {
    id: 4,
    taskTitle: 'Admin Task: Audit Finances',
    submittedBy: 'Admin',
    submittedOn: '2023-10-20',
    status: 'Submitted',
    remarks: 'Audit report attached.',
    file: { name: 'Audit_Report.pdf', size: '3.2 MB', type: 'pdf' },
    reviewed: false
  }
];

const WorkReports = () => {
  const [reports] = useState(mockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports);
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  });

  React.useEffect(() => {
    let filtered = reports;

    // Role-based filtering: Admins see all, others see own reports
    if (userRole !== 'admin') {
      filtered = filtered.filter(report => report.submittedBy.toLowerCase() === userRole);
    }

    if (filters.status) {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter(report => report.submittedOn === filters.date);
    }

    setFilteredReports(filtered);
  }, [reports, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const downloadFile = (file) => {
    // Simulate download
    alert(`Downloading ${file.name}`);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📄';
      case 'xlsx': return '📊';
      default: return '📎';
    }
  };

  return (
    <div className="menu-content">
      <h1>Work Reports</h1>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        >
          <option value="">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          placeholder="Filter by submission date"
          style={{ marginRight: '10px' }}
        />

      </div>

      {/* Reports Table */}
      {filteredReports.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '150px' }}>Task Title</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '100px' }}>Submitted By</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '120px' }}>Submitted On</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '100px' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '150px' }}>Remarks</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '200px' }}>File</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', minWidth: '150px' }}>Review</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report.taskTitle}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report.submittedBy}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report.submittedOn}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report.status}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{report.remarks}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {report.file && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <span style={{ marginRight: '10px' }}>{getFileIcon(report.file.type)}</span>
                          <span
                            title={`File type: ${report.file.type.toUpperCase()}, Size: ${report.file.size}`}
                            style={{ cursor: 'pointer', flexGrow: 1, wordBreak: 'break-word' }}
                            onClick={() => downloadFile(report.file)}
                          >
                            {report.file.name} ({report.file.size})
                          </span>
                        </div>
                        <button
                          onClick={() => downloadFile(report.file)}
                          style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px' }}
                        >
                          Download
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {report.reviewed ? report.reviewComments : 'Pending Review'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default WorkReports;
