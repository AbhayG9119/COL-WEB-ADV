import React, { useState } from 'react';
import ReceiptViewer from './ReceiptViewer';
import Alert from './Alert';

const DuplicateReceipt = () => {
  const [receiptId, setReceiptId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for UI demonstration
  const mockReceipts = [
    {
      receiptNumber: 'RCP1703123456789',
      date: '2023-12-20T10:30:00.000Z',
      studentId: 'STU001',
      studentName: 'John Doe',
      amount: 2500,
      paymentMode: 'Cash',
      remarks: 'Partial payment for tuition fees',
      breakdown: [
        { head: 'Tuition Fee', amount: 2000 },
        { head: 'Sports Fee', amount: 500 }
      ],
      printCount: 2,
      pdfUrl: '#'
    },
    {
      receiptNumber: 'RCP1704123456789',
      date: '2023-12-21T14:15:00.000Z',
      studentId: 'STU002',
      studentName: 'Jane Smith',
      amount: 1500,
      paymentMode: 'UPI',
      remarks: 'Exam fee payment',
      breakdown: [
        { head: 'Exam Fee', amount: 1500 }
      ],
      printCount: 1,
      pdfUrl: '#'
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!receiptId.trim()) {
      setAlert({ message: 'Please enter a receipt number', type: 'error' });
      return;
    }

    setIsLoading(true);

    // Mock search functionality
    const foundReceipt = mockReceipts.find(r =>
      r.receiptNumber.includes(receiptId) || r.studentId === receiptId
    );

    setTimeout(() => {
      setIsLoading(false);

      if (foundReceipt) {
        setReceipt(foundReceipt);
        setShowReceipt(false); // Show preview first, not the receipt viewer
        setAlert({ message: 'Receipt found!', type: 'success' });
      } else {
        setAlert({ message: 'Receipt not found. Try RCP1703123456789 or STU001', type: 'error' });
      }
    }, 1000);
  };

  const handleDuplicate = async () => {
    setIsLoading(true);

    // Mock duplicate functionality
    setTimeout(() => {
      setIsLoading(false);
      const duplicateReceipt = {
        ...receipt,
        receiptNumber: `${receipt.receiptNumber}_DUP`,
        printCount: (receipt.printCount || 1) + 1
      };
      setReceipt(duplicateReceipt);
      setShowReceipt(true); // Show the receipt viewer after generating duplicate
      setAlert({ message: 'Duplicate receipt generated successfully!', type: 'success' });
    }, 1000);
  };

  const userRole = localStorage.getItem('role');
  const canReprint = userRole === 'admin';

  return (
    <div className="menu-content">
      <h1>Duplicate Receipt</h1>
      <p>Generate duplicate copies of fee receipts.</p>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="duplicate-receipt-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Receipt Number or Student ID:</label>
            <input
              type="text"
              value={receiptId}
              onChange={(e) => setReceiptId(e.target.value)}
              placeholder="Enter receipt number or student ID (try RCP1703123456789 or STU001)"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search Receipt'}
          </button>
        </form>

        {receipt && !showReceipt && (
          <div className="receipt-preview">
            <h3>Receipt Details</h3>
            <div className="receipt-info">
              <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
              <p><strong>Student:</strong> {receipt.studentName} ({receipt.studentId})</p>
              <p><strong>Amount:</strong> ₹{receipt.amount.toLocaleString()}</p>
              <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
              <p><strong>Print Count:</strong> {receipt.printCount || 1}</p>
            </div>

            {canReprint ? (
              <button
                className="btn btn-secondary"
                onClick={handleDuplicate}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Duplicate'}
              </button>
            ) : (
              <p className="access-denied">Only admins can reprint receipts.</p>
            )}
          </div>
        )}
      </div>

      {showReceipt && (
        <ReceiptViewer
          receipt={receipt}
          onClose={() => setShowReceipt(false)}
          onPrint={() => setAlert({ message: 'Duplicate receipt printed!', type: 'success' })}
          isDuplicate={true}
        />
      )}
    </div>
  );
};

export default DuplicateReceipt;

