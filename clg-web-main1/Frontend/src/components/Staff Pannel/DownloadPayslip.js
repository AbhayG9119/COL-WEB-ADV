import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DownloadPayslip = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDownload = () => {
    setLoading(true);
    setMessage('');
    try {
      const doc = new jsPDF();

      // Mock data for payslip
      const employeeData = {
        name: 'John Doe',
        id: 'EMP001',
        department: 'IT',
        month: selectedMonth,
        basicSalary: 50000,
        hra: 10000,
        conveyance: 1920,
        medical: 1250,
        lta: 5000,
        deductions: {
          pf: 6000,
          professionalTax: 200,
          incomeTax: 5000
        }
      };

      // Calculate totals
      const earnings = employeeData.basicSalary + employeeData.hra + employeeData.conveyance + employeeData.medical + employeeData.lta;
      const deductions = employeeData.deductions.pf + employeeData.deductions.professionalTax + employeeData.deductions.incomeTax;
      const netSalary = earnings - deductions;

      // Header
      doc.setFontSize(20);
      doc.text('PAYSLIP', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Month: ${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`, 20, 35);

      // Employee Details
      doc.text('Employee Details:', 20, 50);
      doc.text(`Name: ${employeeData.name}`, 20, 60);
      doc.text(`ID: ${employeeData.id}`, 20, 70);
      doc.text(`Department: ${employeeData.department}`, 20, 80);

      // Earnings Table
      doc.text('Earnings:', 20, 100);
      autoTable(doc, {
        startY: 105,
        head: [['Description', 'Amount (₹)']],
        body: [
          ['Basic Salary', employeeData.basicSalary.toString()],
          ['HRA', employeeData.hra.toString()],
          ['Conveyance', employeeData.conveyance.toString()],
          ['Medical', employeeData.medical.toString()],
          ['LTA', employeeData.lta.toString()],
          ['Total Earnings', earnings.toString()]
        ],
        theme: 'grid'
      });

      // Deductions Table
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text('Deductions:', 20, finalY);
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Description', 'Amount (₹)']],
        body: [
          ['PF', employeeData.deductions.pf.toString()],
          ['Professional Tax', employeeData.deductions.professionalTax.toString()],
          ['Income Tax', employeeData.deductions.incomeTax.toString()],
          ['Total Deductions', deductions.toString()]
        ],
        theme: 'grid'
      });

      // Net Salary
      const finalY2 = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text(`Net Salary: ₹${netSalary}`, 20, finalY2);

      // Generate PDF blob and download
      const pdfBlob = doc.output('blob');
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${selectedMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setMessage('Payslip downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      setMessage('Error generating payslip: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="download-payslip">
      <h1>Download Payslip</h1>
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
        <button onClick={handleDownload} disabled={loading}>Download PDF</button>
      </div>
      {loading && <p>Downloading...</p>}
      {message && <div className={`status-message ${message.includes('downloaded') ? 'success' : 'error'}`}>{message}</div>}
    </div>
  );
};

export default DownloadPayslip;
