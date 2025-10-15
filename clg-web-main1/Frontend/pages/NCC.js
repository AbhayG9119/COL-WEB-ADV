import React, { useState } from 'react';
import '../styles/ncc.css';

// import ncc1 from '../images/ncc1.jpeg';
// import ncc2 from '../images/ncc2.jpeg';
// import ncc5 from '../images/ncc5.jpeg';
// import ncc6 from '../images/ncc6.jpeg';
// import ncc7 from '../images/ncc7.jpeg';
// import ncc8 from '../images/ncc8.jpeg';

function NCC() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      // Basic email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Invalid email address';
      }
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/api/ncc-query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentName: formData.name,
            email: formData.email,
            phone: formData.phone,
            course: formData.course,
            reason: formData.message
          }),
        });

        if (response.ok) {
          alert("✅ Your NCC query has been submitted successfully!");
          setFormData({
            name: '',
            email: '',
            phone: '',
            course: '',
            message: ''
          });
        } else {
          alert("❌ Something went wrong. Try again!");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("❌ Error submitting form! Please check your internet connection.");
      }
    }
  };

  return (
    <div className="ncc-page">
      <div className="container">
        <div className="heading1">
          <h1 className="h1">National Cadet Corps (NCC)</h1>
          <p>"Unity and Discipline" – Building Responsible Citizens of Tomorrow</p>
        </div>

        {/* Top bar for direct connection to NCC website */}
        <div className="ncc-top-bar">
          <h2 className="ncc-top-bar-heading">Official NCC Website</h2>
          <div className="ncc-top-bar-divider">
            <span className="ncc-icon">🎖️</span>
          </div>
          <button className="ncc-top-bar-link" onClick={() => window.open('https://nis.bisag-n.gov.in', '_blank')}>
            Visit
          </button>
        </div>

        <div className="grid">
          <div className="card">
            <h2>About NCC</h2>
            <p>
              The National Cadet Corps (NCC) at Sw. Narendra Singh Mahavidyalaya aims to develop qualities of leadership,
              discipline, secular outlook, and selfless service among the youth. NCC provides a platform for cadets to serve the nation,
              participate in adventure activities, and build a strong character while contributing to the community.
            </p>
          </div>

          <div className="card">
            <h2>Objectives</h2>
            <ul>
              <li>To instill discipline and leadership qualities in students.</li>
              <li>To create a sense of adventure, courage, and confidence.</li>
              <li>To prepare students for careers in defense and civil services.</li>
              <li>To promote unity, selfless service, and social responsibility.</li>
            </ul>
          </div>
        </div>

        <div className="highlight">Our Motto: Unity and Discipline</div>

        <div className="grid">
          <div className="card">
            <h2>Training Activities</h2>
            <p>
              NCC cadets participate in parades, drill training, weapon training, and adventure sports. Camps such as
              Republic Day Camp, Annual Training Camp, and Trekking Camps help students gain exposure to real-life challenges.
            </p>
          </div>

          <div className="card">
            <h2>Social Service</h2>
            <p>
              Our cadets actively contribute to social awareness campaigns like tree plantation drives, Swachh Bharat
              Abhiyan, blood donation camps, and disaster relief activities, showing their commitment to society.
            </p>
          </div>

          <div className="card">
            <h2>Career Opportunities</h2>
            <p>
              NCC certification benefits students in various competitive exams and defense services. Many cadets get direct
              entry to the armed forces and gain an edge in civil services and public sector jobs.
            </p>
          </div>
        </div>

        <div className="card1">
          <h2>Enrollment Process</h2>
          <p>
            Students can enroll in NCC by filling out the registration form available at the college office. Selection is
            based on physical fitness, discipline, and dedication to serve the nation. Both male and female students are
            encouraged to join.
          </p>
          <h3>Qualification</h3>
          <ul>
            <li>12th Pass</li>
            <li>Maximum Age of 23 years</li>
            <li>No Criminal Record</li>
            <li>Enrollment is Necessary</li>
          </ul>
        </div>

        <div className="highlight">NCC – A Pathway to Discipline, Leadership, and Service</div>
      </div>

      <div className="container">
        {/* NCC Timings */}
        <section>
          <div className="card">
            <h2>NCC Training Timings</h2>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Day">Monday</td>
                  <td data-label="Time">11:00 AM - 1:30 PM</td>
                  <td data-label="Activity">Drill Practice By PI</td>
                </tr>
                <tr>
                  <td data-label="Day">Wednesday</td>
                  <td data-label="Time">11:00 AM - 1:30 PM</td>
                  <td data-label="Activity">Class Lecture By ANO</td>
                </tr>
                <tr>
                  <td data-label="Day">Thursday</td>
                  <td data-label="Time">11:00 AM - 1:30 PM</td>
                  <td data-label="Activity">Drill Practice By PI</td>
                </tr>
                <tr>
                  <td data-label="Day">Friday</td>
                  <td data-label="Time">11:00 AM - 1:30 PM</td>
                  <td data-label="Activity">Class Lecture By ANO</td>
                </tr>
                <tr>
                  <td data-label="Day">Saturday</td>
                  <td data-label="Time">11:00 AM - 1:30 PM</td>
                  <td data-label="Activity">Class Lecture By ANO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* NCC Events */}
        <section>
          <h2>Our NCC Events</h2>
          <div className="ncc-events">
            <div className="event-card">
              <h3>Independence Day Parade</h3>
              <p>Annual parade with flag hoisting and cultural programs.</p>
            </div>
            <div className="event-card">
              <h3>Blood Donation Camp</h3>
              <p>Organized in collaboration with local hospitals.</p>
            </div>
            <div className="event-card">
              <h3>National Camps</h3>
              <p>Participation in Republic Day Camp, Thal Sainik Camp, etc.</p>
            </div>
            <div className="event-card">
              <h3>Social Service</h3>
              <p>Tree plantation, cleanliness drives, and awareness programs.</p>
            </div>
          </div>
        </section>

        {/* NCC Gallery */}
        <section>
          <h2>NCC Gallery</h2>
          <div className="gallery">
            <div className="gallery-item">
              <img src="/images/ncc2.jpeg" alt="NCC Parade" />
              <div className="caption">NCC Parade</div>
            </div>
            <div className="gallery-item">
              <img src="/images/ncc1.jpeg" alt="NCC Parade" />
              <div className="caption">NCC Parade</div>
            </div>
            <div className="gallery-item">
              <img src="/images/ncc5.jpeg" alt="NCC Day" />
              <div className="caption">NCC Day</div>
            </div>
            <div className="gallery-item">
              <img src="/images/ncc6.jpeg" alt="Tree Plantation" />
              <div className="caption">Tree Plantation</div>
            </div>
            <div className="gallery-item">
              <img src="/images/ncc7.jpeg" alt="Swachh Bharat" />
              <div className="caption">Swachh Bharat</div>
            </div>
            <div className="gallery-item">
              <img src="/images/ncc8.jpeg" alt="Guest Lecture" />
              <div className="caption">Guest Lecture</div>
            </div>
          </div>
        </section>

        {/* NCC Query Form Section */}
<section className="ncc-query-section">
  <h2 className="form-title">NCC Query Form</h2>
  <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
    
    {/* Full Name */}
    <div className="form-group">
      <label htmlFor="name">Full Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={formErrors.name ? 'error' : ''}
        placeholder="Enter your full name"
      />
      {formErrors.name && <span className="error-message">{formErrors.name}</span>}
    </div>

    {/* Email */}
    <div className="form-group">
      <label htmlFor="email">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={formErrors.email ? 'error' : ''}
        placeholder="Enter your email address"
      />
      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
    </div>

    {/* Phone */}
    <div className="form-group">
      <label htmlFor="phone">Phone Number</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className={formErrors.phone ? 'error' : ''}
        placeholder="Enter your phone number"
      />
      {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
    </div>

    {/* Course / Class */}
    <div className="form-group">
      <label htmlFor="course">Current Course</label>
      <input
        type="text"
        id="course"
        name="course"
        value={formData.course}
        onChange={handleChange}
        className={formErrors.course ? 'error' : ''}
        placeholder="Enter your current course or class (e.g. B.A., B.Sc.)"
      />
      {formErrors.course && <span className="error-message">{formErrors.course}</span>}
    </div>
    {/* Message */}
    <div className="form-group">
      <label htmlFor="message">Message / Query</label>
      <textarea
        id="message"
        name="message"
        rows="4"
        value={formData.message}
        onChange={handleChange}
        className={formErrors.message ? 'error' : ''}
        placeholder="Enter your message or query"
      />
      {formErrors.message && <span className="error-message">{formErrors.message}</span>}
    </div>

    {/* Submit */}
    <button type="submit" className="submit-button">Submit</button>
  </form>
</section>

      </div>
    </div>
  );
}

export default NCC;
