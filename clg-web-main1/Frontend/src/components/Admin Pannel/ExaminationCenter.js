import React, { useState } from 'react';

const ExaminationCenter = () => {
  const [studentId, setStudentId] = useState('');
  const [examName, setExamName] = useState('');
  const [centerName, setCenterName] = useState('');
  const [centerAddress, setCenterAddress] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [confirmation, setConfirmation] = useState('');

  // Mock data
  const mockExams = ['Midterm Exam', 'Final Exam'];
  const mockCenters = {
    'Center A': '123 Main St, City',
    'Center B': '456 Elm St, City',
  };

  const handleCenterChange = (e) => {
    const center = e.target.value;
    setCenterName(center);
    setCenterAddress(mockCenters[center] || '');
  };

  const handleSave = () => {
    // Mock save
    setConfirmation(`Mapping saved for Student ${studentId} to ${centerName}`);
  };

  return (
    <div className="menu-content">
      <h1>Assign Examination Center</h1>
      <form>
        <div>
          <label htmlFor="center-assign-student-id">Student ID</label>
          <input
            id="center-assign-student-id"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
          />
        </div>
        <div>
          <label htmlFor="center-assign-exam">Exam Name</label>
          <select id="center-assign-exam" value={examName} onChange={(e) => setExamName(e.target.value)}>
            <option value="">Select Exam</option>
            {mockExams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="center-assign-center">Center Name</label>
          <select id="center-assign-center" value={centerName} onChange={handleCenterChange}>
            <option value="">Select Center</option>
            {Object.keys(mockCenters).map(center => <option key={center} value={center}>{center}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="center-assign-address">Center Address</label>
          <input id="center-assign-address" type="text" value={centerAddress} readOnly />
        </div>
        <div>
          <label htmlFor="center-assign-room">Room No</label>
          <input
            id="center-assign-room"
            type="text"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <button type="button" onClick={handleSave}>Save</button>
        {confirmation && <p>{confirmation}</p>}
      </form>
    </div>
  );
};

export default ExaminationCenter;
