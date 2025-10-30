import React, { useState, useMemo } from 'react';

const NoticeBoard = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    dateRange: { start: '', end: '' },
    search: ''
  });

  // Sample notices data
  const notices = useMemo(() => [
    {
      notice_id: 'NTC2025-001',
      title: 'Mid-Sem Exam Schedule',
      description: 'Exams begin Nov 10. See attached PDF for full timetable.',
      issued_by: 'Admin',
      date: '2025-10-28',
      category: 'Exam',
      attachment: 'exam_schedule.pdf',
      is_new: true,
      target_audience: 'All Students'
    },
    {
      notice_id: 'NTC2025-002',
      title: 'Holiday Notice - Diwali',
      description: 'College will remain closed from Nov 1-5 for Diwali celebrations.',
      issued_by: 'Principal',
      date: '2025-10-25',
      category: 'Holiday',
      attachment: null,
      is_new: true,
      target_audience: 'All Students'
    },
    {
      notice_id: 'NTC2025-003',
      title: 'Placement Drive - TCS',
      description: 'TCS recruitment drive scheduled for Nov 15. Register by Nov 10.',
      issued_by: 'Placement Officer',
      date: '2025-10-20',
      category: 'Placement',
      attachment: 'tcs_placement_details.pdf',
      is_new: false,
      target_audience: 'Final Year Students'
    },
    {
      notice_id: 'NTC2025-004',
      title: 'Annual Sports Day',
      description: 'Sports day will be held on Dec 5. Participation mandatory for all.',
      issued_by: 'Sports Committee',
      date: '2025-10-15',
      category: 'Event',
      attachment: 'sports_day_schedule.pdf',
      is_new: false,
      target_audience: 'All Students'
    },
    {
      notice_id: 'NTC2025-005',
      title: 'Fee Payment Reminder',
      description: 'Last date for fee payment is Oct 31. Late fees will apply.',
      issued_by: 'Accounts Department',
      date: '2025-10-10',
      category: 'General',
      attachment: null,
      is_new: false,
      target_audience: 'All Students'
    }
  ], []);

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      const matchesCategory = !filters.category || notice.category === filters.category;
      const matchesDate = (!filters.dateRange.start || new Date(notice.date) >= new Date(filters.dateRange.start)) &&
                          (!filters.dateRange.end || new Date(notice.date) <= new Date(filters.dateRange.end));
      const matchesSearch = !filters.search ||
        notice.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        notice.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesDate && matchesSearch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [notices, filters]);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotice(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' || name === 'search') {
      setFilters(prev => ({ ...prev, [name]: value }));
    } else if (name === 'startDate') {
      setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: value } }));
    } else if (name === 'endDate') {
      setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: value } }));
    }
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      dateRange: { start: '', end: '' },
      search: ''
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Exam: '📝',
      Holiday: '🎉',
      Event: '📅',
      General: '📢',
      Placement: '💼',
      Circular: '📄'
    };
    return icons[category] || '📄';
  };

  return (
    <div className="notice-board">
      <h1>Notice Board</h1>

      {/* Filter Bar */}
      <div className="filter-bar">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="Exam">Exam</option>
          <option value="Holiday">Holiday</option>
          <option value="Event">Event</option>
          <option value="General">General</option>
          <option value="Placement">Placement</option>
          <option value="Circular">Circular</option>
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

        <input
          type="text"
          name="search"
          placeholder="Search notices..."
          value={filters.search}
          onChange={handleFilterChange}
        />

        <button onClick={resetFilters} className="reset-btn">Reset</button>
      </div>

      {/* Notice List */}
      <div className="notice-list">
        {filteredNotices.length > 0 ? (
          filteredNotices.map(notice => (
            <div
              key={notice.notice_id}
              className={`notice-card ${notice.is_new ? 'new' : ''}`}
              onClick={() => handleNoticeClick(notice)}
            >
              <div className="notice-header">
                <span className="category-icon">{getCategoryIcon(notice.category)}</span>
                <h3>{notice.title}</h3>
                {notice.is_new && <span className="new-badge">New</span>}
              </div>
              <div className="notice-meta">
                <span className="issued-by">By: {notice.issued_by}</span>
                <span className="date">{notice.date}</span>
                <span className="category">{notice.category}</span>
              </div>
              <p className="notice-preview">
                {notice.description.length > 100
                  ? `${notice.description.substring(0, 100)}...`
                  : notice.description}
              </p>
              {notice.attachment && (
                <div className="attachment-indicator">
                  📎 Attachment available
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No notices found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {showModal && selectedNotice && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedNotice.title}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="notice-details">
                <div className="detail-row">
                  <strong>Issued By:</strong> {selectedNotice.issued_by}
                </div>
                <div className="detail-row">
                  <strong>Date:</strong> {selectedNotice.date}
                </div>
                <div className="detail-row">
                  <strong>Category:</strong> {selectedNotice.category}
                </div>
                <div className="detail-row">
                  <strong>Target Audience:</strong> {selectedNotice.target_audience}
                </div>
                <div className="detail-row">
                  <strong>Description:</strong>
                  <p>{selectedNotice.description}</p>
                </div>
                {selectedNotice.attachment && (
                  <div className="detail-row">
                    <strong>Attachment:</strong>
                    <button
                      className="download-btn"
                      onClick={() => alert(`Downloading ${selectedNotice.attachment}`)}
                    >
                      📄 Download {selectedNotice.attachment}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
