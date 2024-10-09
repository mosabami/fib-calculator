import React, { useState, useEffect } from 'react';
import './Fib.css';
import axios from 'axios';

const upperLimit = process.env.REACT_APP_UPPERLIMIT ? parseInt(process.env.REACT_APP_UPPERLIMIT, 10) : 100;

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const fetchValues = async () => {
    try {
      const values = await axios.get('/api/values/current');
      setValues(values.data);
    } catch (error) {
      console.error('Error fetching values:', error);
      // Optionally, you can set an error state or show a user-friendly message
    }
  };

  const fetchIndexes = async () => {
    try {
      const seenIndexes = await axios.get('/api/values/all');
      setSeenIndexes(seenIndexes.data);
    } catch (error) {
      console.error('Error fetching indexes:', error);
      // Optionally, you can set an error state or show a user-friendly message
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('/api/values', {
        index: index,
      });
  
      if (response.status !== 422) {
        setIndex('');
        fetchValues();
        fetchIndexes();
      } else {
        console.error('Error: Status code 422');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  };

  return (
    <div className="form-container">
      <h2>Fib Calculator</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter your index between 0 and {upperLimit}:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <div className="indexes">
        <h3>Indexes I have seen:</h3>
        {renderSeenIndexes()}
      </div>

      <div className="values">
        <h3>Calculated Values:</h3>
        {renderValues()}
      </div>
    </div>
  );
};

export default Fib;
