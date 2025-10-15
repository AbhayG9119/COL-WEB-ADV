import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Assuming axios is installed for API calls
import './Circulars.css';

const Circulars = () => {
  const [notices, setNotices] = useState([]);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    priority: 'normal',
    category: 'general',
    audience_scope: { roles: [], class_ids: [], course_ids: [], department_ids: [], student_ids: [] },
    channels: { in_app: true, email: false, sms: false },
    attachments: [],
    publish_at: '',
    expires_at: '',
    session_id: ''
  });
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', session_id: '' });
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [loading, setLoading] = useState(false);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/notice', { params: filters });
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    if (view === 'list') {
      fetchNotices();
    }
  }, [view, fetchNotices]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAudienceChange = (type, values) => {
    setFormData({ ...formData, audience_scope: { ...formData.audience_scope, [type]: values } });
  };

  const handleChannelsChange = (channel, checked) => {
    setFormData({ ...formData, channels: { ...formData.channels, [channel]: checked } });
  };

  const handleAttachmentsChange = (files) => {
    setFormData({ ...formData, attachments: files });
  };

  const createNotice = async () => {
    try {
      await axios.post('/api/notice', formData);
      alert('Notice created as draft');
      setView('list');
      fetchNotices();
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const updateNotice = async () => {
    try {
      await axios.put(`/api/notice/${currentNotice.circular_id}`, formData);
      alert('Notice updated');
      setView('list');
      fetchNotices();
    } catch (error) {
      console.error('Error updating notice:', error);
    }
  };

  const publishNotice = async (id) => {
    try {
      await axios.post(`/api/notice/${id}/publish`);
      alert('Notice published');
      fetchNotices();
    } catch (error) {
      console.error('Error publishing notice:', error);
    }
  };

  const scheduleNotice = async (id) => {
    try {
      await axios.post(`/api/notice/${id}/schedule`);
      alert('Notice scheduled');
      fetchNotices();
    } catch (error) {
      console.error('Error scheduling notice:', error);
    }
  };

  const archiveNotice = async (id) => {
    try {
      await axios.post(`/api/notice/${id}/archive`);
      alert('Notice archived');
      fetchNotices();
    } catch (error) {
      console.error('Error archiving notice:', error);
    }
  };

  const cancelNotice = async (id) => {
    try {
      await axios.post(`/api/notice/${id}/cancel`);
      alert('Notice cancelled');
      fetchNotices();
    } catch (error) {
      console.error('Error cancelling notice:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Assuming current user ID is available, e.g., from context or props
      const recipientId = 1; // Replace with actual user ID
      await axios.post(`/api/notice/${id}/read`, { recipient_id: recipientId });
      alert('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      priority: 'normal',
      category: 'general',
      audience_scope: { roles: [], class_ids: [], course_ids: [], department_ids: [], student_ids: [] },
      channels: { in_app: true, email: false, sms: false },
      attachments: [],
      publish_at: '',
      expires_at: '',
      session_id: ''
    });
    setCurrentNotice(null);
  };

  const editNotice = (notice) => {
    setCurrentNotice(notice);
    setFormData({
      title: notice.title,
      body: notice.body,
      priority: notice.priority,
      category: notice.category,
      audience_scope: notice.audience_scope,
      channels: notice.channels,
      attachments: notice.attachments,
      publish_at: notice.publish_at,
      expires_at: notice.expires_at,
      session_id: notice.session_id
    });
    setView('form');
  };

  return (
    <div className="menu-content">
      <h1>Circulars / Notice</h1>
      <p>Create and manage notices for students and staff.</p>
      <div className="button-group">
        <button className="btn" onClick={() => { resetForm(); setView('form'); }}>Create Notice</button>
        <button className="btn" onClick={() => setView('list')}>View Notices</button>
      </div>

      {view === 'list' && (
        <>
          <h2>View Notices</h2>
          <div className="filters">
            <select name="status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select name="category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              <option value="academic">Academic</option>
              <option value="exam">Exam</option>
              <option value="fee">Fee</option>
              <option value="general">General</option>
              <option value="transport">Transport</option>
              <option value="hostel">Hostel</option>
            </select>
            <select name="priority" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <input type="text" placeholder="Session ID" value={filters.session_id} onChange={(e) => setFilters({ ...filters, session_id: e.target.value })} />
          </div>
          {loading ? <p>Loading...</p> : (
            <ul className="notice-list">
              {notices.map(notice => (
                <li key={notice.circular_id}>
                  <h3>{notice.title}</h3>
                  <p>{notice.body.substring(0, 100)}...</p>
                  <p>Status: {notice.status}</p>
                  <button onClick={() => editNotice(notice)}>Edit</button>
                  {notice.status === 'draft' && <button onClick={() => publishNotice(notice.circular_id)}>Publish Now</button>}
                  {notice.status === 'draft' && <button onClick={() => scheduleNotice(notice.circular_id)}>Schedule</button>}
                  {notice.status === 'published' && <button onClick={() => archiveNotice(notice.circular_id)}>Archive</button>}
                  {notice.status === 'published' && <button onClick={() => cancelNotice(notice.circular_id)}>Cancel</button>}
                  <button onClick={() => markAsRead(notice.circular_id)}>Mark as Read</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {view === 'form' && (
        <>
          <h2>{currentNotice ? 'Edit Notice' : 'Create Notice'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); currentNotice ? updateNotice() : createNotice(); }}>
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />

            <label>Body:</label>
            <textarea name="body" value={formData.body} onChange={handleInputChange} required />

            <label>Priority:</label>
            <select name="priority" value={formData.priority} onChange={handleInputChange}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>

            <label>Category:</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="academic">Academic</option>
              <option value="exam">Exam</option>
              <option value="fee">Fee</option>
              <option value="general">General</option>
              <option value="transport">Transport</option>
              <option value="hostel">Hostel</option>
            </select>

            <label>Audience Scope:</label>
            {/* Simplified audience selection; in real app, use multi-select or checkboxes */}
            <input type="text" placeholder="Roles (comma separated)" value={formData.audience_scope.roles ? formData.audience_scope.roles.join(',') : ''} onChange={(e) => handleAudienceChange('roles', e.target.value.split(','))} />
            <input type="text" placeholder="Class IDs (comma separated)" value={formData.audience_scope.class_ids ? formData.audience_scope.class_ids.join(',') : ''} onChange={(e) => handleAudienceChange('class_ids', e.target.value.split(','))} />
            {/* Add more for course_ids, department_ids, student_ids */}

            <label>Channels:</label>
            <label><input type="checkbox" checked={formData.channels.in_app} onChange={(e) => handleChannelsChange('in_app', e.target.checked)} /> In-App</label>
            <label><input type="checkbox" checked={formData.channels.email} onChange={(e) => handleChannelsChange('email', e.target.checked)} /> Email</label>
            <label><input type="checkbox" checked={formData.channels.sms} onChange={(e) => handleChannelsChange('sms', e.target.checked)} /> SMS</label>

            <label>Attachments:</label>
            <input type="file" multiple onChange={(e) => handleAttachmentsChange(Array.from(e.target.files))} />

            <label>Publish At:</label>
            <input type="datetime-local" name="publish_at" value={formData.publish_at} onChange={handleInputChange} />

            <label>Expires At:</label>
            <input type="datetime-local" name="expires_at" value={formData.expires_at} onChange={handleInputChange} />

            <label>Session ID:</label>
            <input type="text" name="session_id" value={formData.session_id} onChange={handleInputChange} />

            <button type="submit">{currentNotice ? 'Update' : 'Create'} Notice</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Circulars;
