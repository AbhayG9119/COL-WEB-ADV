import React, { useState, useMemo } from 'react';

const ReceiptDownloadSection = ({ receipts, filters: propFilters, setFilters: propSetFilters, selectedReceipt, setSelectedReceipt }) => {
  const [localFilters, setLocalFilters] = useState({ feeType: '', dateRange: { start: '', end: '' } });
  const [searchTerm, setSearchTerm] = useState(''); // Optional search

  const filters = propFilters || localFilters;
  const setFilters = propSetFilters || setLocalFilters;

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    if (!receipts || !Array.isArray(receipts)) return [];
    return receipts.filter(receipt => {
      const matchesFeeType = !filters.feeType || receipt.fee_type === filters.feeType;
      const matchesDate = (!filters.dateRange.start || new Date(receipt.date) >= new Date(filters.dateRange.start)) &&
                          (!filters.dateRange.end || new Date(receipt.date) <= new Date(filters.dateRange.end));
      const matchesSearch = !searchTerm || receipt.receipt_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            receipt.fee_type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFeeType && matchesDate && matchesSearch;
    });
  }, [receipts, filters, searchTerm]);

  const handleDownload = (receipt) => {
    // Simulate download - in real app, trigger file download
    console.log(`Downloading ${receipt.download_link}`);
    alert(`Downloading ${receipt.download_link}`);
    // For PDF/Image, assume PDF for now
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (typeof setFilters === 'function') {
      if (name === 'feeType') {
        setFilters(prev => ({ ...prev, feeType: value }));
      } else if (name === 'startDate') {
        setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: value } }));
      } else if (name === 'endDate') {
        setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: value } }));
      }
    }
  };

  return (
    <div className="receipt-download-section">
      <h2>Download Receipt</h2>

      {/* Optional Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by Receipt ID or Fee Type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select name="feeType" value={filters.feeType} onChange={handleFilterChange}>
          <option value="">All Fee Types</option>
          <option value="Tuition">Tuition</option>
          <option value="Hostel">Hostel</option>
          <option value="Exam">Exam</option>
        </select>
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={filters.dateRange.start}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={filters.dateRange.end}
          onChange={handleFilterChange}
        />
      </div>

      {/* Receipt List */}
      {filteredReceipts.length > 0 ? (
        <div className="receipt-list">
          {filteredReceipts.map(receipt => (
            <div key={receipt.receipt_id} className="receipt-card">
              <div className="receipt-info">
                <h3>Receipt Number: {receipt.receipt_id}</h3>
                <p><strong>Fee Type:</strong> {receipt.fee_type}</p>
                <p><strong>Amount:</strong> ₹{receipt.amount}</p>
                <p><strong>Date:</strong> {receipt.date}</p>
              </div>
              <button
                className="btn download-btn"
                onClick={() => handleDownload(receipt)}
                title="Download Receipt"
                aria-label={`Download receipt for ${receipt.fee_type}`}
              >
                📄 Download PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No receipts available</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptDownloadSection;
