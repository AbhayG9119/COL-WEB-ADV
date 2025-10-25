import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPayrolls();
  }, [selectedMonth]);

  const fetchPayrolls = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`/api/staff/payroll?month=${selectedMonth}`, config);
      setPayrolls(res.data);
    } catch (error) {
      console.error('Error fetching payroll:', error);
    }
  };

  const generatePayslip = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/staff/payroll/generate', { month: selectedMonth }, config);
      setMessage('Payslip generated successfully');
      fetchPayrolls(); // Refresh
    } catch (error) {
      setMessage('Failed to generate payslip');
    }
    setLoading(false);
  };

  return (
    <div className="payroll">
      <h1>Payroll</h1>
      <div className="month-selector">
        <label>Select Month:</label>
        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
        <button onClick={generatePayslip} disabled={loading}>Generate Payslip</button>
      </div>
      {message && <div className="message">{message}</div>}
      <div className="payroll-details">
        {payrolls.length > 0 ? (
          payrolls.map(payroll => (
            <div key={payroll._id} className="payslip">
              <h3>Payslip for {payroll.month}</h3>
              <p><strong>Base Salary:</strong> ₹{payroll.baseSalary}</p>
              <p><strong>Allowances:</strong></p>
              <ul>
                {payroll.allowances.map((allow, idx) => (
                  <li key={idx}>{allow.type}: ₹{allow.amount}</li>
                ))}
              </ul>
              <p><strong>Deductions:</strong></p>
              <ul>
                {payroll.deductions.map((deduct, idx) => (
                  <li key={idx}>{deduct.type}: ₹{deduct.amount}</li>
                ))}
              </ul>
              <p><strong>Net Salary:</strong> ₹{payroll.netSalary}</p>
              <p><strong>Status:</strong> {payroll.status}</p>
              {payroll.payslipUrl && <a href={payroll.payslipUrl} target="_blank" rel="noopener noreferrer">Download Payslip</a>}
            </div>
          ))
        ) : (
          <p>No payroll data for selected month.</p>
        )}
      </div>
    </div>
  );
};

export default Payroll;
