import React from 'react';

const MyComplaints = () => {
  const complaints = [
    { id: 1, type: 'Facility', description: 'Broken desk', status: 'Resolved', date: '2023-10-01' },
    { id: 2, type: 'Academic', description: 'Grade issue', status: 'In Progress', date: '2023-10-05' }
  ];

  return (
    <div className="menu-content">
      <h1>My Complaints</h1>
      <ul>
        {complaints.map(complaint => (
          <li key={complaint.id}>
            <h3>{complaint.type}</h3>
            <p>{complaint.description}</p>
            <p>Status: {complaint.status}</p>
            <p>Date: {complaint.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComplaints;
