import React, { useState } from 'react';

const SubmitAssignment = () => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic
    alert('Assignment submitted!');
  };

  return (
    <div className="menu-content">
      <h1>Submit Assignment</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <textarea placeholder="Add notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
};

export default SubmitAssignment;
