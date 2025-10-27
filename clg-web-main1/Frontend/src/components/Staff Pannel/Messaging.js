import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { toast } from 'react-toastify';

const Messaging = () => {

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Removed fetchMessages as per spec - staff only send, no view sent messages here

  const fetchCourses = async () => {
    // Mock data for demonstration
    const mockCourses = [
      { _id: '1', name: 'Computer Science' },
      { _id: '2', name: 'Mechanical Engineering' },
      { _id: '3', name: 'Electrical Engineering' }
    ];
    setCourses(mockCourses.map(course => ({ value: course._id, label: course.name })));
    // Uncomment below for real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
    //   const res = await axios.get('/api/courses', config);
    //   setCourses(res.data.map(course => ({ value: course._id, label: course.name })));
    // } catch (error) {
    //   console.error('Error fetching courses:', error);
    // }
  };

  const fetchSemesters = async (courseId) => {
    // Mock data for demonstration
    const mockSemesters = [
      { _id: '1', name: 'Semester 1' },
      { _id: '2', name: 'Semester 2' },
      { _id: '3', name: 'Semester 3' }
    ];
    setSemesters(mockSemesters.map(sem => ({ value: sem._id, label: sem.name })));
    // Uncomment below for real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
    //   const res = await axios.get(`/api/courses/${courseId}/semesters`, config);
    //   setSemesters(res.data.map(sem => ({ value: sem._id, label: sem.name })));
    // } catch (error) {
    //   console.error('Error fetching semesters:', error);
    // }
  };

  const fetchSections = async (semesterId) => {
    // Mock data for demonstration
    const mockSections = [
      { _id: '1', name: 'Section A' },
      { _id: '2', name: 'Section B' },
      { _id: '3', name: 'Section C' }
    ];
    setSections(mockSections.map(sec => ({ value: sec._id, label: sec.name })));
    // Uncomment below for real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
    //   const res = await axios.get(`/api/semesters/${semesterId}/sections`, config);
    //   setSections(res.data.map(sec => ({ value: sec._id, label: sec.name })));
    // } catch (error) {
    //   console.error('Error fetching sections:', error);
    // }
  };

  const fetchStudents = async (sectionId) => {
    // Mock data for demonstration
    const mockStudents = [
      { _id: '1', name: 'John Doe' },
      { _id: '2', name: 'Jane Smith' },
      { _id: '3', name: 'Bob Johnson' },
      { _id: '4', name: 'Alice Brown' }
    ];
    setStudents(mockStudents.map(stu => ({ value: stu._id, label: stu.name })));
    // Uncomment below for real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
    //   const res = await axios.get(`/api/sections/${sectionId}/students`, config);
    //   setStudents(res.data.map(stu => ({ value: stu._id, label: stu.name })));
    // } catch (error) {
    //   console.error('Error fetching students:', error);
    // }
  };

  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedStudents([]);
    setSemesters([]);
    setSections([]);
    setStudents([]);
    if (selectedOption) {
      fetchSemesters(selectedOption.value);
    }
  };

  const handleSemesterChange = (selectedOption) => {
    setSelectedSemester(selectedOption);
    setSelectedSection(null);
    setSelectedStudents([]);
    setSections([]);
    setStudents([]);
    if (selectedOption) {
      fetchSections(selectedOption.value);
    }
  };

  const handleSectionChange = (selectedOption) => {
    setSelectedSection(selectedOption);
    setSelectedStudents([]);
    setStudents([]);
    if (selectedOption) {
      fetchStudents(selectedOption.value);
    }
  };

  const handleStudentChange = (selectedOptions) => {
    setSelectedStudents(selectedOptions);
  };

  const resetForm = () => {
    setSubject('');
    setBody('');
    setSelectedCourse(null);
    setSelectedSemester(null);
    setSelectedSection(null);
    setSelectedStudents([]);
    setSemesters([]);
    setSections([]);
    setStudents([]);
  };

  const sendMessage = async () => {
    if (!subject.trim() || !body.trim() || selectedStudents.length === 0) {
      toast.error('Please fill all required fields and select at least one student.');
      return;
    }
    setLoading(true);
    // Mock send message for demonstration
    setTimeout(() => {
      toast.success('Message sent successfully! (Mock)');
      resetForm();
      setLoading(false);
    }, 1000);
    // Uncomment below for real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const config = { headers: { Authorization: `Bearer ${token}` } };
    //   const recipientIds = selectedStudents.map(stu => stu.value);
    //   await axios.post('/api/message', {
    //     sender_id: 'current_user_id', // Assuming current user ID is available
    //     recipient_ids: recipientIds,
    //     subject,
    //     body,
    //     timestamp: new Date().toISOString(),
    //     status: 'sent'
    //   }, config);
    //   toast.success('Message sent successfully!');
    //   resetForm();
    // } catch (error) {
    //   console.error('Error sending message:', error);
    //   toast.error('Failed to send message.');
    // }
    // setLoading(false);
  };

  return (
    <div className="messaging">
      <h1>Messaging</h1>
      <div className="send-message">
        <input
          type="text"
          placeholder="Subject (max 100 chars)"
          value={subject}
          onChange={(e) => setSubject(e.target.value.slice(0, 100))}
          maxLength="100"
          required
        />
        <ReactQuill
          value={body}
          onChange={setBody}
          placeholder="Message Body (max 5000 chars)"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
          }}
          formats={[
            'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent', 'link', 'image'
          ]}
        />
        <div className="filters">
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            options={courses}
            placeholder="Select Course"
            isClearable
          />
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            options={semesters}
            placeholder="Select Semester"
            isClearable
            isDisabled={!selectedCourse}
          />
          <Select
            value={selectedSection}
            onChange={handleSectionChange}
            options={sections}
            placeholder="Select Section"
            isClearable
            isDisabled={!selectedSemester}
          />
          <Select
            value={selectedStudents}
            onChange={handleStudentChange}
            options={students}
            placeholder="Select Students"
            isMulti
            isDisabled={!selectedSection}
          />
        </div>
        <div className="buttons">
          <button onClick={sendMessage} disabled={loading || !subject.trim() || !body.trim() || selectedStudents.length === 0}>
            {loading ? 'Sending...' : 'Send'}
          </button>
          <button onClick={resetForm} disabled={loading}>Reset</button>
        </div>
      </div>

    </div>
  );
};

export default Messaging;
