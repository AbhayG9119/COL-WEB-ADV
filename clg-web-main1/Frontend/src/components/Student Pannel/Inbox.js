import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inbox.css';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [currentPage]);

  const fetchMessages = async () => {
    setLoading(true);
    // Mock data for demonstration
    const mockMessages = [
      {
        _id: '1',
        subject: 'Welcome to the new semester!',
        content: 'Dear student, welcome to the new semester. Please check your timetable and assignments.',
        senderId: { name: 'Principal Smith' },
        createdAt: new Date().toISOString(),
        isRead: false
      },
      {
        _id: '2',
        subject: 'Assignment Due Reminder',
        content: 'Your math assignment is due tomorrow. Please submit it on time.',
        senderId: { name: 'Mr. Johnson' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isRead: true
      },
      {
        _id: '3',
        subject: 'Exam Schedule Update',
        content: 'The science exam has been rescheduled to next Friday.',
        senderId: { name: 'Mrs. Davis' },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        isRead: false
      }
    ];
    setMessages(mockMessages);
    setTotalPages(1);
    setLoading(false);
    // Uncomment below for real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
    //   const res = await axios.get(`/api/staff/messages/inbox?page=${currentPage}&limit=${messagesPerPage}`, config);
    //   setMessages(res.data.messages);
    //   setTotalPages(res.data.totalPages);
    // } catch (error) {
    //   console.error('Error fetching messages:', error);
    //   toast.error('Failed to load messages');
    // }
    // setLoading(false);
  };

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/staff/messages/${messageId}/read`, {}, config);
      setMessages(messages.map(msg => msg._id === messageId ? { ...msg, isRead: true } : msg));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="inbox">
      <h1>Inbox</h1>
      <p>View your received messages.</p>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <>
          <div className="messages-list">
            {messages.length === 0 ? (
              <p>No messages found.</p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg._id}
                  className={`message-item ${msg.isRead ? 'read' : 'unread'}`}
                  onClick={() => openMessage(msg)}
                >
                  <div className="message-header">
                    <strong>{msg.subject}</strong>
                    <span className="sender">From: {msg.senderId?.name || 'Unknown'}</span>
                    <span className="timestamp">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="message-preview">
                    {msg.content.substring(0, 100)}...
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedMessage && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedMessage.subject}</h2>
              <button onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>From:</strong> {selectedMessage.senderId?.name || 'Unknown'}</p>
              <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
              <div dangerouslySetInnerHTML={{ __html: selectedMessage.content }} />
            </div>
            <div className="modal-footer">
              <button onClick={closeModal}>Close</button>
              {/* Reply button if enabled */}
              {/* <button onClick={() => handleReply(selectedMessage)}>Reply</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
