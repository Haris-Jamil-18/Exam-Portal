import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { examApi } from "../../services/api";
import "../styles/Dashboard.css";

const UserDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examApi.getAllExams();
      setExams(response.data.exams);
      setError("");
    } catch (err) {
      setError("Failed to fetch exams");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="dashboard-container">
        <p>Loading exams...</p>
      </div>
    );

  return (
    <div className="dashboard-container">
      <h1>Available Exams</h1>

      {error && <div className="error-message">{error}</div>}

      {exams.length === 0 ? (
        <p>No exams available at the moment.</p>
      ) : (
        <div className="exams-grid">
          {exams.map((exam) => (
            <div key={exam._id} className="exam-card">
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
              <div className="exam-details">
                <span>⏱️ Duration: {exam.duration} minutes</span>
                <span>⭐ Total Marks: {exam.totalMarks}</span>
                <span>✅ Passing Marks: {exam.passingMarks}</span>
              </div>
              {exam.startDate && (
                <p className="exam-date">
                  Start: {new Date(exam.startDate).toLocaleDateString()}
                </p>
              )}
              {exam.endDate && (
                <p className="exam-date">
                  End: {new Date(exam.endDate).toLocaleDateString()}
                </p>
              )}
              {/* <Link to={`/exam/${exam._id}`} className="btn-start">
                Start Exam
              </Link> */}

              {exam.hasAttempted ? (
                <button className="btn-disabled" disabled>
                  Already Attempted
                </button>
              ) : (
                <Link to={`/exam/${exam._id}`} className="btn-start">
                  Start Exam
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
