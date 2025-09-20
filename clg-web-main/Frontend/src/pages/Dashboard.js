import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch('http://localhost:5000/api/contact');
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Contact Form Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Attachment</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
                <td>{submission.phone}</td>
                <td>{submission.location}</td>
                <td>{submission.subject}</td>
                <td>{submission.message}</td>
                <td>
                  {submission.imageUrl ? (
                    <img
                      src={submission.imageUrl}
                      alt="attachment"
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td>{new Date(submission.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
