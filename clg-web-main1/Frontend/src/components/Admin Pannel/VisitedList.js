import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { enquiryApi } from '../../services/adminApi';

const VisitedList = () => {
  const mockVisitors = [
    { id: 1, name: 'John Doe', contact: '1234567890', purpose: 'Enquiry about Science stream', inTime: '2023-10-01T10:00:00Z', outTime: '2023-10-01T12:30:00Z', linkedEnquiry: true },
    { id: 2, name: 'Jane Smith', contact: '0987654321', purpose: 'Meeting with counselor', inTime: '2023-10-02T09:15:00Z', outTime: '2023-10-02T11:45:00Z', linkedEnquiry: false },
    { id: 3, name: 'Alice Johnson', contact: '1122334455', purpose: 'Campus tour', inTime: '2023-10-03T14:00:00Z', outTime: null, linkedEnquiry: true },
    { id: 4, name: 'Bob Brown', contact: '5566778899', purpose: 'Fee payment', inTime: '2023-10-04T16:20:00Z', outTime: '2023-10-04T17:10:00Z', linkedEnquiry: false },
    { id: 5, name: 'Charlie Wilson', contact: '6677889900', purpose: 'Admission inquiry', inTime: '2023-10-05T11:00:00Z', outTime: '2023-10-05T13:30:00Z', linkedEnquiry: true }
  ];

  const [visitors] = useState(mockVisitors);
  const [filteredVisitors, setFilteredVisitors] = useState(mockVisitors);
  const [filters, setFilters] = useState({
    date: '',
    name: '',
    contact: ''
  });


  const userRole = localStorage.getItem('role'); // Assuming role is stored

  useEffect(() => {
    // Mock data already set
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = visitors;

    if (filters.date) {
      filtered = filtered.filter(visitor => {
        const visitDate = new Date(visitor.inTime).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        return visitDate === filterDate;
      });
    }

    if (filters.name) {
      filtered = filtered.filter(visitor =>
        visitor.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.contact) {
      filtered = filtered.filter(visitor =>
        visitor.contact.includes(filters.contact)
      );
    }

    setFilteredVisitors(filtered);
  }, [visitors, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const calculateDuration = (inTime, outTime) => {
    if (!outTime) return 'Still visiting';

    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diffMs = outDate - inDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMinutes}m`;
  };

  const isLongVisit = (inTime, outTime) => {
    if (!outTime) return false;

    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diffMs = outDate - inDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 2; // Highlight visits longer than 2 hours
  };

  const handleExport = async () => {
    try {
      const result = await enquiryApi.exportVisitors(filters);
      if (result.success) {
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'visited_list.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Export completed');
      } else {
        toast.error('Failed to export visitors');
      }
    } catch (error) {
      toast.error('Something went wrong during export');
    }
  };



  return (
    <div className="menu-content">
      <h1>Visited List</h1>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Search by name"
          />
        </div>
        <div className="filter-group">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={filters.contact}
            onChange={handleFilterChange}
            placeholder="Search by contact"
          />
        </div>
        {userRole === 'admin' && (
          <button onClick={handleExport} className="export-btn">
            Export to Excel
          </button>
        )}
      </div>

      {/* Visitors Table */}
      <div className="table-container">
        <table className="visitors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Purpose</th>
              <th>In-Time</th>
              <th>Out-Time</th>
              <th>Duration</th>
              <th>Linked Enquiry</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan="7">No visitors found for selected filters.</td>
              </tr>
            ) : (
              filteredVisitors.map(visitor => (
                <tr
                  key={visitor.id}
                  className={isLongVisit(visitor.inTime, visitor.outTime) ? 'long-visit' : ''}
                >
                  <td>{visitor.name}</td>
                  <td>{visitor.contact}</td>
                  <td>{visitor.purpose}</td>
                  <td>{new Date(visitor.inTime).toLocaleString()}</td>
                  <td>{visitor.outTime ? new Date(visitor.outTime).toLocaleString() : 'Still visiting'}</td>
                  <td>{calculateDuration(visitor.inTime, visitor.outTime)}</td>
                  <td>{visitor.linkedEnquiry ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="summary-section">
        <p>Total Visitors: {filteredVisitors.length}</p>
        <p>Currently Visiting: {filteredVisitors.filter(v => !v.outTime).length}</p>
        <p>Long Visits ({">"}2 hours): {filteredVisitors.filter(v => isLongVisit(v.inTime, v.outTime)).length}</p>
      </div>
    </div>
  );
};

export default VisitedList;
