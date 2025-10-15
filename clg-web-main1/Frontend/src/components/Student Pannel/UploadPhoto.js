import React, { useState } from 'react';

const UploadPhoto = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Upload logic here
    alert('Photo uploaded successfully!');
  };

  return (
    <div className="menu-content">
      <h1>Upload Profile Picture</h1>
      <p>Upload your photo for ID card and dashboard display. Cropping and preview available.</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && <p>Selected: {selectedFile.name}</p>}
      <button className="btn" onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPhoto;
