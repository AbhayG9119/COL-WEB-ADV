import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/staff/messages', config);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !recipient) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/staff/messages', { content: newMessage, recipient }, config);
      setNewMessage('');
      setRecipient('');
      fetchMessages(); // Refresh
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setLoading(false);
  };

  return (
    <div className="messaging">
      <h1>Messaging</h1>
      <div className="send-message">
        <input
          type="text"
          placeholder="Recipient ID"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
      <div className="messages-list">
        <h2>Messages</h2>
        {messages.map(msg => (
          <div key={msg._id} className="message">
            <p><strong>From:</strong> {msg.sender}</p>
            <p>{msg.content}</p>
            <p><small>{new Date(msg.timestamp).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messaging;
