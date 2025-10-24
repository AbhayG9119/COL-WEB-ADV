import React, { useState } from 'react';
import jsPDF from 'jspdf';

// Mock student data for static version
const mockStudents = {
  '2023001': { name: 'Aman Verma', course: 'B.Tech', branch: 'CSE' },
  '2023002': { name: 'Priya Sharma', course: 'B.Tech', branch: 'ECE' },
  '2023003': { name: 'Rahul Kumar', course: 'B.Tech', branch: 'ME' },
  '2023004': { name: 'Sneha ', course: 'B.Tech', branch: 'CE' }
};

const CharacterCertificate = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    course: '',
    branch: ''
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

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica', 'bold');

    // Title
    doc.setFontSize(20);
    doc.text('CHARACTER CERTIFICATE', 105, 30, { align: 'center' });

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

    doc.text('has been a student of this institution and bears a good moral character.', 20, 165);

    doc.text('During the period of study, the student has shown good conduct and behavior.', 20, 175);

    // Date and signature
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 200);

    doc.text('Principal', 150, 220);
    doc.text('College Seal', 150, 230);

    // Save the PDF
    doc.save(`Character_Certificate_${formData.studentId}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId) {
      setMessage('Please enter Student ID');
      return;
    }

    setLoading(true);
    // Mock certificate generation for static version
    setTimeout(() => {
      setLoading(false);
      generatePDF(); // Generate and download PDF
      setMessage('Character Certificate issued successfully!');
      // Reset form
      setFormData({
        studentId: '',
        name: '',
        course: '',
        branch: ''
      });
    }, 1000); // Simulate generation delay
  };

  return (
    <div className="menu-content">
      <h1>Character Certificate</h1>
      <p>Generate character certificates for students.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cc-student-id">Student ID:</label>
          <input
            type="text"
            id="cc-student-id"
            name="studentId"
            value={formData.studentId}
            onChange={handleStudentIdChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cc-student-name">Student Name:</label>
          <input
            type="text"
            id="cc-student-name"
            name="name"
            value={formData.name}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="cc-course">Course:</label>
          <input
            type="text"
            id="cc-course"
            name="course"
            value={formData.course}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="cc-branch">Branch:</label>
          <input
            type="text"
            id="cc-branch"
            name="branch"
            value={formData.branch}
            readOnly
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate CC'}
        </button>
      </form>

      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
};

export default CharacterCertificate;
