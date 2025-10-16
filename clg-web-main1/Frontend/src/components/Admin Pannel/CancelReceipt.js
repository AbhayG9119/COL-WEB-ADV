import React, { useState } from 'react';
import Alert from './Alert';
import ConfirmationModal from './ConfirmationModal';

const CancelReceipt = () => {
  const [receiptId, setReceiptId] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [reason, setReason] = useState('');
  const [alert, setAlert] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
    const foundReceipt = mockReceipts.find(r => r.receiptNumber === receiptId);

    setTimeout(() => {
      setIsLoading(false);

      if (foundReceipt) {
        setReceipt(foundReceipt);
        setAlert({ message: 'Receipt found!', type: 'success' });
      } else {
        setAlert({ message: 'Receipt not found. Try RCP1703123456789', type: 'error' });
      }
    }, 1000);
  };

  const handleCancelClick = () => {
    if (!reason.trim()) {
      setAlert({ message: 'Please provide a reason for cancellation', type: 'error' });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    // Mock cancellation functionality
    setTimeout(() => {
      setIsLoading(false);
      setAlert({ message: 'Receipt cancelled successfully!', type: 'success' });
      setReceipt(null);
      setReceiptId('');
      setReason('');
    }, 1000);
  };

  const userRole = localStorage.getItem('role');
  const canCancel = userRole === 'admin';

  return (
    <div className="menu-content">
      <h1>Cancel Receipt</h1>
      <p>Cancel issued fee receipts. This action cannot be undone.</p>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {!canCancel && (
        <div className="warning-message">
          <p>⚠️ Only administrators can cancel receipts.</p>
        </div>
      )}

      {canCancel && (
        <div className="cancel-receipt-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label>Receipt Number:</label>
              <input
                type="text"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value)}
                placeholder="Enter receipt number (try RCP1703123456789)"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search Receipt'}
            </button>
          </form>

          {receipt && (
            <div className="receipt-details">
              <h3>Receipt Information</h3>
              <div className="receipt-info">
                <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
                <p><strong>Student:</strong> {receipt.studentName} ({receipt.studentId})</p>
                <p><strong>Amount:</strong> ₹{receipt.amount.toLocaleString()}</p>
                <p><strong>Payment Mode:</strong> {receipt.paymentMode}</p>
                <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
                {receipt.remarks && <p><strong>Remarks:</strong> {receipt.remarks}</p>}
              </div>

              <div className="cancellation-form">
                <h3>Cancellation Details</h3>
                <div className="form-group">
                  <label>Reason for Cancellation (Required):</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    placeholder="Please provide a detailed reason for cancelling this receipt..."
                    required
                  />
                </div>

                <div className="warning-box">
                  <p>⚠️ <strong>Warning:</strong> This action cannot be undone. The receipt will be marked as void and cannot be reprinted.</p>
                </div>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCancelClick}
                  disabled={isLoading || !reason.trim()}
                >
                  {isLoading ? 'Cancelling...' : 'Cancel Receipt'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Cancellation"
        message={`Are you sure you want to cancel receipt ${receipt?.receiptNumber}? This action cannot be undone.`}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default CancelReceipt;
