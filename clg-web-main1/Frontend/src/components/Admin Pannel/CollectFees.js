import React, { useState, useEffect } from 'react';
import FeeSummaryTable from './FeeSummaryTable';
import ReceiptViewer from './ReceiptViewer';
import Alert from './Alert';
import './CollectFees.css';

const CollectFees = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [fees, setFees] = useState([]);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: '',
    remarks: ''
  });
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const paymentModes = ['Cash', 'Card', 'UPI', 'Bank Transfer'];







  useEffect(() => {
    // Set mock data for UI demonstration
    setSelectedStudent({
      id: 'STU001',
      name: 'John Doe',
      class: '10th Grade',
      session: '2023-2024'
    });
    setStudentDetails({
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St, City, State',
      dob: '2005-05-15',
      fatherName: 'Mr. Doe',
      motherName: 'Mrs. Doe'
    });
    setFees([
      { head: 'Tuition Fee', amount: 5000, paid: 3000, balance: 2000 },
      { head: 'Library Fee', amount: 500, paid: 500, balance: 0 },
      { head: 'Sports Fee', amount: 1000, paid: 500, balance: 500 },
      { head: 'Exam Fee', amount: 1500, paid: 0, balance: 1500 }
    ]);
    setIsLoading(false);
  }, []);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const totalDue = fees.reduce((sum, fee) => sum + fee.balance, 0);
    const amount = parseFloat(paymentData.amount);

    if (amount <= 0 || amount > totalDue) {
      setAlert({ message: 'Invalid payment amount', type: 'error' });
      return;
    }

    if (!paymentData.paymentMode) {
      setAlert({ message: 'Please select payment mode', type: 'error' });
      return;
    }

    setIsLoading(true);

    // Mock receipt data for UI demonstration
    const mockReceipt = {
      receiptNumber: `RCP${Date.now()}`,
      date: new Date().toISOString(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      amount: amount,
      paymentMode: paymentData.paymentMode,
      remarks: paymentData.remarks || 'No remarks',
      breakdown: fees.filter(fee => fee.balance > 0).map(fee => ({
        head: fee.head,
        amount: Math.min(fee.balance, amount)
      })),
      printCount: 1,
      pdfUrl: '#'
    };

    setTimeout(() => {
      setIsLoading(false);
      setReceipt(mockReceipt);
      setAlert({ message: 'Payment collected successfully! Click "Generate Receipt" to view/print the receipt.', type: 'success' });
      // Reset form
      setPaymentData({ amount: '', paymentMode: '', remarks: '' });
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const totalDue = fees.reduce((sum, fee) => sum + fee.balance, 0);

  return (
    <div className="menu-content">
      <h1>Collect Fees</h1>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="collect-fees-container">
        {/* Search section commented out for UI demo */}
        {/* <div className="search-section">
          <StudentSearch
            onStudentSelect={setSelectedStudent}
            placeholder="Search student to collect fees..."
          />
        </div> */}

        {selectedStudent && (
          <>
            <div className="student-info">
              <h3>Student: {selectedStudent.name} ({selectedStudent.id})</h3>
              <p>Class: {selectedStudent.class} | Session: {selectedStudent.session}</p>
              {studentDetails && (
                <div className="additional-details">
                  <p><strong>Phone:</strong> {studentDetails.phone || 'N/A'}</p>
                  <p><strong>Email:</strong> {studentDetails.email || 'N/A'}</p>
                  <p><strong>Address:</strong> {studentDetails.address || 'N/A'}</p>
                  <p><strong>Date of Birth:</strong> {studentDetails.dob || 'N/A'}</p>
                  <p><strong>Father's Name:</strong> {studentDetails.fatherName || 'N/A'}</p>
                  <p><strong>Mother's Name:</strong> {studentDetails.motherName || 'N/A'}</p>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="loading">Loading fee details...</div>
            ) : (
              <FeeSummaryTable fees={fees} />
            )}

            <div className="payment-section">
              {!showReceipt ? (
                <>
                  <h3>Payment Entry</h3>
                  <form onSubmit={handlePaymentSubmit} className="payment-form">
                    <div className="form-group">
                      <label>Amount to Pay (₹):</label>
                      <input
                        type="number"
                        name="amount"
                        value={paymentData.amount}
                        onChange={handleInputChange}
                        min="0"
                        max={totalDue}
                        step="0.01"
                        required
                      />
                      <small>Total due: ₹{totalDue.toLocaleString()}</small>
                    </div>

                    <div className="form-group">
                      <label>Payment Mode:</label>
                      <select
                        name="paymentMode"
                        value={paymentData.paymentMode}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select payment mode</option>
                        {paymentModes.map(mode => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Remarks (Optional):</label>
                      <textarea
                        name="remarks"
                        value={paymentData.remarks}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter any remarks..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading || !paymentData.amount || !paymentData.paymentMode}
                    >
                      {isLoading ? 'Processing...' : 'Collect Fees'}
                    </button>
                  </form>

                  {receipt && (
                    <div className="receipt-preview">
                      <h3>Receipt Generated Successfully!</h3>
                      <div className="receipt-info">
                        <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
                        <p><strong>Amount:</strong> ₹{receipt.amount.toLocaleString()}</p>
                        <p><strong>Payment Mode:</strong> {receipt.paymentMode}</p>
                        <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
                      </div>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowReceipt(true)}
                      >
                        Generate Receipt
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <ReceiptViewer
                  receipt={receipt}
                  onClose={() => setShowReceipt(false)}
                  onPrint={() => setAlert({ message: 'Receipt printed successfully!', type: 'success' })}
                />
              )}
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default CollectFees;
