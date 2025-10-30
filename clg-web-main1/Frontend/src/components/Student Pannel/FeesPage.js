import React, { useState } from 'react';
import FeesLedgerSection from './ViewFeeLedger';
import ReceiptDownloadSection from './DownloadReceipts';
import '../../styles/FeesModule.css';

const FeesPage = ({ activeSection }) => {
  // Sample data for fee ledger
  const [feeLedger] = useState([
    {
      transaction_id: 'TX2025-001',
      date: '2025-10-15',
      fee_type: 'Tuition',
      amount: 45000,
      payment_mode: 'UPI',
      status: 'Paid'
    },
    {
      transaction_id: 'TX2025-002',
      date: '2025-09-15',
      fee_type: 'Hostel',
      amount: 20000,
      payment_mode: 'Cash',
      status: 'Paid'
    },
    {
      transaction_id: 'TX2025-003',
      date: '2025-11-01',
      fee_type: 'Exam',
      amount: 5000,
      payment_mode: 'Online',
      status: 'Pending'
    },
    {
      transaction_id: 'TX2025-004',
      date: '2025-08-20',
      fee_type: 'Tuition',
      amount: 45000,
      payment_mode: 'UPI',
      status: 'Overdue'
    }
  ]);

  // Sample data for receipts
  const [receipts] = useState([
    {
      receipt_id: 'RCPT2025-001',
      fee_type: 'Tuition',
      amount: 45000,
      date: '2025-10-15',
      download_link: 'tuition_receipt_oct15.pdf'
    },
    {
      receipt_id: 'RCPT2025-002',
      fee_type: 'Hostel',
      amount: 20000,
      date: '2025-09-15',
      download_link: 'hostel_receipt_sep15.pdf'
    }
  ]);

  // State for filters
  const [filters, setFilters] = useState({ feeType: '', dateRange: { start: '', end: '' } });

  // State for selected receipt (if needed for modal)
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <div className="fees-page">
      <h1>Fees Module</h1>
      {activeSection === 'ledger' && (
        <FeesLedgerSection
          feeLedger={feeLedger}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      {activeSection === 'receipts' && (
        <ReceiptDownloadSection
          receipts={receipts}
          filters={filters}
          setFilters={setFilters}
          selectedReceipt={selectedReceipt}
          setSelectedReceipt={setSelectedReceipt}
        />
      )}
    </div>
  );
};

export default FeesPage;
