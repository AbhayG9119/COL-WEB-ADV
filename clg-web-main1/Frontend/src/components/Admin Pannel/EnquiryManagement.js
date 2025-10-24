import React, { useState } from 'react';
import AddEnquiry from './AddEnquiry';
import EnquiryDetail from './EnquiryDetail';
import EnquiryFollowUp from './EnquiryFollowUp';
import AddVisitor from './AddVisitor';
import VisitedList from './VisitedList';
import './EnquiryDetail.css';

const EnquiryManagement = () => {
  const [activeComponent, setActiveComponent] = useState('overview');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'addEnquiry':
        return <AddEnquiry />;
      case 'enquiryDetail':
        return <EnquiryDetail />;
      case 'enquiryFollowUp':
        return <EnquiryFollowUp />;
      case 'addVisitor':
        return <AddVisitor />;
      case 'visitedList':
        return <VisitedList />;
      default:
        return (
          <div className="menu-content">
            <h1>Enquiry Management</h1>
            <p>Handle student enquiries, follow-ups, and visitor logs.</p>
            <div className="button-group">
              <button className="btn" onClick={() => setActiveComponent('addEnquiry')}>Add Enquiry</button>
              <button className="btn" onClick={() => setActiveComponent('enquiryDetail')}>Enquiry Detail</button>
              <button className="btn" onClick={() => setActiveComponent('enquiryFollowUp')}>Enquiry Follow-up</button>
              <button className="btn" onClick={() => setActiveComponent('addVisitor')}>Add Visitor</button>
              <button className="btn" onClick={() => setActiveComponent('visitedList')}>Visited List</button>
            </div>
            <div className="overview-sections">
              <div className="overview-item">
                <h2>Add Enquiry</h2>
                <p>Record new student enquiries with contact details and stream preferences.</p>
              </div>
              <div className="overview-item">
                <h2>Enquiry Detail</h2>
                <p>View, search, and manage all enquiry records with follow-up history.</p>
              </div>
              <div className="overview-item">
                <h2>Enquiry Follow-up</h2>
                <p>Update enquiry status, add notes, and set reminders for follow-ups.</p>
              </div>
              <div className="overview-item">
                <h2>Add Visitor</h2>
                <p>Log visitor details with purpose and optional enquiry linkage.</p>
              </div>
              <div className="overview-item">
                <h2>Visited List</h2>
                <p>View and filter visitor logs with duration calculations and export options.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="enquiry-management" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {activeComponent !== 'overview' && (
        <div className="navigation" style={{ marginBottom: '20px' }}>
          <button className="back-btn" style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.3s' }} onClick={() => setActiveComponent('overview')}>
            ← Back to Overview
          </button>
        </div>
      )}
      {renderComponent()}
    </div>
  );
};

export default EnquiryManagement;
