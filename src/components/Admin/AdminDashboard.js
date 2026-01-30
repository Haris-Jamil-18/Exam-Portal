import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { examApi } from "../../services/api";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    questions: [],
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examApi.getAllExams();
      setExams(response.data.exams);
    } catch (err) {
      setError("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await examApi.createExam(formData);
      alert("Exam created successfully!");
      setFormData({
        title: "",
        description: "",
        duration: "",
        totalMarks: "",
        passingMarks: "",
        questions: [],
      });
      setShowForm(false);
      fetchExams();
    } catch (err) {
      setError("Failed to create exam");
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await examApi.deleteExam(id);
        alert("Exam deleted successfully!");
        fetchExams();
      } catch (err) {
        setError("Failed to delete exam");
      }
    }
  };

  const handlePublishExam = async (id) => {
    try {
      await examApi.publishExam(id);
      alert("Exam published successfully!");
      fetchExams();
    } catch (err) {
      setError("Failed to publish exam");
    }
  };

  if (loading)
    return (
      <div className="admin-container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <button onClick={() => setShowForm(!showForm)} className="btn-create">
        {showForm ? "Cancel" : "Create New Exam"}
      </button>

      {showForm && (
        <form onSubmit={handleCreateExam} className="exam-form">
          <h2>Create Exam</h2>

          <input
            type="text"
            placeholder="Exam Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Total Marks"
            value={formData.totalMarks}
            onChange={(e) =>
              setFormData({ ...formData, totalMarks: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Passing Marks"
            value={formData.passingMarks}
            onChange={(e) =>
              setFormData({ ...formData, passingMarks: e.target.value })
            }
            required
          />

          <button type="submit" className="btn-submit">
            Create Exam
          </button>
        </form>
      )}

      <div className="exams-list">
        <h2>All Exams</h2>
        {exams.length === 0 ? (
          <p>No exams created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration (min)</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.title}</td>
                  <td>{exam.duration}</td>
                  <td>{exam.totalMarks}</td>
                  <td>{exam.isPublished ? "✅ Published" : "⏳ Draft"}</td>
                  <td>
                    <Link to={`/admin/exam/${exam._id}`} className="btn-edit">
                      Edit
                    </Link>
                    {!exam.isPublished && (
                      <button
                        onClick={() => handlePublishExam(exam._id)}
                        className="btn-publish"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteExam(exam._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/admin/exam/${exam._id}/results`}
                      className="btn-view-results"
                    >
                      View Results
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
