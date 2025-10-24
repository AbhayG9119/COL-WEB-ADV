import React, { useState, useEffect } from 'react';

const GeneratePayslip = () => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [payslipData, setPayslipData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkMonth, setBulkMonth] = useState('');

  // Mock staff list
  useEffect(() => {
    const mockStaff = [
      { id: 1, full_name: 'John Doe', designation_name: 'Teacher' },
      { id: 2, full_name: 'Jane Smith', designation_name: 'Principal' },
      { id: 3, full_name: 'Bob Johnson', designation_name: 'Clerk' },
      { id: 4, full_name: 'Alice Brown', designation_name: 'Librarian' },
      { id: 5, full_name: 'Charlie Wilson', designation_name: 'Peon' }
    ];
    setStaffList(mockStaff);
  }, []);

  // Mock payslip data
  const mockPayslipData = {
    staffName: 'John Doe',
    designation: 'Teacher',
    month: 'October 2024',
    basePay: 30000,
    allowances: [
      { name: 'HRA', amount: 5000 },
      { name: 'Conveyance', amount: 2000 }
    ],
    deductions: [
      { name: 'PF', amount: 1800 },
      { name: 'Tax', amount: 1500 }
    ],
    grossSalary: 37000,
    totalDeductions: 3300,
    netSalary: 33700,
    attendance: { present: 28, total: 30 }
  };

  const handleGeneratePayslip = () => {
    if (!selectedStaff || !selectedMonth) {
      setMessage('Please select both staff and month');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setPayslipData(mockPayslipData);
      setMessage('Payslip generated successfully');
      setTimeout(() => setMessage(''), 3000);
      setLoading(false);
    }, 1000);
  };

  const handleDownload = () => {
    // Mock PDF download
    alert('Downloading payslip as PDF');
  };

  const handlePrint = () => {
    // Mock print
    alert('Printing payslip');
  };

  const handleBulkExport = () => {
    if (!bulkMonth) {
      setMessage('Please select a month for bulk export');
      return;
    }
    alert(`Bulk exporting payslips for ${bulkMonth}`);
  };

  const filteredStaff = staffList.filter(staff =>
    staff.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.designation_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PayslipPreview = () => (
    <div style={{ border: '1px solid #ddd', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ textAlign: 'center' }}>College Name</h3>
      <h4 style={{ textAlign: 'center' }}>Payslip for {payslipData.month}</h4>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p><strong>Employee Name:</strong> {payslipData.staffName}</p>
          <p><strong>Designation:</strong> {payslipData.designation}</p>
        </div>
        <div>
          <p><strong>Month:</strong> {payslipData.month}</p>
          <p><strong>Attendance:</strong> {payslipData.attendance.present}/{payslipData.attendance.total} days</p>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#e9ecef' }}>Earnings</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#e9ecef' }}>Amount (₹)</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#e9ecef' }}>Deductions</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#e9ecef' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Basic Pay</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payslipData.basePay}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payslipData.deductions[0].name}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{payslipData.deductions[0].amount}</td>
          </tr>
          {payslipData.allowances.map((allowance, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{allowance.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{allowance.amount}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {payslipData.deductions[index + 1] ? payslipData.deductions[index + 1].name : ''}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {payslipData.deductions[index + 1] ? payslipData.deductions[index + 1].amount : ''}
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Gross Salary</td>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{payslipData.grossSalary}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Deductions</td>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{payslipData.totalDeductions}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3>Net Salary: ₹{payslipData.netSalary}</h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p>Employee Signature: ____________________</p>
        </div>
        <div>
          <p>Principal/Accountant Signature: ____________________</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="menu-content">
      <h1>Generate Payslip</h1>
      <p>Create downloadable payslip PDF for selected staff and month.</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setBulkMode(false)}
          style={{ padding: '8px 16px', marginRight: '10px', backgroundColor: !bulkMode ? '#007bff' : '#6c757d', color: 'white', border: 'none' }}
        >
          Single Payslip
        </button>
        <button
          onClick={() => setBulkMode(true)}
          style={{ padding: '8px 16px', backgroundColor: bulkMode ? '#007bff' : '#6c757d', color: 'white', border: 'none' }}
        >
          Bulk Export
        </button>
      </div>

      {!bulkMode ? (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label title="Searchable">Select Staff:</label>
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px', width: '200px' }}
            />
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px', width: '200px' }}
            >
              <option value="">Select Staff</option>
              {filteredStaff.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.full_name} - {staff.designation_name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label title="Required">Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleGeneratePayslip}
              disabled={loading}
              style={{ padding: '10px 20px', marginRight: '10px' }}
            >
              {loading ? 'Generating...' : 'Generate Payslip'}
            </button>
            {payslipData && (
              <>
                <button onClick={handleDownload} style={{ padding: '10px 20px', marginRight: '10px' }}>Download PDF</button>
                <button onClick={handlePrint} style={{ padding: '10px 20px' }}>Print</button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label title="Required for bulk export">Select Month for Bulk Export:</label>
            <input
              type="month"
              value={bulkMonth}
              onChange={(e) => setBulkMonth(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button onClick={handleBulkExport} style={{ padding: '10px 20px' }}>Bulk Export Payslips</button>
          </div>
        </>
      )}

      {payslipData && !bulkMode && (
        <div style={{ marginTop: '20px' }}>
          <h3>Preview Payslip</h3>
          <PayslipPreview />
        </div>
      )}

      {message && <div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default GeneratePayslip;
