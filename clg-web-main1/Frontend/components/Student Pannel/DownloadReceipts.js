import React from 'react';

const DownloadReceipts = () => {
  const receipts = [
    { id: 1, month: 'September', file: 'receipt_sep.pdf' },
    { id: 2, month: 'August', file: 'receipt_aug.pdf' }
  ];

  const handleDownload = (file) => {
    // Download logic
    alert(`Downloading ${file}`);
  };

  return (
    <div className="menu-content">
      <h1>Download Receipts</h1>
      <ul>
        {receipts.map(receipt => (
          <li key={receipt.id}>
            {receipt.month} - <button className="btn" onClick={() => handleDownload(receipt.file)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadReceipts;
