import React, { useState, useEffect, useCallback } from 'react';
import { staffApi } from '../../services/adminApi';

const StaffAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffList, setStaffList] = useState([]);

  const [attendance, setAttendance] = useState({});
  const [originalAttendance, setOriginalAttendance] = useState({});
  const [savedAttendanceRecords, setSavedAttendanceRecords] = useState({});
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState({});
  const [showSavedRecords, setShowSavedRecords] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Mock staff list for demonstration
      const mockStaff = [
        { id: 1, full_name: 'John Doe', designation_name: 'Teacher' },
        { id: 2, full_name: 'Jane Smith', designation_name: 'Principal' },
        { id: 3, full_name: 'Bob Johnson', designation_name: 'Clerk' },
        { id: 4, full_name: 'Alice Brown', designation_name: 'Librarian' },
        { id: 5, full_name: 'Charlie Wilson', designation_name: 'Peon' }
      ];
      setStaffList(mockStaff);

      // Mock leave data for demonstration
      const mockLeaves = [
        {
          id: 1,
          staff_id: 1,
          start_date: '2024-10-01',
          end_date: '2024-10-01',
          status: 'pending',
          reason: 'Medical leave'
        },
        {
          id: 2,
          staff_id: 2,
          start_date: '2024-10-02',
          end_date: '2024-10-03',
          status: 'approved',
          reason: 'Family emergency'
        },
        {
          id: 3,
          staff_id: 3,
          start_date: '2024-10-01',
          end_date: '2024-10-01',
          status: 'rejected',
          reason: 'Vacation'
        }
      ];
      setLeaveRequests(mockLeaves);
    };
    fetchData();
  }, []);

  const fetchAttendance = useCallback(async () => {
    // Mock attendance data for demonstration
    const mockAttendance = {};
    staffList.forEach(staff => {
      const leaveForDate = leaveRequests.find(leave =>
        leave.staff_id === staff.id &&
        leave.status === 'approved' &&
        new Date(leave.start_date) <= new Date(date) &&
        new Date(leave.end_date) >= new Date(date)
      );
      if (leaveForDate) {
        mockAttendance[staff.id] = 'Leave';
      } else {
        // Random attendance for demo
        const random = Math.random();
        if (random < 0.6) {
          mockAttendance[staff.id] = 'Present';
        } else if (random < 0.8) {
          mockAttendance[staff.id] = 'Absent';
        } else {
          mockAttendance[staff.id] = 'Leave';
        }
      }
    });
    setAttendance(mockAttendance);
    setOriginalAttendance({ ...mockAttendance });
  }, [staffList, date, leaveRequests]);

  useEffect(() => {
    if (staffList.length > 0) {
      fetchAttendance();
    }
  }, [date, staffList, fetchAttendance]);

  const handleToggle = (staffId) => {
    setAttendance(prev => ({
      ...prev,
      [staffId]: prev[staffId] === 'Present' ? 'Absent' : (prev[staffId] === 'Absent' ? 'Leave' : 'Present')
    }));
  };

  const handleLeaveAction = async (leaveId, status) => {
    setLeaveLoading(prev => ({ ...prev, [leaveId]: true }));
    const result = await staffApi.updateLeaveStatus(leaveId, status);
    if (result.success) {
      setLeaveRequests(prev => prev.map(leave =>
        leave.id === leaveId ? { ...leave, status } : leave
      ));
      setMessage(`Leave ${status} successfully`);
      setTimeout(() => setMessage(''), 3000);
      // Refresh attendance to reflect leave changes
      fetchAttendance();
    } else {
      setMessage('Failed to update leave status');
      setTimeout(() => setMessage(''), 3000);
    }
    setLeaveLoading(prev => ({ ...prev, [leaveId]: false }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Mock save attendance - store in saved records
    setTimeout(() => {
      setSavedAttendanceRecords(prev => ({
        ...prev,
        [date]: { ...attendance, savedAt: new Date().toISOString() }
      }));
      setOriginalAttendance({ ...attendance });
      setLoading(false);
      setMessage('Attendance saved successfully');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const hasChanges = () => {
    return JSON.stringify(attendance) !== JSON.stringify(originalAttendance);
  };

  return (
    <div className="menu-content">
      <h1>Staff Attendance</h1>
      <p>Manage staff attendance records.</p>

      {/* Toggle between marking and viewing saved attendance */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowSavedRecords(false)}
          style={{
            backgroundColor: !showSavedRecords ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Mark Attendance
        </button>
        <button
          onClick={() => setShowSavedRecords(true)}
          style={{
            backgroundColor: showSavedRecords ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          View Saved Attendance
        </button>
      </div>

      {!showSavedRecords ? (
        <>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Staff Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Designation</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Leave Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Attendance Status</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(staff => {
            const leaveForDate = leaveRequests.find(leave =>
              leave.staff_id === staff.id &&
              new Date(leave.start_date) <= new Date(date) &&
              new Date(leave.end_date) >= new Date(date)
            );
            return (
              <tr key={staff.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{staff.full_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{staff.designation_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {leaveForDate ? (
                    <div>
                      <span style={{ color: leaveForDate.status === 'approved' ? 'green' : leaveForDate.status === 'rejected' ? 'red' : 'orange' }}>
                        {leaveForDate.status}
                      </span>
                      {leaveForDate.status === 'pending' && (
                        <div style={{ marginTop: '5px' }}>
                          <button
                            onClick={() => handleLeaveAction(leaveForDate.id, 'approved')}
                            disabled={leaveLoading[leaveForDate.id]}
                            style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '2px 5px', marginRight: '5px', cursor: 'pointer' }}
                          >
                            {leaveLoading[leaveForDate.id] ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleLeaveAction(leaveForDate.id, 'rejected')}
                            disabled={leaveLoading[leaveForDate.id]}
                            style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '2px 5px', cursor: 'pointer' }}
                          >
                            {leaveLoading[leaveForDate.id] ? '...' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    'No leave'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleToggle(staff.id)}
                    style={{
                      backgroundColor: attendance[staff.id] === 'Present' ? 'green' : attendance[staff.id] === 'Leave' ? 'blue' : 'red',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    {attendance[staff.id]}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        disabled={!hasChanges() || loading}
        style={{
          marginTop: '20px',
          backgroundColor: hasChanges() ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: hasChanges() ? 'pointer' : 'not-allowed',
          fontSize: '16px'
        }}
      >
        {loading ? 'Saving...' : 'Save Attendance'}
      </button>
      {message && <div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
        </>
      ) : (
        <div>
          <h3>Saved Attendance Records</h3>
          <div style={{ marginBottom: '20px' }}>
            <label>Select Date to View:</label>
            <input
              type="date"
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </div>

          {savedAttendanceRecords[viewDate] ? (
            <div>
              <p><strong>Saved on:</strong> {new Date(savedAttendanceRecords[viewDate].savedAt).toLocaleString()}</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Staff Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Designation</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(staff => (
                    <tr key={staff.id}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{staff.full_name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{staff.designation_name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <span
                          style={{
                            backgroundColor: savedAttendanceRecords[viewDate][staff.id] === 'Present' ? 'green' : savedAttendanceRecords[viewDate][staff.id] === 'Leave' ? 'blue' : 'red',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '3px'
                          }}
                        >
                          {savedAttendanceRecords[viewDate][staff.id] || 'Not Marked'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No attendance records found for {viewDate}</p>
          )}

          <div style={{ marginTop: '20px' }}>
            <h4>All Saved Dates:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.keys(savedAttendanceRecords).map(date => (
                <button
                  key={date}
                  onClick={() => setViewDate(date)}
                  style={{
                    backgroundColor: viewDate === date ? '#007bff' : '#f8f9fa',
                    color: viewDate === date ? 'white' : 'black',
                    border: '1px solid #ddd',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendance;
