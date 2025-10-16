import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeesManagement = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem('role');

  const menuItems = [
    {
      title: 'Collect Fees',
      description: 'Search student by roll no, view pending fees, collect payment, generate receipt.',
      action: () => navigate('/admin/collect-fees'),
      allowedRoles: ['admin', 'accountant']
    },
    {
      title: 'Duplicate Receipt',
      description: 'Generate duplicate receipt for previous payments.',
      action: () => navigate('/admin/duplicate-receipt'),
      allowedRoles: ['admin']
    },
    {
      title: 'Cancel Receipt',
      description: 'Cancel erroneous receipts.',
      action: () => navigate('/admin/cancel-receipt'),
      allowedRoles: ['admin']
    },
    {
      title: 'Change Hostel/Transport',
      description: 'Adjust fees for changes in hostel or transport.',
      action: () => navigate('/admin/change-hostel-transport'),
      allowedRoles: ['admin', 'transport', 'hostel']
    }
  ];

  return (
    <div className="menu-content">
      <h1>Fees & Receipts</h1>
      <p>Manage fee collection, receipts, and adjustments.</p>

      <div className="button-group">
        {menuItems.map((item, index) => {
          const isAllowed = item.allowedRoles.includes(userRole);
          return (
            <button
              key={index}
              className={`btn ${!isAllowed ? 'btn-disabled' : ''}`}
              onClick={isAllowed ? item.action : undefined}
              disabled={!isAllowed}
              title={!isAllowed ? `Access restricted for ${userRole} role` : ''}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="fees-overview">
        {menuItems.map((item, index) => {
          const isAllowed = item.allowedRoles.includes(userRole);
          return (
            <div key={index} className={`fee-section ${!isAllowed ? 'restricted' : ''}`}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              {!isAllowed && (
                <p className="access-note">
                  <small>Available for: {item.allowedRoles.join(', ')}</small>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeesManagement;
