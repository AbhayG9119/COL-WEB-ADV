import React, { useState, useEffect } from 'react';

// Static sample data for circulars
const sampleCirculars = [
  {
    circular_id: 'CR2025-001',
    title: 'Mid-Sem Exam Schedule',
    description: 'Exams begin Nov 10. See attached PDF for full timetable.',
    issued_by: 'Admin',
    date: '2025-10-28',
    category: 'Exam',
    attachment: 'exam_schedule.pdf',
    is_new: true
  },
  {
    circular_id: 'CR2025-002',
    title: 'Diwali Holiday Notice',
    description: 'School closed on 15th Oct for Diwali celebrations.',
    issued_by: 'Principal',
    date: '2025-10-10',
    category: 'Holiday',
    attachment: '',
    is_new: false
  },
  {
    circular_id: 'CR2025-003',
    title: 'Annual Sports Day Event',
    description: 'Annual Sports Day on 25th Oct. All students participate.',
    issued_by: 'Sports Committee',
    date: '2025-10-15',
    category: 'Event',
    attachment: 'sports_day.pdf',
    is_new: true
  },
  {
    circular_id: 'CR2025-004',
    title: 'General Assembly Meeting',
    description: 'Monthly general assembly on 5th Nov.',
    issued_by: 'Admin',
    date: '2025-10-20',
    category: 'General',
    attachment: '',
    is_new: false
  }
];

// Category icons
const categoryIcons = {
  Exam: '📝',
  Holiday: '🎉',
  Event: '📅',
  General: '📢'
};

const Circulars = () => {
  const [circulars] = useState(sampleCirculars);
  const [filteredCirculars, setFilteredCirculars] = useState([]);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    let filtered = [...circulars];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(circular => circular.category === filters.category);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(circular => circular.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(circular => circular.date <= filters.dateTo);
    }

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredCirculars(filtered);
  }, [circulars, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (circular) => {
    setSelectedCircular(circular);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCircular(null);
    setShowModal(false);
  };

  const downloadAttachment = (attachment) => {
    if (attachment) {
      // Simulate download (in real app, use actual URL)
      const link = document.createElement('a');
      link.href = `#`; // Placeholder
      link.download = attachment;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="menu-content" style={{ padding: '20px' }}>
      <h1>Circulars / Notices</h1>

      {/* CircularFilterBar */}
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="Exam">Exam</option>
          <option value="Holiday">Holiday</option>
          <option value="Event">Event</option>
          <option value="General">General</option>
        </select>
        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
          placeholder="From Date"
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          aria-label="Filter from date"
        />
        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
          placeholder="To Date"
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          aria-label="Filter to date"
        />
        <button
          onClick={() => setFilters({ category: '', dateFrom: '', dateTo: '' })}
          style={{ padding: '8px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          Reset Filters
        </button>
      </div>

      {/* CircularList */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredCirculars.length > 0 ? (
          filteredCirculars.map(circular => (
            <div
              key={circular.circular_id}
              onClick={() => openModal(circular)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
              aria-label={`View details for ${circular.title}`}
            >
              {circular.is_new && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#ff5722',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  New
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>{categoryIcons[circular.category]}</span>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{circular.title}</h3>
              </div>
              <p style={{ margin: '5px 0', color: '#666' }}><strong>Issued By:</strong> {circular.issued_by}</p>
              <p style={{ margin: '5px 0', color: '#666' }}><strong>Date:</strong> {circular.date}</p>
              <span style={{
                display: 'inline-block',
                backgroundColor: '#e0e0e0',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {circular.category}
              </span>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            <span style={{ fontSize: '48px' }}>📄</span>
            <p>No circulars found matching the filters.</p>
          </div>
        )}
      </div>

      {/* CircularDetailModal */}
      {showModal && selectedCircular && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '80%',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title">{selectedCircular.title}</h2>
            <p><strong>Issued By:</strong> {selectedCircular.issued_by}</p>
            <p><strong>Date:</strong> {selectedCircular.date}</p>
            <p><strong>Description:</strong> {selectedCircular.description}</p>
            {selectedCircular.attachment && (
              <div style={{ marginTop: '20px' }}>
                <h3>Attachment</h3>
                <button
                  onClick={() => downloadAttachment(selectedCircular.attachment)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  aria-label={`Download ${selectedCircular.attachment}`}
                >
                  Download {selectedCircular.attachment}
                </button>
              </div>
            )}
            <button
              onClick={closeModal}
              style={{
                marginTop: '20px',
                padding: '8px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circulars;
