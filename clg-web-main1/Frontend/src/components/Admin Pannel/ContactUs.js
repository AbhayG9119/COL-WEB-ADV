import React, { useState, useEffect } from 'react';

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contact');
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Subject', 'Message', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => {
        const dateStr = new Date(contact.createdAt).toLocaleDateString('en-GB');
        const escapeField = (field) => `"${field.replace(/"/g, '""')}"`;
        const escapedPhone = contact.phone.replace(/"/g, '""');
        return [
          escapeField(contact.name),
          escapeField(contact.email),
          `"'${escapedPhone}'"`,
          escapeField(contact.location),
          escapeField(contact.subject),
          escapeField(contact.message),
          escapeField(contact.status),
          `"${dateStr}"`
        ].join(',');
      })
    ].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_queries.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(contacts.length / itemsPerPage);
  const paginatedContacts = contacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Contact Us Queries</h2>
      <button onClick={exportToCSV} style={{ marginBottom: '10px' }}>Export to CSV</button>
      {contacts.length === 0 ? (
        <p>No contact queries found.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Phone</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Location</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subject</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Message</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContacts.map((contact) => (
                <tr key={contact._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.phone}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.location}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.subject}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.message}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contact.status}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(contact.createdAt).toLocaleDateString()}</td>
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

export default ContactUs;
