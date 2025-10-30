import React, { useState, useEffect } from 'react';

const ViewSalary = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSalary = () => {
    setLoading(true);
    setError('');
    try {
      // Mock salary data - simulate API delay
      setTimeout(() => {
        const mockData = {
          basicPay: 50000,
          hra: 10000,
          conveyance: 1920,
          medical: 1250,
          lta: 5000,
          pf: 6000,
          professionalTax: 200,
          incomeTax: 5000,
          netPay: 51800
        };
        setSalaryData(mockData);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('No salary data available for selected month');
      setSalaryData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  const handleFetch = () => {
    fetchSalary();
  };

  return (
    <div className="view-salary">
      <h1>Your Salary Breakdown</h1>
      <div className="month-selector">
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {/* Generate options for last 12 months */}
          {Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const value = date.toISOString().slice(0, 7);
            const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            return <option key={value} value={value}>{label}</option>;
          })}
        </select>
        <button onClick={handleFetch} disabled={loading}>Fetch Salary</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {salaryData && (
        <div className="salary-breakdown-panel">
          <h2>Salary Breakdown for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>
          <div className="salary-item">
            <label>Basic Pay:</label>
            <span>₹{salaryData.basicPay}</span>
          </div>
          <div className="salary-item">
            <label>HRA:</label>
            <span>₹{salaryData.hra}</span>
          </div>
          <div className="salary-item">
            <label>Conveyance:</label>
            <span>₹{salaryData.conveyance}</span>
          </div>
          <div className="salary-item">
            <label>Medical:</label>
            <span>₹{salaryData.medical}</span>
          </div>
          <div className="salary-item">
            <label>LTA:</label>
            <span>₹{salaryData.lta}</span>
          </div>
          <div className="salary-item">
            <label>PF:</label>
            <span>₹{salaryData.pf}</span>
          </div>
          <div className="salary-item">
            <label>Professional Tax:</label>
            <span>₹{salaryData.professionalTax}</span>
          </div>
          <div className="salary-item">
            <label>Income Tax:</label>
            <span>₹{salaryData.incomeTax}</span>
          </div>
          <div className="salary-item net-pay">
            <label>Net Pay:</label>
            <span>₹{salaryData.netPay}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSalary;
