import React from 'react';

const FeesManagement = () => {
  return (
    <div className="menu-content">
      <h1>Fees & Receipts</h1>
      <p>Manage fee collection, receipts, and adjustments.</p>
      <div className="button-group">
        <button className="btn">Collect Fees</button>
        <button className="btn">Duplicate Receipt</button>
        <button className="btn">Cancel Receipt</button>
        <button className="btn">Change Hostel/Transport</button>
      </div>
      <h2>Collect Fees</h2>
      <p>Search student by roll no, view pending fees, collect payment, generate receipt.</p>
      <h2>Duplicate Receipt</h2>
      <p>Generate duplicate receipt for previous payments.</p>
      <h2>Cancel Receipt</h2>
      <p>Cancel erroneous receipts.</p>
      <h2>Change Hostel/Transport</h2>
      <p>Adjust fees for changes in hostel or transport.</p>
    </div>
  );
};

export default FeesManagement;
