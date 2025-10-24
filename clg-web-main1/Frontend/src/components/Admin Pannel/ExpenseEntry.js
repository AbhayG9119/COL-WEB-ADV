import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { expenseApi } from '../../services/adminApi';

const ExpenseEntry = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      window.location.href = '/login';
    }
  }, []);

  const resetForm = () => {
    setCategory('');
    setAmount(0);
    setNotes('');
    setAttachment(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match(/jpg|png|pdf/)) {
      setAttachment(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      toast.error('Invalid file type. Only JPG, PNG, PDF allowed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category === '' || amount <= 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    // Mock implementation - simulate API call
    setTimeout(() => {
      const newExpense = {
        id: Date.now(),
        category,
        amount,
        notes,
        date: new Date().toISOString().split('T')[0],
        attachment: attachment ? attachment.name : null
      };

      setExpenseList(prev => [...prev, newExpense]);
      toast.success('Expense recorded successfully!');
      resetForm();
      setLoading(false);
    }, 1000);
  };

  const isValid = category !== '' && amount > 0;

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
        }}>Expense Entry</h1>

        <div style={{
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Form Section */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{
              color: '#555',
              marginBottom: '20px',
              fontSize: '20px',
              borderBottom: '2px solid #007bff',
              paddingBottom: '10px'
            }}>Add New Expense</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#555'
                }}>Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Travel">Travel</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#555'
                }}>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  min="0.01"
                  step="0.01"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#555'
                }}>Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#555'
                }}>Attachment:</label>
                <input
                  type="file"
                  accept=".jpg,.png,.pdf"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      marginTop: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: isValid && !loading ? '#28a745' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isValid && !loading ? 'pointer' : 'not-allowed',
                  alignSelf: 'flex-start'
                }}
              >
                {loading ? 'Saving...' : 'Save Expense'}
              </button>
            </form>
          </div>

          {/* Expense List Section */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{
              color: '#555',
              marginBottom: '20px',
              fontSize: '20px',
              borderBottom: '2px solid #007bff',
              paddingBottom: '10px'
            }}>Recent Expenses</h2>

            {expenseList.length === 0 ? (
              <p style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '16px',
                marginTop: '50px'
              }}>No expenses recorded yet.</p>
            ) : (
              <div style={{
                maxHeight: '600px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}>
                {expenseList.map((expense) => (
                  <div
                    key={expense.id}
                    style={{
                      padding: '15px',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f8f9fa',
                      marginBottom: '10px',
                      borderRadius: '5px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <strong style={{ color: '#333', fontSize: '16px' }}>{expense.category}</strong>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#007bff'
                      }}>{expense.amount}</span>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '5px'
                    }}>
                      Date: {expense.date}
                    </div>
                    {expense.notes && (
                      <div style={{
                        fontSize: '14px',
                        color: '#555',
                        marginBottom: '5px'
                      }}>
                        Notes: {expense.notes}
                      </div>
                    )}
                    {expense.attachment && (
                      <div style={{
                        fontSize: '14px',
                        color: '#007bff'
                      }}>
                        Attachment: {expense.attachment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseEntry;
