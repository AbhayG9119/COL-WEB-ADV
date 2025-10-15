import React from 'react';

const Reports = () => {
  return (
    <div className="menu-content">
      <h1>Reports</h1>
      <p>Generate various reports for the school.</p>
      <div className="button-group">
        <button className="btn">Fees Report</button>
        <button className="btn">Attendance Report</button>
        <button className="btn">Admission Report</button>
        <button className="btn">Enquiry Report</button>
      </div>
      <p>Select a report type to generate.</p>
    </div>
  );
};

export default Reports;
