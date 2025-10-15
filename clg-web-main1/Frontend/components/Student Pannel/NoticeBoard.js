import React from 'react';

const NoticeBoard = () => {
  const notices = [
    { id: 1, title: 'Sports Day', content: 'Sports day on 20th Oct.', date: '2023-10-10' },
    { id: 2, title: 'Parent Meeting', content: 'Meeting on 25th Oct.', date: '2023-10-12' }
  ];

  return (
    <div className="menu-content">
      <h1>Notice Board</h1>
      <ul>
        {notices.map(notice => (
          <li key={notice.id}>
            <h3>{notice.title}</h3>
            <p>{notice.content}</p>
            <p>Date: {notice.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoard;
