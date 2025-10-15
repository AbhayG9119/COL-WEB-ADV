import React, { useState } from 'react';

const RaiseComplaint = () => {
  const [complaint, setComplaint] = useState({ type: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic
    alert('Complaint raised!');
  };

  return (
    <div className="menu-content">
      <h1>Raise Complaint</h1>
      <form onSubmit={handleSubmit}>
        <select value={complaint.type} onChange={(e) => setComplaint({ ...complaint, type: e.target.value })} required>
          <option value="">Select Type</option>
          <option value="Academic">Academic</option>
          <option value="Facility">Facility</option>
          <option value="Technical">Technical</option>
        </select>
        <textarea placeholder="Description" value={complaint.description} onChange={(e) => setComplaint({ ...complaint, description: e.target.value })} required />
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
};

export default RaiseComplaint;
