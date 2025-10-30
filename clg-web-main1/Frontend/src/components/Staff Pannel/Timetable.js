import React, { useState } from 'react';

// Mock data for timetable (Faculty auto-load own schedule)
const mockTimetable = {
  Monday: [
    { period: 1, time: '9:00-10:00', subject: 'Math', faculty: 'Dr. Smith', room: '101', class: 'Class A', duration: '1 hour' },
    { period: 2, time: '10:00-11:00', subject: 'Physics', faculty: 'Dr. Smith', room: '102', class: 'Class B', duration: '1 hour' },
    { period: 3, time: '11:00-12:00', subject: 'Chemistry', faculty: 'Dr. Smith', room: '103', class: 'Class C', duration: '1 hour' },
    { period: 4, time: '12:00-1:00', subject: 'Biology', faculty: 'Dr. Smith', room: '104', class: 'Class D', duration: '1 hour' },
    { period: 5, time: '2:00-3:00', subject: 'English', faculty: 'Dr. Smith', room: '105', class: 'Class E', duration: '1 hour' },
    { period: 6, time: '3:00-4:00', subject: 'History', faculty: 'Dr. Smith', room: '106', class: 'Class F', duration: '1 hour' },
    { period: 7, time: '4:00-5:00', subject: 'Geography', faculty: 'Dr. Smith', room: '107', class: 'Class G', duration: '1 hour' },
    { period: 8, time: '5:00-6:00', subject: 'Computer Science', faculty: 'Dr. Smith', room: '108', class: 'Class H', duration: '1 hour' },
  ],
  Tuesday: [
    { period: 1, time: '9:00-10:00', subject: 'Math', faculty: 'Dr. Smith', room: '101', class: 'Class A', duration: '1 hour' },
    { period: 2, time: '10:00-11:00', subject: 'Physics', faculty: 'Dr. Smith', room: '102', class: 'Class B', duration: '1 hour' },
    // Add more as needed
  ],
  // Add other days similarly
};

const Timetable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [selectedDay, setSelectedDay] = useState('Monday'); // For demo, map date to day
  const [timetable, setTimetable] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Mock fetch based on day (since no API)
  const fetchTimetable = () => {
    const day = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    setSelectedDay(day);
    setTimetable(mockTimetable[day] || []);
  };

  const handleRowClick = (period) => {
    setSelectedPeriod(period);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPeriod(null);
  };

  return (
    <div className="timetable">
      <h1>Timetable</h1>
      <div className="date-picker">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div className="fetch-button">
        <button onClick={fetchTimetable}>Fetch Timetable</button>
      </div>
      <div className="timetable-view">
        <h2>{selectedDay}'s Schedule</h2>
        {timetable.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Period No.</th>
                <th>Time Slot</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((slot, index) => (
                <tr key={index} onClick={() => handleRowClick(slot)} style={{ cursor: 'pointer' }}>
                  <td>{slot.period}</td>
                  <td>{slot.time}</td>
                  <td>{slot.subject}</td>
                  <td>{slot.faculty}</td>
                  <td>{slot.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classes scheduled for {selectedDay}.</p>
        )}
      </div>
      {showModal && selectedPeriod && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Period Details</h2>
            <p><strong>Period No.:</strong> {selectedPeriod.period}</p>
            <p><strong>Time:</strong> {selectedPeriod.time}</p>
            <p><strong>Subject:</strong> {selectedPeriod.subject}</p>
            <p><strong>Class:</strong> {selectedPeriod.class}</p>
            <p><strong>Faculty:</strong> {selectedPeriod.faculty}</p>
            <p><strong>Room:</strong> {selectedPeriod.room}</p>
            <p><strong>Duration:</strong> {selectedPeriod.duration}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
