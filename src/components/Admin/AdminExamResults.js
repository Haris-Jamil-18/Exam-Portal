import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { examApi } from "../../services/api";
import "../styles/Results.css";

const AdminExamResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await examApi.getExamResults(id);
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading results...</p>;

  return (
    <div  className="results-container">
      <h2>Exam Results</h2>

      {results.length === 0 ? (
        <p>No students have attempted this exam yet.</p>
      ) : (
        <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.userId.name}</td>
                <td>{r.userId.email}</td>
                <td>{r.marksObtained} / {r.examId.totalMarks}</td>
                <td>{r.percentage.toFixed(2)}%</td>
                <td>{r.isPassed ? "✅ Pass" : "❌ Fail"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default AdminExamResults;
