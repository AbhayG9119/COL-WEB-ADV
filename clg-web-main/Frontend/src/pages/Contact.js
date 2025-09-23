import React, { useState } from 'react';
import '../styles/Contact.css';


function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    subject: '',
    message: ''
  });
  const [file, setFile] = useState(null);

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
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('message', formData.message);
    if (file) {
      formDataToSend.append('attachment', file);
    }

    fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      body: formDataToSend,
    })
      .then(response => {
        if (response.ok) {
          alert("✅ Your message has been sent successfully!");
          setFormData({
            name: '',
            email: '',
            phone: '',
            location: '',
            subject: '',
            message: ''
          });
          setFile(null);
        } else {
          alert("❌ Something went wrong. Try again!");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("❌ Error submitting form! Please check your internet connection.");
      });
  };

  return (
    <>
      <h4 className="sectionHeader">Contact us</h4>

      <section>
        <h1 className="heading">Get in touch</h1>
        <p className="sub-heading">Whether you're a prospective student, parent, alumni, or partner — feel free to reach out with your queries. Our team will get back to you as soon as possible.</p>

        <div className="contactForm">
          <form id="contactForm" onSubmit={handleSubmit}>
            <h1 className="para1 para2">Contact us </h1>
            <input type="text" name="name" className="input" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" className="input" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone" className="input" placeholder="Your Mobile Number" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="location" className="input" placeholder="Enter your Location + Pin Code" value={formData.location} onChange={handleChange} required />
            <input type="text" name="subject" className="input" placeholder="Your Subject" value={formData.subject} onChange={handleChange} required />
            <textarea name="message" className="input" cols="30" rows="5" placeholder="Write your message..." value={formData.message} onChange={handleChange} required></textarea>
            <input type="submit" className="input submit" value="Send Message" />
          </form>
          <div className="map-container">
            <div className="mapBg"></div>
            <div className="map">
              <iframe
                title="College Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.2049888356514!2d80.0560435!3d26.2874539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399db3fc522422c3%3A0x8dd9a8b4722e2a36!2sSw.%20NARENDRA%20SINGH%20MAHAVIDYALAYA%20GAJNER%20KANPUR%20DEHAT!5e0!3m2!1sen!2sin!4v1755493730135!5m2!1sen!2sin"
                style={{ border: 0, width: '100%', height: '100%' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
          <div className="map-container">
            <div className="mapBg"></div>
            <div className="map">
              <iframe
                title="College Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.0979540143526!2d80.308132!3d26.420635200000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47a673e7dc7b%3A0x9c6a6fa4ce34a8c3!2sSw.%20Narendra%20Singh%20Mahavidyalaya%2C%20Kanpur%20City%2C%20Office!5e1!3m2!1sen!2sin!4v1758082126064!5m2!1sen!2sin"
                style={{ border: 0, width: '100%', height: '100%' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>

        <div className="contactMethod">
          <div className="method">
            <i className="fa-solid fa-location-dot contactIcon"></i>
            <article className="text">
              <h1 className="sub-heading">Location</h1>

              <a
                href="https://www.google.com/maps?q=Sw.+Narendra+Singh+Mahavidyalaya,+Gajner,+Kanpur+Dehat"
                target="_blank"
                rel="noopener noreferrer"
                className="para"
              >
                <strong>College Center:- </strong>Sw. Narendra Singh Mahavidyalaya, Gajner, Kanpur Dehat
              </a>

              <p className="para">Adjacent to the Gajner Police Station.</p>

              <a
                href="https://maps.app.goo.gl/rGPqUBjwozXJ1SM98"
                target="_blank"
                rel="noopener noreferrer"
                className="para"
              >
               <strong>City Center:- </strong> W2, 1364A, near patel sadan guset house, Damodar Nagar, Kanpur, Uttar Pradesh 208027
              </a>
            </article>

          </div>

          <div className="method">
            <div className="method">
              <i className="fa-solid fa-envelope contactIcon"></i>
              <article className="text">
                <h1 className="sub-heading">Email</h1>
                <a href="mailto:snsmv25@gmail.com" className="para">
                  snsmv25@gmail.com
                </a>
              </article>
            </div>

          </div>

          <div className="method">
            <i className="fa-solid fa-phone contactIcon"></i>
            <article className="text">
              <h1 className="sub-heading">Phone</h1>
              <p className="para">
                <a href="tel:+918851955753" className="phone-link">+91 8851955753</a><br />
                <a href="tel:+918851955596" className="phone-link">+91 8851955596</a>
              </p>
            </article>

          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;