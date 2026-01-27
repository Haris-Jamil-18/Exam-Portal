import React, { useState, useEffect } from 'react';
import { resultApi } from '../../services/api';
import '../styles/Results.css';

const UserResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await resultApi.getUserResults();
      setResults(response.data.results);
      setError('');
    } catch (err) {
      setError('Failed to fetch results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="results-container"><p>Loading results...</p></div>;

  return (
    <div className="results-container">
      <h1>My Results</h1>

      {error && <div className="error-message">{error}</div>}

      {results.length === 0 ? (
        <p>No results yet. Start taking exams!</p>
      ) : (
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>Exam Title</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const percentage = (result.marksObtained / result.totalMarks) * 100;
                const isPassed = result.marksObtained >= result.passingMarks;
                return (
                  <tr key={result._id}>
                    <td>{result.examTitle}</td>
                    <td>{result.marksObtained}</td>
                    <td>{result.totalMarks}</td>
                    <td>{percentage.toFixed(2)}%</td>
                    <td className={isPassed ? 'passed' : 'failed'}>
                      {isPassed ? '✅ Passed' : '❌ Failed'}
                    </td>
                    <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserResults;
