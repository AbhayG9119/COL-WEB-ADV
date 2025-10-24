import React, { useState } from 'react';

const PrintAdmitCard = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [examName, setExamName] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [preview, setPreview] = useState(false);

  // Mock data
  const mockAdmitCards = {
    'S001': { name: 'John Doe', exam: 'Midterm Exam' },
    'S002': { name: 'Jane Smith', exam: 'Final Exam' },
  };

  const handleStudentIdChange = (e) => {
    const id = e.target.value;
    setStudentId(id);
    if (mockAdmitCards[id]) {
      setName(mockAdmitCards[id].name);
      setExamName(mockAdmitCards[id].exam);
      setPreview(true);
    } else {
      setName('');
      setExamName('');
      setPreview(false);
    }
  };

  const handleDownload = () => {
    alert('PDF download simulated');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="menu-content">
      <h1>Print Admit Card</h1>
      <form>
        <div>
          <label htmlFor="print-admit-student-id">Student ID</label>
          <input
            id="print-admit-student-id"
            type="text"
            value={studentId}
            onChange={handleStudentIdChange}
            placeholder="Enter Student ID"
          />
        </div>
        <div>
          <label htmlFor="print-admit-name">Name</label>
          <input id="print-admit-name" type="text" value={name} readOnly />
        </div>
        <div>
          <label htmlFor="print-admit-exam">Exam Name</label>
          <input id="print-admit-exam" type="text" value={examName} readOnly />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} />
            Include Signature Block
          </label>
        </div>
        {preview && (
          <div className="admit-card-preview">
            <h2>Admit Card Preview</h2>
            <p>Student ID: {studentId}</p>
            <p>Name: {name}</p>
            <p>Exam: {examName}</p>
            <p>QR Code: [Mock QR - {studentId}-{examName}]</p>
            {showSignature && <p>Signature: ____________________</p>}
            <button onClick={handleDownload}>Download</button>
            <button onClick={handlePrint}>Print</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PrintAdmitCard;
