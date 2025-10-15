import React from 'react';

const Attendance = () => {
  const attendance = [
    { date: '2023-10-01', status: 'Present' },
    { date: '2023-10-02', status: 'Absent' },
    { date: '2023-10-03', status: 'Present' }
  ];

  return (
    <div className="menu-content">
      <h1>Attendance</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
