import React, { useState } from 'react';
import './Reports.css';

const descriptions = {
  'Fees Report': 'This report provides details on fee collections, including student IDs, amounts paid/unpaid, and transaction dates.',
  'Staff Report': 'View staff information such as IDs, names, departments, roles, and active status.',
  'Certificate Report': 'Track certificate issuance for students, including types, statuses, and dates.',
  'Circular Report': 'List circulars and notices, targeted roles, and their active status.',
  'Work Management Report': 'Monitor assigned tasks, staff involved, completion status, and dates.',
  'Expense Report': 'Summarize expenses by category, department, amounts, and dates.',
  'Enquiry Report': 'Review enquiries from various sources, details, statuses, and dates.'
};

const reportTypes = [
  'Fees Report',
  'Staff Report',
  'Certificate Report',
  'Circular Report',
  'Work Management Report',
  'Expense Report',
  'Enquiry Report'
];

const filterOptions = {
  'Fees Report': [
    { label: 'Date Range (From)', type: 'date', id: 'date-from' },
    { label: 'Date Range (To)', type: 'date', id: 'date-to' },
    { label: 'Student ID', type: 'text', id: 'student-id' },
    { label: 'Status', type: 'select', options: ['Paid', 'Unpaid'], id: 'status' }
  ],
  'Staff Report': [
    { label: 'Date Range (From)', type: 'date', id: 'date-from' },
    { label: 'Date Range (To)', type: 'date', id: 'date-to' },
    { label: 'Staff ID', type: 'text', id: 'staff-id' },
    { label: 'Department', type: 'select', options: ['IT', 'HR', 'Finance'], id: 'department' },
    { label: 'Status', type: 'select', options: ['Active', 'Inactive'], id: 'status' },
    { label: 'Role', type: 'select', options: ['Teacher', 'Admin'], id: 'role' }
  ],
  'Certificate Report': [
    { label: 'Date Range (From)', type: 'date', id: 'date-from' },
    { label: 'Date Range (To)', type: 'date', id: 'date-to' },
    { label: 'Student ID', type: 'text', id: 'student-id' },
    { label: 'Status', type: 'select', options: ['Issued', 'Pending'], id: 'status' }
  ],
  'Circular Report': [
    { label: 'Date Range (From)', type: 'date', id: 'date-from' },
    { label: 'Date Range (To)', type: 'date', id: 'date-to' },
    { label: 'Role', type: 'select', options: ['All', 'Staff', 'Students'], id: 'role' },
    { label: 'Status', type: 'select', options: ['Active', 'Inactive'], id: 'status' }
  ],
  'Work Management Report': [
    { label: 'Date Range (From)', type: 'date', id: 'date-from' },
    { label: 'Date Range (To)', type: 'date', id: 'date-to' },
    { label: 'Staff ID', type: 'text', id: 'staff-id' },
    { label: 'Status', type: 'select', options: ['Completed', 'Pending'], id: 'status' }
  ],
  'Expense Report': [
    { label: 'Date Range (From)', type: 'date', id: 'date-from' },
    { label: 'Date Range (To)', type: 'date', id: 'date-to' },
    { label: 'Category', type: 'select', options: ['Office', 'Travel', 'Maintenance'], id: 'category' },
    { label: 'Department', type: 'select', options: ['IT', 'HR', 'Finance'], id: 'department' }
  ],
  'Enquiry Report': [
    { label: 'Date Range (From)', type: 'date', id: 'date-from' },
    { label: 'Date Range (To)', type: 'date', id: 'date-to' },
    { label: 'Source', type: 'select', options: ['Website', 'Phone', 'Walk-in'], id: 'source' },
    { label: 'Status', type: 'select', options: ['Open', 'Closed'], id: 'status' }
  ]
};

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleReportTypeChange = (e) => {
    setSelectedReportType(e.target.value);
    setFilters({});
    setReportData([]);
  };

  const handleFilterChange = (id, value) => {
    setFilters({ ...filters, [id]: value });
  };

  const generateReport = () => {
    // Dummy data generation based on report type
    let data = [];
    switch (selectedReportType) {
      case 'Fees Report':
        data = [
          { id: 1, studentId: 'S001', amount: 5000, status: 'Paid', date: '2023-01-01' },
          { id: 2, studentId: 'S002', amount: 4500, status: 'Unpaid', date: '2023-01-02' }
        ];
        break;
      case 'Staff Report':
        data = [
          { id: 1, staffId: 'ST001', name: 'John Doe', department: 'IT', status: 'Active', role: 'Teacher' },
          { id: 2, staffId: 'ST002', name: 'Jane Smith', department: 'HR', status: 'Active', role: 'Admin' }
        ];
        break;
      case 'Certificate Report':
        data = [
          { id: 1, studentId: 'S001', type: 'Transfer', status: 'Issued', date: '2023-01-01' },
          { id: 2, studentId: 'S002', type: 'Character', status: 'Pending', date: '2023-01-02' }
        ];
        break;
      case 'Circular Report':
        data = [
          { id: 1, title: 'Holiday Notice', role: 'All', status: 'Active', date: '2023-01-01' },
          { id: 2, title: 'Exam Schedule', role: 'Students', status: 'Active', date: '2023-01-02' }
        ];
        break;
      case 'Work Management Report':
        data = [
          { id: 1, staffId: 'ST001', task: 'Update Website', status: 'Completed', date: '2023-01-01' },
          { id: 2, staffId: 'ST002', task: 'Prepare Report', status: 'Pending', date: '2023-01-02' }
        ];
        break;
      case 'Expense Report':
        data = [
          { id: 1, category: 'Office', amount: 2000, department: 'IT', date: '2023-01-01' },
          { id: 2, category: 'Travel', amount: 1500, department: 'HR', date: '2023-01-02' }
        ];
        break;
      case 'Enquiry Report':
        data = [
          { id: 1, source: 'Website', details: 'Admission Query', status: 'Open', date: '2023-01-01' },
          { id: 2, source: 'Phone', details: 'Fee Structure', status: 'Closed', date: '2023-01-02' }
        ];
        break;
      default:
        data = [];
    }
    setReportData(data);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...reportData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToExcel = () => {
    alert('Export to Excel functionality would be implemented here.');
  };

  const exportToPDF = () => {
    alert('Export to PDF functionality would be implemented here.');
  };

  return (
    <div className="menu-content">
      <h1>Report Generator</h1>

      {!selectedReportType && (
        <div className="section">
          <p>Welcome to the Reports Module. Here you can generate various reports for the school management system. Select a report type from the dropdown below to get started.</p>
        </div>
      )}

      {/* Section 1: Select Report Type */}
      <div className="section">
        <label>Report Type</label>
        <select value={selectedReportType} onChange={handleReportTypeChange}>
          <option value="">Select Report Type</option>
          {reportTypes.map(reportType => <option key={reportType} value={reportType}>{reportType}</option>)}
        </select>
        {selectedReportType && (
          <p className="report-description">{descriptions[selectedReportType]}</p>
        )}
      </div>

      {/* Section 2: Apply Filters */}
      {selectedReportType && (
        <div className="section">
          <h3>Filters</h3>
          {filterOptions[selectedReportType].map(filter => (
            <div key={filter.id} className="filter-item">
              <label>{filter.label}</label>
              {filter.type === 'text' && (
                <input
                  type="text"
                  id={`filter-${filter.id}`}
                  value={filters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                />
              )}
              {filter.type === 'date' && (
                <input
                  type="date"
                  id={`filter-${filter.id}`}
                  value={filters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                />
              )}
              {filter.type === 'select' && (
                <select
                  id={`filter-${filter.id}`}
                  value={filters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                >
                  <option value="">Select</option>
                  {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Section 3: Generate Report */}
      {selectedReportType && (
        <div className="section">
          <button className="btn" onClick={generateReport}>Generate Report</button>
        </div>
      )}

      {/* Section 4: Report Output */}
      {reportData.length > 0 && (
        <div className="section">
          <h3>Report Results</h3>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table className="report-table">
            <thead>
              <tr>
                {Object.keys(reportData[0]).map(key => (
                  <th key={key} onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(item => (
                <tr key={item.id}>
                  {Object.values(item).map((val, idx) => <td key={idx}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * itemsPerPage >= filteredData.length}>Next</button>
          </div>
        </div>
      )}

      {/* Section 5: Export Options */}
      {reportData.length > 0 && (
        <div className="section">
          <h3>Export Report</h3>
          <button className="btn" onClick={exportToExcel}>Export to Excel</button>
          <button className="btn" onClick={exportToPDF}>Export to PDF</button>
        </div>
      )}
    </div>
  );
};

export default Reports;
