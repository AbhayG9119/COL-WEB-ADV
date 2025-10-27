import React, { useState, useEffect } from 'react';
import './AssignClass.css';

// Static JSON data for classes and subjects
const staticClasses = [
  {
    class_id: "C101",
    class_name: "Physics 101",
    section: "A",
    academic_year: "2025"
  },
  {
    class_id: "C102",
    class_name: "Chemistry 101",
    section: "B",
    academic_year: "2025"
  },
  {
    class_id: "C103",
    class_name: "Mathematics 101",
    section: "A",
    academic_year: "2025"
  }
];

const staticSubjects = {
  "C101": [
    {
      subject_id: "S101",
      subject_name: "Mechanics",
      subject_code: "PHY101",
      subject_type: "Theory",
      semester: "5"
    },
    {
      subject_id: "S102",
      subject_name: "Physics Lab",
      subject_code: "PHY101L",
      subject_type: "Lab",
      semester: "5"
    }
  ],
  "C102": [
    {
      subject_id: "S201",
      subject_name: "Organic Chemistry",
      subject_code: "CHEM101",
      subject_type: "Theory",
      semester: "5"
    }
  ],
  "C103": [
    {
      subject_id: "S301",
      subject_name: "Calculus",
      subject_code: "MATH101",
      subject_type: "Theory",
      semester: "5"
    },
    {
      subject_id: "S302",
      subject_name: "Linear Algebra",
      subject_code: "MATH102",
      subject_type: "Theory",
      semester: "5"
    }
  ]
};

const AssignClass = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Load static classes on component mount
    setClasses(staticClasses);
  }, []);

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setSubjects(staticSubjects[classItem.class_id] || []);
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setSelectedClass(null);
    setSubjects([]);
    setShowPanel(false);
  };

  return (
    <div className="assign-class">
      <h1>Assigned Classes</h1>
      <table className="classes-table">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Section</th>
            <th>Academic Year</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map(cls => (
              <tr key={cls.class_id} onClick={() => handleClassClick(cls)} tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && handleClassClick(cls)}>
                <td>{cls.class_name}</td>
                <td>{cls.section}</td>
                <td>{cls.academic_year}</td>
              </tr>
            ))
          ) : (
            <tr className="empty-state">
              <td colSpan="3">No classes assigned yet</td>
            </tr>
          )}
        </tbody>
      </table>

      {showPanel && selectedClass && (
        <div className="subject-panel">
          <h2>Subjects for {selectedClass.class_name} - Section {selectedClass.section}</h2>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? (
                subjects.map(sub => (
                  <tr key={sub.subject_id} className={sub.subject_type === 'Theory' ? 'theory-row' : 'lab-row'}>
                    <td>{sub.subject_name}</td>
                    <td>{sub.subject_code}</td>
                    <td>{sub.subject_type}</td>
                    <td>{sub.semester}</td>
                  </tr>
                ))
              ) : (
                <tr className="empty-state">
                  <td colSpan="4">No subjects mapped to this class</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="close-btn" onClick={handleClosePanel}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AssignClass;
