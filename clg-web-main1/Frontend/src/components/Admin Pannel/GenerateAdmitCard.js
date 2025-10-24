import React, { useState } from 'react';

const GenerateAdmitCard = () => {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [courseBranch, setCourseBranch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showSignature, setShowSignature] = useState(false);
  const [preview, setPreview] = useState(false);

  // Mock data
  const mockExams = [
    { name: 'Midterm Exam', date: '2023-10-15' },
    { name: 'Final Exam', date: '2023-12-20' },
  ];
  const mockStudents = [
    { id: 'S001', name: 'John Doe', course: 'CS' },
    { id: 'S002', name: 'Jane Smith', course: 'Math' },
  ];

  const handleExamChange = (e) => {
    const exam = e.target.value;
    setExamName(exam);
    const selectedExam = mockExams.find(e => e.name === exam);
    if (selectedExam) {
      setExamDate(selectedExam.date);
      setStudents(mockStudents.filter(s => !courseBranch || s.course === courseBranch));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setPreview(true);
  };

  const handleDownloadAll = () => {
    alert('Bulk PDF download simulated');
  };

  return (
    <div className="menu-content">
      <h1>Generate Admit Card</h1>
      <form>
        <div>
          <label htmlFor="admitcard-exam-select">Exam Name</label>
          <select id="admitcard-exam-select" value={examName} onChange={handleExamChange}>
            <option value="">Select Exam</option>
            {mockExams.map(exam => <option key={exam.name} value={exam.name}>{exam.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="admitcard-exam-date">Exam Date</label>
          <input id="admitcard-exam-date" type="date" value={examDate} readOnly />
        </div>
        <div>
          <label htmlFor="admitcard-course-branch">Course/Branch</label>
          <select id="admitcard-course-branch" value={courseBranch} onChange={(e) => setCourseBranch(e.target.value)}>
            <option value="">All</option>
            <option value="CS">Computer Science</option>
            <option value="Math">Mathematics</option>
          </select>
        </div>
        <div>
          <label>
            <input type="checkbox" onChange={handleSelectAll} />
            Select All
          </label>
        </div>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Name</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleStudentSelect(student.id)} /></td>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <label>
            <input type="checkbox" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} />
            Include Signature Block
          </label>
        </div>
        <button type="button" onClick={handleGenerate}>Generate</button>
        <button type="button" onClick={handleDownloadAll}>Download All</button>
        {preview && (
          <div className="admit-card-preview">
            <h2>Admit Card Preview</h2>
            {selectedStudents.map(id => {
              const student = students.find(s => s.id === id);
              return (
                <div key={id} className="admit-card">
                  <p>Student ID: {student.id}</p>
                  <p>Name: {student.name}</p>
                  <p>Exam: {examName}</p>
                  <p>Date: {examDate}</p>
                  <p>QR Code: [Mock QR - {student.id}-{examName}]</p>
                  {showSignature && <p>Signature: ____________________</p>}
                </div>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
};

export default GenerateAdmitCard;
