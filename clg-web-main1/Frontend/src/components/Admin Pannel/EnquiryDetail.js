import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { enquiryApi } from '../../services/adminApi';

const EnquiryDetail = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    contact: '',
    dateRange: { start: '', end: '' }
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);


  const userRole = localStorage.getItem('role'); // Assuming role is stored

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const result = await enquiryApi.getEnquiries();
      if (result.success) {
        setEnquiries(result.data);
        setFilteredEnquiries(result.data);
      } else {
        toast.error('Failed to fetch enquiries');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback((query) => {
    let filtered = enquiries;

    if (query) {
      filtered = enquiries.filter(enquiry =>
        enquiry.name.toLowerCase().includes(query.toLowerCase()) ||
        enquiry.contact.includes(query)
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(enquiry => {
        const enquiryDate = new Date(enquiry.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return enquiryDate >= startDate && enquiryDate <= endDate;
      });
    }

    setFilteredEnquiries(filtered);
  }, [enquiries, filters]);

  const debouncedSearch = useCallback((query) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      performSearch(query);
    }, 500);
    setDebounceTimer(timer);
  }, [debounceTimer, performSearch]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };



  const handleViewEnquiry = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowModal(true);
    // Fetch follow-ups
    try {
      const result = await enquiryApi.getFollowUps(enquiry.id);
      if (result.success) {
        setFollowUps(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch follow-ups');
    }
  };

  const handleEditEnquiry = (enquiry) => {
    // Navigate to edit form or open edit modal
    console.log('Edit enquiry:', enquiry);
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const result = await enquiryApi.deleteEnquiry(enquiryId);
      if (result.success) {
        toast.success('Enquiry deleted successfully');
        fetchEnquiries();
      } else {
        toast.error('Failed to delete enquiry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEnquiry(null);
    setFollowUps([]);
  };

  const handleExport = async () => {
    try {
      const exportFilters = {};
      if (searchQuery) exportFilters.search = searchQuery;
      if (filters.dateRange.start) exportFilters.startDate = filters.dateRange.start;
      if (filters.dateRange.end) exportFilters.endDate = filters.dateRange.end;

      const result = await enquiryApi.exportEnquiries(exportFilters);
      if (result.success) {
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'enquiry_details.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Export completed');
      } else {
        toast.error('Failed to export enquiries');
      }
    } catch (error) {
      toast.error('Something went wrong during export');
    }
  };

  if (loading) return <div className="menu-content">Loading...</div>;

  return (
    <div className="menu-content">
      <h1>Enquiry Detail</h1>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or contact..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="date-filters">
          <input
            type="date"
            name="start"
            value={filters.dateRange.start}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, start: e.target.value }
            }))}
            placeholder="Start Date"
          />
          <input
            type="date"
            name="end"
            value={filters.dateRange.end}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, end: e.target.value }
            }))}
            placeholder="End Date"
          />
        </div>
        {userRole === 'admin' && (
          <button onClick={handleExport} className="export-btn">
            Export to Excel
          </button>
        )}
      </div>

      {/* Results Table */}
      <div className="table-container">
        <table className="enquiry-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Stream</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan="6">No records found for selected filters.</td>
              </tr>
            ) : (
              filteredEnquiries.map(enquiry => (
                <tr key={enquiry.id}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.contact}</td>
                  <td>{enquiry.stream}</td>
                  <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${enquiry.status?.toLowerCase()}`}>
                      {enquiry.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleViewEnquiry(enquiry)}>View</button>
                    {userRole === 'admin' && (
                      <>
                        <button onClick={() => handleEditEnquiry(enquiry)}>Edit</button>
                        <button onClick={() => handleDeleteEnquiry(enquiry.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Enquiry Details */}
      {showModal && selectedEnquiry && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Enquiry Details</h2>
            <div className="enquiry-info">
              <p><strong>Name:</strong> {selectedEnquiry.name}</p>
              <p><strong>Contact:</strong> {selectedEnquiry.contact}</p>
              <p><strong>Stream:</strong> {selectedEnquiry.stream}</p>
              <p><strong>Source:</strong> {selectedEnquiry.source}</p>
              <p><strong>Remarks:</strong> {selectedEnquiry.remarks}</p>
              <p><strong>Status:</strong> {selectedEnquiry.status}</p>
              <p><strong>Date:</strong> {new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
            </div>

            <h3>Follow-up History</h3>
            <div className="follow-up-timeline">
              {followUps.length === 0 ? (
                <p>No follow-ups yet.</p>
              ) : (
                followUps.map(followUp => (
                  <div key={followUp.id} className="timeline-item">
                    <p><strong>Date:</strong> {new Date(followUp.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> {followUp.status}</p>
                    <p><strong>Notes:</strong> {followUp.notes}</p>
                    {followUp.reminderDate && (
                      <p><strong>Reminder:</strong> {new Date(followUp.reminderDate).toLocaleDateString()}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryDetail;
