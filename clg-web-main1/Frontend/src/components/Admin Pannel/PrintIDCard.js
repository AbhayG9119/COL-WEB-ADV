import React, { useState } from 'react';

const PrintIDCard = () => {
  const [userType, setUserType] = useState('Student');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const [preview, setPreview] = useState(false);

  // Mock data for auto-fetch
  const mockData = {
    'S001': { name: 'John Doe', department: 'Computer Science', photo: 'https://via.placeholder.com/150' },
    'T001': { name: 'Jane Smith', department: 'Mathematics', photo: 'https://via.placeholder.com/150' },
  };

  const handleUserIdChange = (e) => {
    const id = e.target.value;
    setUserId(id);
    if (mockData[id]) {
      setName(mockData[id].name);
      setDepartment(mockData[id].department);
      setPhoto(mockData[id].photo);
    } else {
      setName('');
      setDepartment('');
      setPhoto(null);
    }
  };

  const handleGenerate = () => {
    setPreview(true);
  };

  const handleDownload = () => {
    alert('PDF download simulated');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="menu-content">
      <h1>Print ID Card</h1>
      <form>
        <div>
          <label htmlFor="idcard-user-type">User Type</label>
          <select id="idcard-user-type" value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div>
          <label htmlFor="idcard-user-id">User ID</label>
          <input
            id="idcard-user-id"
            type="text"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="Enter ID"
            title="Enter User ID to auto-fetch details"
          />
        </div>
        <div>
          <label htmlFor="idcard-name">Name</label>
          <input id="idcard-name" type="text" value={name} readOnly />
        </div>
        <div>
          <label htmlFor="idcard-department">Department</label>
          <input id="idcard-department" type="text" value={department} readOnly />
        </div>
        <div>
          <label htmlFor="idcard-photo">Photo Upload</label>
          <input
            id="idcard-photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
            title="Upload passport-size photo"
          />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} />
            Include Signature Block
          </label>
        </div>
        <button type="button" onClick={handleGenerate}>Generate</button>
        {preview && (
          <div className="id-card-preview">
            <h2>ID Card Preview</h2>
            {photo && <img src={photo} alt="Photo" width="100" />}
            <p>Name: {name}</p>
            <p>Department: {department}</p>
            <p>QR Code: [Mock QR - {userId}-{name}]</p>
            {showSignature && <p>Signature: ____________________</p>}
            <button onClick={handleDownload}>Download</button>
            <button onClick={handlePrint}>Print</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PrintIDCard;
