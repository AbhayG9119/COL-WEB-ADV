import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay]);

  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`/api/staff/timetable?day=${selectedDay}`, config);
      setTimetable(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return <div>Loading timetable...</div>;
  }

  return (
    <div className="timetable">
      <h1>Timetable</h1>
      <div className="day-selector">
        <label>Select Day:</label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {days.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
      </div>
      <div className="timetable-view">
        <h2>{selectedDay}'s Schedule</h2>
        {timetable.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map(slot => (
                <tr key={slot._id}>
                  <td>{slot.period}</td>
                  <td>{slot.class}</td>
                  <td>{slot.subject}</td>
                  <td>{slot.time}</td>
                  <td>{slot.room || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classes scheduled for {selectedDay}.</p>
        )}
      </div>
    </div>
  );
};

export default Timetable;
