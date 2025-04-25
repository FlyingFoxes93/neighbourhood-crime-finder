import { useState } from 'react';

function App() {
  const [postcode, setPostcode] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [crimes, setCrimes] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!postcode.trim()) {
      alert('Please enter a valid postcode.');
      return;
    }

    try {
      setError('');
      setCrimes([]);

      // Fetch latitude and longitude from Postcodes.io
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode.replace(/\s+/g, '')}`);
      const data = await response.json();

      if (data.status !== 200) {
        alert('Postcode not found. Please try again.');
        return;
      }

      const { latitude, longitude } = data.result;

      if (!latitude || !longitude) {
        setError('Location coordinates not available.');
        return;
      }

      // Build the Police API URL
      let crimesUrl = `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}`;

      if (selectedYear && selectedMonth) {
        crimesUrl += `&date=${selectedYear}-${selectedMonth}`;
      }

      // Fetch crimes
      const crimesResponse = await fetch(crimesUrl);
      const crimesData = await crimesResponse.json();

      if (Array.isArray(crimesData)) {
        setCrimes(crimesData);
      } else {
        setError('No crime data found.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch data. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Neighbourhood Crime Finder</h1>
      <p>Enter your postcode to view recent or historical nearby crime reports.</p>

      <input
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        placeholder="Enter postcode"
      />

      <div style={{ marginTop: '10px' }}>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: '8px', marginRight: '8px' }}
        >
          <option value="">Select Year (optional)</option>
          {Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, i) => 2010 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">Select Month (optional)</option>
          {[
            { num: '01', name: 'January' },
            { num: '02', name: 'February' },
            { num: '03', name: 'March' },
            { num: '04', name: 'April' },
            { num: '05', name: 'May' },
            { num: '06', name: 'June' },
            { num: '07', name: 'July' },
            { num: '08', name: 'August' },
            { num: '09', name: 'September' },
            { num: '10', name: 'October' },
            { num: '11', name: 'November' },
            { num: '12', name: 'December' }
          ].map(month => (
            <option key={month.num} value={month.num}>{month.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSearch}
        style={{ marginTop: '10px' }}
      >
        Search
      </button>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {postcode && !error && crimes.length === 0 && (
        <div className="result-section">
          <h2>No nearby crimes found.</h2>
          <p>This could indicate a very low crime area or no data currently available.</p>
        </div>
      )}

      {crimes.length > 0 && (
        <div className="result-section">
          <h2>Nearby Crimes:</h2>
          <ul>
            {crimes.slice(0, 20).map((crime, index) => (
              <li key={index} style={{ marginBottom: '15px' }}>
                <strong>{crime.category.replace(/-/g, ' ').toUpperCase()}</strong> at {crime.location.street.name} <br />
                <em>Month: {crime.month}</em><br />
                <em>Outcome: {crime.outcome_status ? crime.outcome_status.category : 'Outcome unknown'}</em>
              </li>
            ))}
          </ul>
          <p>Showing up to 20 most recent results.</p>
        </div>
      )}
    </div>
  );
}

export default App;
