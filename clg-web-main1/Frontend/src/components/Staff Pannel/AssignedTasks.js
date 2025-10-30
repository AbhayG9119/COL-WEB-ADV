import React, { useState, useEffect } from 'react';

// Hardcoded user role for testing (can be replaced with actual auth)
const userRole = 'faculty'; // Options: 'admin', 'faculty', 'student'

// Mock data for assigned tasks
const mockTasks = [
  {
    id: 1,
    title: 'Prepare Semester Syllabus',
    assignedBy: 'Admin',
    assignedOn: '2023-10-01',
    dueDate: '2023-10-15',
    status: 'Pending',
    category: 'Academic',
    description: 'Create detailed syllabus for upcoming semester.',
    assignedTo: 'faculty', // Role or specific user; for simplicity, role-based
    progress: 0,
    updates: []
  },
  {
    id: 2,
    title: 'Organize Workshop',
    assignedBy: 'Admin',
    assignedOn: '2023-10-05',
    dueDate: '2023-10-20',
    status: 'Submitted',
    category: 'Event',
    description: 'Plan and execute coding workshop for students.',
    assignedTo: 'faculty',
    progress: 50,
    updates: [
      { message: 'Report submitted by Faculty – 10 Oct', timestamp: '2023-10-10' },
      { message: 'Reviewed by Admin – 12 Oct', timestamp: '2023-10-12' }
    ]
  },
  {
    id: 3,
    title: 'Update Student Records',
    assignedBy: 'Admin',
    assignedOn: '2023-10-08',
    dueDate: '2023-10-18',
    status: 'Completed',
    category: 'Admin',
    description: 'Verify and update student database.',
    assignedTo: 'faculty',
    progress: 100,
    updates: [
      { message: 'Report submitted by Faculty – 15 Oct', timestamp: '2023-10-15' },
      { message: 'Marked Completed by Admin – 16 Oct', timestamp: '2023-10-16' }
    ]
  },
  {
    id: 4,
    title: 'Admin Task: Audit Finances',
    assignedBy: 'Principal',
    assignedOn: '2023-10-10',
    dueDate: '2023-10-25',
    status: 'Pending',
    category: 'Admin',
    description: 'Conduct financial audit for the quarter.',
    assignedTo: 'admin',
    progress: 0,
    updates: []
  }
];

const AssignedTasks = () => {
  const [tasks] = useState(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [filters, setFilters] = useState({
    category: '',
    fromDate: '',
    toDate: ''
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    let filtered = tasks;

    // Role-based filtering: Admins see all, others see own tasks
    if (userRole !== 'admin') {
      filtered = filtered.filter(task => task.assignedTo === userRole);
    }

    if (filters.category) {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    if (filters.fromDate && filters.toDate) {
      filtered = filtered.filter(task => task.assignedOn >= filters.fromDate && task.assignedOn <= filters.toDate);
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const openSubmitModal = (task) => {
    setSelectedTask(task);
    setIsSubmitModalOpen(true);
    setRemarks('');
    setUploadedFile(null);
  };

  const closeSubmitModal = () => {
    setSelectedTask(null);
    setIsSubmitModalOpen(false);
  };

  const openTrackModal = (task) => {
    setSelectedTask(task);
    setIsTrackModalOpen(true);
  };

  const closeTrackModal = () => {
    setSelectedTask(null);
    setIsTrackModalOpen(false);
  };

  const handleSubmitReport = () => {
    // Simulate submission
    alert(`Report submitted for task: ${selectedTask.title}. Remarks: ${remarks}. File: ${uploadedFile ? uploadedFile.name : 'None'}`);
    // In real app, update task status to 'Submitted', add update to timeline
    closeSubmitModal();
  };

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const refreshStatus = () => {
    // Simulate refresh
    alert('Status refreshed!');
  };

  return (
    <div className="menu-content">
      <h1>Your Assigned Tasks</h1>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        >
          <option value="">All Categories</option>
          <option value="Academic">Academic</option>
          <option value="Admin">Admin</option>
          <option value="Event">Event</option>
          <option value="Misc">Misc</option>
        </select>
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
          placeholder="From Date"
          style={{ marginRight: '10px' }}
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
          placeholder="To Date"
          style={{ marginRight: '10px' }}
        />
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Assigned By</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Assigned On</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Due Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.assignedBy}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.assignedOn}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.dueDate}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button onClick={() => openSubmitModal(task)}>View / Submit</button>
                  <button onClick={() => openTrackModal(task)} style={{ marginLeft: '10px' }}>Track Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks assigned yet.</p>
      )}

      {/* Submit Work Report Modal */}
      {isSubmitModalOpen && selectedTask && (
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
            <h2>{selectedTask.title}</h2>
            <p><strong>Assigned By:</strong> {selectedTask.assignedBy}</p>
            <p><strong>Assigned On:</strong> {selectedTask.assignedOn}</p>
            <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <div style={{ marginTop: '20px' }}>
              <label>File Upload (PDF, DOCX, PNG, JPG):</label>
              <input type="file" accept=".pdf,.docx,.png,.jpg" onChange={handleFileUpload} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Remarks / Summary:</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows="4"
                style={{ width: '100%' }}
              />
            </div>
            <button onClick={handleSubmitReport} style={{ marginTop: '20px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '4px' }}>
              Submit Report
            </button>
            <button onClick={closeSubmitModal} style={{ marginTop: '10px', marginLeft: '10px' }}>Close</button>
          </div>
        </div>
      )}

      {/* Track Task Status Modal */}
      {isTrackModalOpen && selectedTask && (
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
            <h2>Task Progress: {selectedTask.title}</h2>
            <div style={{ marginBottom: '20px' }}>
              <label>Progress: {selectedTask.progress}%</label>
              <div style={{
                width: '100%',
                backgroundColor: '#f3f3f3',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${selectedTask.progress}%`,
                  backgroundColor: '#28a745',
                  height: '20px'
                }}></div>
              </div>
            </div>
            <h3>Timeline</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedTask.updates.map((update, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  {update.message} - {update.timestamp}
                </li>
              ))}
            </ul>
            <button onClick={refreshStatus} style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px' }}>
              Refresh Status
            </button>
            <button onClick={closeTrackModal} style={{ marginTop: '10px', marginLeft: '10px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
