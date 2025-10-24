import React, { useState, useEffect } from 'react';

const GenerateSalary = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [salaryFormula, setSalaryFormula] = useState('');
  const [generatedSalary, setGeneratedSalary] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState('');

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

  // Mock salary template
  const salaryTemplate = {
    basePay: 30000,
    allowances: [{ name: 'HRA', amount: 5000 }, { name: 'Conveyance', amount: 2000 }],
    deductions: [{ name: 'PF', amount: 1800 }, { name: 'Tax', amount: 1500 }]
  };

  const fetchAttendanceSummary = (staffId, month) => {
    // Mock attendance data
    const mockAttendance = [
      { date: '2024-10-01', status: 'Present' },
      { date: '2024-10-02', status: 'Present' },
      { date: '2024-10-03', status: 'Absent' },
      { date: '2024-10-04', status: 'Present' },
      // ... more days
    ];
    setAttendanceSummary(mockAttendance);

    // Calculate formula
    const totalAllowances = salaryTemplate.allowances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = salaryTemplate.deductions.reduce((sum, d) => sum + d.amount, 0);
    const netSalary = salaryTemplate.basePay + totalAllowances - totalDeductions;
    setSalaryFormula(`Base: ₹${salaryTemplate.basePay} + Allowances: ₹${totalAllowances} - Deductions: ₹${totalDeductions} = Net: ₹${netSalary}`);
  };

  const handleStaffChange = (staffId) => {
    setSelectedStaff(staffId);
    if (selectedMonth) {
      fetchAttendanceSummary(staffId, selectedMonth);
    }
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    if (selectedStaff) {
      fetchAttendanceSummary(selectedStaff, month);
    }
  };

  const calculateSalary = () => {
    const presentDays = attendanceSummary.filter(a => a.status === 'Present').length;
    const totalDays = attendanceSummary.length;
    const attendancePercentage = (presentDays / totalDays) * 100;

    const totalAllowances = salaryTemplate.allowances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = salaryTemplate.deductions.reduce((sum, d) => sum + d.amount, 0);
    const grossSalary = salaryTemplate.basePay + totalAllowances;
    const netSalary = grossSalary - totalDeductions;

    return {
      basePay: salaryTemplate.basePay,
      allowances: totalAllowances,
      deductions: totalDeductions,
      grossSalary,
      netSalary,
      presentDays,
      totalDays,
      attendancePercentage: attendancePercentage.toFixed(2)
    };
  };

  const handleGenerateSalary = () => {
    if (!selectedMonth || !selectedStaff) {
      setMessage('Please select both month and staff');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const salaryData = calculateSalary();
      setGeneratedSalary(salaryData);
      setMessage('Salary generated successfully');
      setTimeout(() => setMessage(''), 3000);
      setLoading(false);
    }, 1000);
  };

  const handleRecalculate = () => {
    handleGenerateSalary();
  };

  const handleExport = (format) => {
    // Mock export
    alert(`Exporting salary record as ${format.toUpperCase()}`);
  };

  const validationSummary = () => {
    if (!attendanceSummary.length) return '';
    const absentDays = attendanceSummary.filter(a => a.status === 'Absent').length;
    if (absentDays > 0) {
      return `Attendance missing for ${absentDays} days`;
    }
    return 'All attendance data available';
  };

  return (
    <div className="menu-content">
      <h1>Generate Salary</h1>
      <p>Calculate monthly salary for staff using attendance and salary template.</p>

      <div style={{ marginBottom: '20px' }}>
        <label title="Required">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          style={{ marginLeft: '10px', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label title="Searchable, shows staff list">Select Staff:</label>
        <select
          value={selectedStaff}
          onChange={(e) => handleStaffChange(e.target.value)}
          style={{ marginLeft: '10px', padding: '8px', width: '200px' }}
        >
          <option value="">Select Staff</option>
          {staffList.map(staff => (
            <option key={staff.id} value={staff.id}>{staff.full_name} - {staff.designation_name}</option>
          ))}
        </select>
      </div>

      {attendanceSummary.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Attendance Summary</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.map((record, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.date}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {salaryFormula && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Salary Formula</h3>
          <p title="Shows applied formula">{salaryFormula}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label title="Optional, for future activation">Effective Date:</label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          style={{ marginLeft: '10px', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleGenerateSalary}
          disabled={loading}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {loading ? 'Generating...' : 'Generate Salary'}
        </button>
        {generatedSalary && (
          <>
            <button onClick={handleRecalculate} style={{ padding: '10px 20px', marginRight: '10px' }}>Recalculate</button>
            <button onClick={() => handleExport('excel')} style={{ padding: '10px 20px', marginRight: '10px' }}>Export as Excel</button>
          </>
        )}
      </div>

      {validationSummary() && (
        <div style={{ marginBottom: '20px', color: validationSummary().includes('missing') ? 'red' : 'green' }}>
          <strong>Validation Summary:</strong> {validationSummary()}
        </div>
      )}

      {generatedSalary && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px' }}>
          <h3>Generated Salary Details</h3>
          <p><strong>Base Pay:</strong> ₹{generatedSalary.basePay}</p>
          <p><strong>Allowances:</strong> ₹{generatedSalary.allowances}</p>
          <p><strong>Deductions:</strong> ₹{generatedSalary.deductions}</p>
          <p><strong>Gross Salary:</strong> ₹{generatedSalary.grossSalary}</p>
          <p><strong>Net Salary:</strong> ₹{generatedSalary.netSalary}</p>
          <p><strong>Attendance:</strong> {generatedSalary.presentDays}/{generatedSalary.totalDays} days ({generatedSalary.attendancePercentage}%)</p>
        </div>
      )}

      {message && <div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default GenerateSalary;
