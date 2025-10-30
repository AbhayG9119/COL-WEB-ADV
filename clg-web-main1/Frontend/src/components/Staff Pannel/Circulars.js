import React, { useState, useEffect } from 'react';

// Hardcoded user role for testing (can be replaced with actual auth)
const userRole = 'student'; // Options: 'admin', 'faculty', 'student'

// Mock data for notices with enhanced attachments
const mockNotices = [
  {
    id: 1,
    title: 'Holiday Notice',
    date: '2023-10-10',
    issuedBy: 'Principal',
    category: 'Academic',
    description: 'School closed on 15th Oct for Diwali.',
    tags: ['student', 'faculty', 'admin'], // Visible to all
    attachments: [
      { name: 'Holiday_Schedule.pdf', url: '#', size: '1.2 MB', type: 'pdf' },
      { name: 'Diwali_Notice.docx', url: '#', size: '0.8 MB', type: 'docx' }
    ]
  },
  {
    id: 2,
    title: 'Exam Schedule',
    date: '2023-10-12',
    issuedBy: 'Exam Controller',
    category: 'Admin',
    description: 'Mid-term exams start from 20th Oct.',
    tags: ['student', 'faculty', 'admin'], // Visible to all
    attachments: [
      { name: 'Exam_Timetable.pdf', url: '#', size: '2.5 MB', type: 'pdf' }
    ]
  },
  {
    id: 3,
    title: 'Sports Day Event',
    date: '2023-10-15',
    issuedBy: 'Sports Committee',
    category: 'Events',
    description: 'Annual Sports Day on 25th Oct.',
    tags: ['student', 'faculty', 'admin'], // Visible to all
    attachments: []
  },
  {
    id: 4,
    title: 'Faculty Meeting Minutes',
    date: '2023-10-16',
    issuedBy: 'Dean',
    category: 'Admin',
    description: 'Internal faculty meeting notes.',
    tags: ['faculty', 'admin'], // Only faculty and admin
    attachments: [
      { name: 'Meeting_Minutes.docx', url: '#', size: '1.5 MB', type: 'docx' },
      { name: 'Agenda.pdf', url: '#', size: '0.5 MB', type: 'pdf' }
    ]
  }
];

const Circulars = () => {
  const [notices] = useState(mockNotices);
  const [filteredNotices, setFilteredNotices] = useState(mockNotices);
  const [filters, setFilters] = useState({
    date: '',
    category: '',
    search: ''
  });
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let filtered = notices;

    // Role-based filtering: Only show notices tagged for the user's role
    filtered = filtered.filter(notice => notice.tags.includes(userRole));

    if (filters.date) {
      filtered = filtered.filter(notice => notice.date === filters.date);
    }

    if (filters.category) {
      filtered = filtered.filter(notice => notice.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredNotices(filtered);
  }, [notices, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const openModal = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNotice(null);
    setIsModalOpen(false);
  };

  const downloadAttachment = (url, name) => {
    // Actual download implementation
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAttachments = (attachments) => {
    attachments.forEach(attachment => {
      downloadAttachment(attachment.url, attachment.name);
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📄';
      case 'png': return '🖼️';
      default: return '📎';
    }
  };

  return (
    <div className="menu-content">
      <h1>Official Circulars / Notices</h1>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          placeholder="Filter by date"
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by title/keyword"
          style={{ marginRight: '10px' }}
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        >
          <option value="">All Categories</option>
          <option value="Academic">Academic</option>
          <option value="Admin">Admin</option>
          <option value="Events">Events</option>
        </select>
      </div>

      {/* Notices Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Issued By</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotices.map(notice => (
            <tr key={notice.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{notice.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{notice.date}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{notice.issuedBy}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{notice.category}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => openModal(notice)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Details */}
      {isModalOpen && selectedNotice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '80%',
            overflowY: 'auto'
          }}>
            <h2>{selectedNotice.title}</h2>
            <p><strong>Date:</strong> {selectedNotice.date}</p>
            <p><strong>Issued By:</strong> {selectedNotice.issuedBy}</p>
            <p><strong>Description:</strong> {selectedNotice.description}</p>
            {selectedNotice.attachments.length > 0 && (
              <div>
                <h3>Attached Files</h3>
                {selectedNotice.attachments.length > 1 && (
                  <button
                    onClick={() => downloadAllAttachments(selectedNotice.attachments)}
                    style={{ marginBottom: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                  >
                    Download All
                  </button>
                )}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedNotice.attachments.map((attachment, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ marginRight: '10px' }}>{getFileIcon(attachment.type)}</span>
                      <span
                        title={`File type: ${attachment.type.toUpperCase()}, Size: ${attachment.size}`}
                        style={{ cursor: 'pointer', flexGrow: 1 }}
                        onClick={() => downloadAttachment(attachment.url, attachment.name)}
                      >
                        {attachment.name} ({attachment.size})
                      </span>
                      <button
                        onClick={() => downloadAttachment(attachment.url, attachment.name)}
                        style={{ marginLeft: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px' }}
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={closeModal} style={{ marginTop: '20px' }}>Ka file hai dekhe?</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circulars;
