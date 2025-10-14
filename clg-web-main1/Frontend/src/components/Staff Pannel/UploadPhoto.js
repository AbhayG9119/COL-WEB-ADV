import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadPhoto = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post('http://localhost:5000/api/staff/profile-picture', formData, config);

      setMessage('Profile picture uploaded successfully!');
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Optionally refresh the page or update parent component
      setTimeout(() => {
        window.location.reload(); // Simple refresh to show new picture
      }, 1500);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-photo-container">
      <h1>Upload Profile Photo</h1>
      <p>Upload and crop profile picture for ID card, attendance logs, and dashboard.</p>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {message && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}

      <div className="upload-section">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          style={{ marginBottom: '10px' }}
        />

        {preview && (
          <div className="preview-section" style={{ marginBottom: '20px' }}>
            <h3>Preview:</h3>
            <img
              src={preview}
              alt="Profile Preview"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ccc'
              }}
            />
          </div>
        )}

        <div className="upload-actions">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: selectedFile && !uploading ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>

          <button
            onClick={handleCancel}
            disabled={uploading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="upload-info" style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Supported formats:</strong> JPEG, PNG, GIF</p>
        <p><strong>Maximum file size:</strong> 5MB</p>
        <p><strong>Recommended:</strong> Square images (1:1 aspect ratio) for best results</p>
      </div>
    </div>
  );
};

export default UploadPhoto;
