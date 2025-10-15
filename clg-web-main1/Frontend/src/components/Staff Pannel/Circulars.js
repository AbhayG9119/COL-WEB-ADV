import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Circulars = () => {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/staff/circulars', config);
      setCirculars(res.data);
    } catch (error) {
      console.error('Error fetching circulars:', error);
    }
  };

  const downloadCircular = (url, title) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = title;
    a.click();
  };

  return (
    <div className="circulars">
      <h1>Circulars / Notices</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {circulars.map(circular => (
            <li key={circular._id}>
              <h3>{circular.title}</h3>
              <p>{circular.description}</p>
              <p><small>{new Date(circular.date).toLocaleDateString()}</small></p>
              {circular.fileUrl && (
                <button onClick={() => downloadCircular(circular.fileUrl, circular.title)}>Download</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Circulars;
