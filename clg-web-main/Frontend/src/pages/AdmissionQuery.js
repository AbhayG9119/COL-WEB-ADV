import React, { useState } from 'react';
import '../styles/AdmissionQuery.css';

function AdmissionQuery() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    pincode: '',
    course: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('pincode', formData.pincode);
    formDataToSend.append('course', formData.course);
    formDataToSend.append('message', formData.message);

    fetch('http://localhost:5000/api/admission-query', {
      method: 'POST',
      body: formDataToSend,
    })
      .then(response => {
        if (response.ok) {
          alert("✅ Form Submitted Successfully!");
          setFormData({
            name: '',
            email: '',
            phone: '',
            location: '',
            pincode: '',
            course: '',
            message: ''
          });
        } else {
          alert("⚠️ Submission Failed! Please try again.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("❌ Error submitting form! Please check your internet connection.");
      });
  };

  return (
    <section className="admission-form">
      <div className="container">
        <h2 className="page-title">Admission Enquiry</h2>
        <p className="para">Fill in your details and our team will connect with you shortly.</p>
        <form id="enquiryForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input type="text" id="name" name="name" placeholder="Enter your full name" required value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" placeholder="Enter your email address" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Mobile Number *</label>
            <input type="tel" id="phone" name="phone" placeholder="Enter your mobile number" required value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location / City *</label>
            <input type="text" id="location" name="location" placeholder="Enter your city / address" required value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode *</label>
            <input type="text" id="pincode" name="pincode" placeholder="Enter your pincode" required value={formData.pincode} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="course">Select Course *</label>
            <select id="course" name="course" required value={formData.course} onChange={handleChange}>
              <option value="">-- Choose a Course --</option>
              <option value="ba">Bachelor of Arts (B.A)</option>
              <option value="bsc">Bachelor of Science (B.Sc)</option>
              <option value="bed">Bachelor of Education (B.Ed)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Query</label>
            <textarea id="message" name="message" rows="4" placeholder="Write your query here..." value={formData.message} onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn-submit">Submit</button>
        </form>
      </div>
    </section>
  );
}

export default AdmissionQuery;
