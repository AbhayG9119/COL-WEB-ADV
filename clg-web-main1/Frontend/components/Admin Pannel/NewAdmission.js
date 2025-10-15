import React, { useState } from 'react';

const NewAdmission = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    tempPassword: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    guardianName: '',
    guardianContact: '',
    previousQualification: '',
    courseApplied: '',
    admissionCategory: '',
    documents: {
      marksheet: '',
      idProof: '',
      photo: ''
    },
    admissionFee: '',
    feeStatus: 'Pending',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name.startsWith('documents.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/new-admission/admit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to admit student');
      }

      const data = await response.json();
      setMessage(`Student admitted successfully! Student ID: ${data.admission.studentId}, Temp Password: ${data.admission.tempPassword}`);

      // Reset form
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        tempPassword: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        address: {
          street: '',
          city: '',
          state: '',
          pincode: ''
        },
        guardianName: '',
        guardianContact: '',
        previousQualification: '',
        courseApplied: '',
        admissionCategory: '',
        documents: {
          marksheet: '',
          idProof: '',
          photo: ''
        },
        admissionFee: '',
        feeStatus: 'Pending',
        remarks: ''
      });
    } catch (error) {
      setMessage('Error admitting student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-content">
      <h1>New Admission</h1>
      <p>Admit new students to the institution</p>

      {message && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? '#c62828' : '#2e7d32',
          whiteSpace: 'pre-line'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        {/* Basic Information */}
        <fieldset style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
          <legend><strong>Basic Information</strong></legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Mobile Number:</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>Temporary Password:</label>
            <input
              type="password"
              name="tempPassword"
              value={formData.tempPassword}
              onChange={handleInputChange}
              required
              placeholder="Set temporary password for student"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </fieldset>

        {/* Personal Details */}
        <fieldset style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
          <legend><strong>Personal Details</strong></legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Blood Group:</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div style={{ marginTop: '15px' }}>
            <h4>Address</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Street Address"
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>

          {/* Guardian Details */}
          <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label>Guardian Name:</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Guardian Contact:</label>
              <input
                type="tel"
                name="guardianContact"
                value={formData.guardianContact}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
        </fieldset>

        {/* Academic Details */}
        <fieldset style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
          <legend><strong>Academic Details</strong></legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label>Previous Qualification:</label>
              <input
                type="text"
                name="previousQualification"
                value={formData.previousQualification}
                onChange={handleInputChange}
                required
                placeholder="e.g., 12th Standard"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Course Applied:</label>
              <select
                name="courseApplied"
                value={formData.courseApplied}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Course</option>
                <option value="B.A">B.A</option>
                <option value="B.Sc">B.Sc</option>
                <option value="B.Ed">B.Ed</option>
              </select>
            </div>
            <div>
              <label>Admission Category:</label>
              <select
                name="admissionCategory"
                value={formData.admissionCategory}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="Management">Management</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Documents */}
        <fieldset style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
          <legend><strong>Documents</strong></legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label>Marksheet Path:</label>
              <input
                type="text"
                name="documents.marksheet"
                value={formData.documents.marksheet}
                onChange={handleInputChange}
                placeholder="Upload path or URL"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>ID Proof Path:</label>
              <input
                type="text"
                name="documents.idProof"
                value={formData.documents.idProof}
                onChange={handleInputChange}
                placeholder="Upload path or URL"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Photo Path:</label>
              <input
                type="text"
                name="documents.photo"
                value={formData.documents.photo}
                onChange={handleInputChange}
                placeholder="Upload path or URL"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
        </fieldset>

        {/* Fee Details */}
        <fieldset style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
          <legend><strong>Fee Details</strong></legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label>Admission Fee:</label>
              <input
                type="number"
                name="admissionFee"
                value={formData.admissionFee}
                onChange={handleInputChange}
                required
                placeholder="Enter admission fee"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Fee Status:</label>
              <select
                name="feeStatus"
                value={formData.feeStatus}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label>Remarks:</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Additional remarks..."
              rows="3"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Admitting Student...' : 'Admit Student'}
        </button>
      </form>
    </div>
  );
};

export default NewAdmission;
