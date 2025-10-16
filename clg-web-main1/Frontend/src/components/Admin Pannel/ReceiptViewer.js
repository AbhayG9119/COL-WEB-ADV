import React from 'react';

const ReceiptViewer = ({ receipt, onClose, onPrint, isDuplicate = false }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  return (
    <div className="receipt-modal-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h2>Fee Receipt</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {isDuplicate && (
          <div className="duplicate-watermark">
            DUPLICATE COPY
          </div>
        )}

        <div className="receipt-content">
          <div className="receipt-info">
            <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
            <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
            <p><strong>Student ID:</strong> {receipt.studentId}</p>
            <p><strong>Student Name:</strong> {receipt.studentName}</p>
          </div>

          <div className="payment-details">
            <h3>Payment Details</h3>
            <p><strong>Amount Paid:</strong> ₹{receipt.amount.toLocaleString()}</p>
            <p><strong>Payment Mode:</strong> {receipt.paymentMode}</p>
            {receipt.remarks && <p><strong>Remarks:</strong> {receipt.remarks}</p>}
          </div>

          <div className="fee-breakdown">
            <h3>Fee Breakdown</h3>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Fee Head</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {receipt.breakdown.map((item, index) => (
                  <tr key={index}>
                    <td>{item.head}</td>
                    <td>₹{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="receipt-footer">
            <p>Print Count: {receipt.printCount || 1}</p>
            <p>Generated on: {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="btn btn-print" onClick={handlePrint}>
            Print Receipt
          </button>
          <button className="btn btn-download" onClick={() => window.open(receipt.pdfUrl, '_blank')}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptViewer;
