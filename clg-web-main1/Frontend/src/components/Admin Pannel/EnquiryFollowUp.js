import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { enquiryApi } from '../../services/adminApi';
import './VisitedList.css';

const EnquiryFollowUp = () => {
  const mockEnquiries = [
    { id: 1, name: 'John Doe', contact: '1234567890', stream: 'Science' },
    { id: 2, name: 'Jane Smith', contact: '0987654321', stream: 'Commerce' },
    { id: 3, name: 'Alice Johnson', contact: '1122334455', stream: 'Arts' },
    { id: 4, name: 'Bob Brown', contact: '5566778899', stream: 'Engineering' }
  ];

  const mockFollowUps = {
    1: [
      { id: 1, status: 'Pending', notes: 'Initial contact made', createdAt: '2023-10-01T10:00:00Z' },
      { id: 2, status: 'Contacted', notes: 'Followed up on interest', createdAt: '2023-10-05T14:30:00Z' }
    ],
    2: [
      { id: 3, status: 'Pending', notes: 'Waiting for response', createdAt: '2023-09-28T09:15:00Z' }
    ],
    3: [],
    4: [
      { id: 4, status: 'Converted', notes: 'Enrolled successfully', createdAt: '2023-10-10T16:45:00Z' }
    ]
  };

  const [enquiries] = useState(mockEnquiries);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState('');
  const [followUpData, setFollowUpData] = useState({
    status: '',
    notes: '',
    reminderDate: null
  });
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    // Mock data already set in useState
  }, []);

  const handleEnquiryChange = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    if (enquiryId) {
      setFollowUps(mockFollowUps[enquiryId] || []);
    } else {
      setFollowUps([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFollowUpData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFollowUpData(prev => ({ ...prev, reminderDate: date }));
  };

  const validateForm = () => {
    if (!selectedEnquiryId) {
      toast.error('Please select an enquiry');
      return false;
    }
    if (!followUpData.status) {
      toast.error('Please select a status');
      return false;
    }
    if (!followUpData.notes.trim()) {
      toast.error('Please enter follow-up notes');
      return false;
    }
    if (followUpData.reminderDate && followUpData.reminderDate < new Date()) {
      toast.error('Reminder date must be in the future');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        enquiryId: selectedEnquiryId,
        status: followUpData.status,
        notes: followUpData.notes,
        reminderDate: followUpData.reminderDate,
        notificationEnabled
      };

      const result = await enquiryApi.addFollowUp(dataToSend);
      if (result.success) {
        toast.success('Follow-up added successfully');
        // Update enquiry timeline
        handleEnquiryChange(selectedEnquiryId);
        // Reset form
        setFollowUpData({
          status: '',
          notes: '',
          reminderDate: null
        });
        setNotificationEnabled(false);
      } else {
        toast.error(result.error || 'Failed to add follow-up');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>Enquiry Follow-up</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Enquiry *</label>
          <select
            value={selectedEnquiryId}
            onChange={(e) => handleEnquiryChange(e.target.value)}
            required
          >
            <option value="">Choose an enquiry</option>
            {enquiries.map(enquiry => (
              <option key={enquiry.id} value={enquiry.id}>
                {enquiry.name} - {enquiry.contact} ({enquiry.stream})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select
            name="status"
            value={followUpData.status}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>

        <div className="form-group">
          <label>Follow-up Notes *</label>
          <textarea
            name="notes"
            value={followUpData.notes}
            onChange={handleInputChange}
            placeholder="Enter follow-up details..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Reminder Date</label>
          <input
            type="date"
            value={followUpData.reminderDate ? followUpData.reminderDate.toISOString().split('T')[0] : ''}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
            />
            Enable Notification
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Follow-up'}
        </button>
      </form>

      {selectedEnquiryId && (
        <div className="timeline-view">
          <h2>Follow-up Timeline</h2>
          {followUps.length === 0 ? (
            <p>No follow-ups yet for this enquiry.</p>
          ) : (
            <div className="timeline">
              {followUps.map((followUp, index) => (
                <div key={followUp.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>{followUp.status}</h4>
                    <p>{followUp.notes}</p>
                    <small>{new Date(followUp.createdAt).toLocaleString()}</small>
                    {followUp.reminderDate && (
                      <p><strong>Reminder:</strong> {new Date(followUp.reminderDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnquiryFollowUp;
