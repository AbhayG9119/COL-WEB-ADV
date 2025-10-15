import React, { useState, useEffect } from 'react';

const AdmissionQuery = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admission-query');
        if (!response.ok) {
          throw new Error('Failed to fetch queries');
        }
        const data = await response.json();
        setQueries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Pincode', 'Course', 'Message', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...queries.map(query => {
        const dateStr = new Date(query.createdAt).toLocaleDateString('en-GB');
        const escapeField = (field) => `"${field.replace(/"/g, '""')}"`;
        const escapedPhone = query.phone.replace(/"/g, '""');
        return [
          escapeField(query.name),
          escapeField(query.email),
          `"'${escapedPhone}'"`,
          escapeField(query.location),
          escapeField(query.pincode),
          escapeField(query.course),
          escapeField(query.message),
          escapeField(query.status),
          `"${dateStr}"`
        ].join(',');
      })
    ].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admission_queries.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(queries.length / itemsPerPage);
  const paginatedQueries = queries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Admission Queries</h2>
      <button onClick={exportToCSV} style={{ marginBottom: '10px' }}>Export to CSV</button>
      {queries.length === 0 ? (
        <p>No admission queries found.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Phone</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Location</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Pincode</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Message</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQueries.map((query) => (
                <tr key={query._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.phone}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.location}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.pincode}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.course}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.message}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{query.status}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(query.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdmissionQuery;
