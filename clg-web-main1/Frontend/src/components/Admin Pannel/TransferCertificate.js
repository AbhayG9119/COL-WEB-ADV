import React, { useState } from 'react';
import jsPDF from 'jspdf';

// Mock student data for static version
const mockStudents = {
  '2023001': { name: 'Aman Verma', course: 'B.Tech', branch: 'CSE' },
  '2023002': { name: 'Priya Sharma', course: 'B.Tech', branch: 'ECE' },
  '2023003': { name: 'Rahul Kumar', course: 'B.Tech', branch: 'ME' },
  '2023004': { name: 'Sneha', course: 'B.Tech', branch: 'CE' }
};

const TransferCertificate = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    course: '',
    branch: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleStudentIdChange = async (e) => {
    const studentId = e.target.value;
    setFormData(prev => ({ ...prev, studentId }));

    if (studentId.trim()) {
      setLoading(true);
      // Mock API call for static version
      setTimeout(() => {
        const student = mockStudents[studentId];
        setLoading(false);

        if (student) {
          setFormData(prev => ({
            ...prev,
            name: student.name,
            course: student.course,
            branch: student.branch
          }));
          setMessage('');
        } else {
          setFormData(prev => ({ ...prev, name: '', course: '', branch: '' }));
          setMessage('Student not found');
        }
      }, 500); // Simulate API delay
    } else {
      setFormData(prev => ({ ...prev, name: '', course: '', branch: '' }));
      setMessage('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica', 'bold');

    // Title
    doc.setFontSize(20);
    doc.text('TRANSFER CERTIFICATE', 105, 30, { align: 'center' });

    // Institution details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('College Name', 20, 50);
    doc.text('Address Line 1', 20, 60);
    doc.text('Address Line 2', 20, 70);
    doc.text('City, State - PIN', 20, 80);

    // Certificate content
    doc.setFontSize(14);
    doc.text('This is to certify that', 20, 100);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.name, 20, 115);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student ID: ${formData.studentId}`, 20, 130);
    doc.text(`Course: ${formData.course}`, 20, 140);
    doc.text(`Branch: ${formData.branch}`, 20, 150);

    doc.text('has been a student of this institution and is leaving for the following reason:', 20, 165);

    doc.setFont('helvetica', 'bold');
    doc.text(formData.reason, 20, 180);

    // Date and signature
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 200);

    doc.text('Principal', 150, 220);
    doc.text('College Seal', 150, 230);

    // Save the PDF
    doc.save(`Transfer_Certificate_${formData.studentId}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId || !formData.reason) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Mock certificate generation for static version
    setTimeout(() => {
      setLoading(false);
      generatePDF(); // Generate and download PDF
      setMessage('Transfer Certificate issued successfully!');
      // Reset form
      setFormData({
        studentId: '',
        name: '',
        course: '',
        branch: '',
        reason: ''
      });
    }, 1000); // Simulate generation delay
  };

  return (
    <div className="menu-content">
      <h1>Transfer Certificate</h1>
      <p>Generate transfer certificates for students.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tc-student-id">Student ID:</label>
          <input
            type="text"
            id="tc-student-id"
            name="studentId"
            value={formData.studentId}
            onChange={handleStudentIdChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tc-student-name">Student Name:</label>
          <input
            type="text"
            id="tc-student-name"
            name="name"
            value={formData.name}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="tc-course">Course:</label>
          <input
            type="text"
            id="tc-course"
            name="course"
            value={formData.course}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="tc-branch">Branch:</label>
          <input
            type="text"
            id="tc-branch"
            name="branch"
            value={formData.branch}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="tc-reason">Reason for Transfer:</label>
          <input
            type="text"
            id="tc-reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate TC'}
        </button>
      </form>

      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
};

export default TransferCertificate;
