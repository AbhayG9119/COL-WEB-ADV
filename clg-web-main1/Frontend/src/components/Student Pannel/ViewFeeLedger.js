import React, { useState, useMemo } from 'react';

const FeesLedgerSection = ({ feeLedger = [], filters: propFilters, setFilters: propSetFilters }) => {
  const [localFilters, setLocalFilters] = useState({ feeType: '', dateRange: { start: '', end: '' } });
  const [classFilter, setClassFilter] = useState(''); // Optional for multi-class

  const filters = propFilters || localFilters;
  const setFilters = propSetFilters || setLocalFilters;

  // Filtered and sorted ledger (recent first)
  const filteredLedger = useMemo(() => {
    if (!feeLedger || !Array.isArray(feeLedger) || !filters) return [];
    let filtered = feeLedger.filter(fee => {
      const matchesFeeType = !filters.feeType || fee.fee_type === filters.feeType;
      const matchesDate = (!filters.dateRange.start || new Date(fee.date) >= new Date(filters.dateRange.start)) &&
                          (!filters.dateRange.end || new Date(fee.date) <= new Date(filters.dateRange.end));
      return matchesFeeType && matchesDate;
    });
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [feeLedger, filters]);

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

  const getStatusBadge = (status) => {
    const classes = {
      Paid: 'badge paid',
      Pending: 'badge pending',
      Overdue: 'badge overdue'
    };
    return <span className={classes[status] || 'badge'}>{status}</span>;
  };

  return (
    <div className="fees-ledger-section">
      <h2>View Fees Ledger</h2>

      {/* Filters */}
      <div className="filter-bar">
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
        {/* Optional Class Dropdown */}
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="">All Classes</option>
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
        </select>
      </div>

      {/* Ledger Table */}
      {filteredLedger.length > 0 ? (
        <table className="fees-table" role="table" aria-label="Fees Ledger">
          <thead>
            <tr>
              <th>Transaction Date</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLedger.map(fee => (
              <tr key={fee.transaction_id} title={`Receipt ID: ${fee.transaction_id}`}>
                <td>{fee.date}</td>
                <td>{fee.fee_type}</td>
                <td>₹{fee.amount}</td>
                <td>{fee.payment_mode}</td>
                <td>{getStatusBadge(fee.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No fee records found</p>
        </div>
      )}
    </div>
  );
};

export default FeesLedgerSection;
