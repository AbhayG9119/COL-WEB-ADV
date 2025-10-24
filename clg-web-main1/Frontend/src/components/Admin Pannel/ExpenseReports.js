import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { expenseApi } from '../../services/adminApi';

const ExpenseReports = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      window.location.href = '/login';
    }
  }, []);

  const fetchReport = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      toast.error('Please select valid start and end dates.');
      return;
    }

    setLoading(true);

    // Mock data for explanation
    const mockData = {
      report: [
        { category: 'Office Supplies', total: 2500 },
        { category: 'Travel', total: 15000 },
        { category: 'Utilities', total: 8000 },
        { category: 'Maintenance', total: 12000 },
        { category: 'Other', total: 3000 }
      ],
      grand_total: 40500
    };

    // Simulate API delay
    setTimeout(() => {
      setReportData(mockData.report);
      setGrandTotal(mockData.grand_total);
      setLoading(false);
      toast.success('Report generated successfully!');
    }, 1000);
  };

  const isValidRange = startDate && endDate && startDate <= endDate;

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '30px'
      }}>
        <h1 style={{
          color: '#333',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>Expense Reports</h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{
              fontWeight: 'bold',
              marginBottom: '5px',
              color: '#555'
            }}>Start Date:</label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                width: '200px'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{
              fontWeight: 'bold',
              marginBottom: '5px',
              color: '#555'
            }}>End Date:</label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                width: '200px'
              }}
            />
          </div>
          <button
            onClick={fetchReport}
            disabled={!isValidRange || loading}
            style={{
              padding: '12px 24px',
              backgroundColor: isValidRange && !loading ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isValidRange && !loading ? 'pointer' : 'not-allowed',
              alignSelf: 'flex-end'
            }}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {reportData.length > 0 ? (
          <>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>Category</th>
                  <th style={{
                    padding: '15px',
                    textAlign: 'right',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #ddd'
                  }}>
                    <td style={{
                      padding: '15px',
                      fontSize: '16px',
                      color: '#333'
                    }}>{item.category}</td>
                    <td style={{
                      padding: '15px',
                      textAlign: 'right',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#007bff'
                    }}>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{
              backgroundColor: '#e9ecef',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              border: '2px solid #28a745'
            }}>
              <strong style={{
                fontSize: '24px',
                color: '#28a745',
                fontWeight: 'bold'
              }}>Grand Total: {grandTotal}</strong>
            </div>
          </>
        ) : (
          !loading && <p style={{
            textAlign: 'center',
            fontSize: '18px',
            color: '#666',
            marginTop: '50px'
          }}>No data found for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseReports;
