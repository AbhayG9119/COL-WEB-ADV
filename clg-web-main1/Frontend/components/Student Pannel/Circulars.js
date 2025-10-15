import React from 'react';

const Circulars = () => {
  const notices = [
    { id: 1, title: 'Holiday Notice', date: '2023-10-10', content: 'School closed on 15th Oct for Diwali.' },
    { id: 2, title: 'Exam Schedule', date: '2023-10-12', content: 'Mid-term exams start from 20th Oct.' }
  ];

  return (
    <div className="menu-content">
      <h1>Circulars / Notices</h1>
      <ul>
        {notices.map(notice => (
          <li key={notice.id}>
            <h3>{notice.title}</h3>
            <p>Date: {notice.date}</p>
            <p>{notice.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Circulars;
