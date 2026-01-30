import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examApi } from "../../services/api";
import "../styles/EditExam.css";

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    startDate: "",
    endDate: "",
    questions: [],
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    questionType: "mcq",
    marks: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      const response = await examApi.getExamById(id);
      const examData = response.data.exam;
      setExam(examData);
      setFormData({
        title: examData.title,
        description: examData.description,
        duration: examData.duration,
        totalMarks: examData.totalMarks,
        passingMarks: examData.passingMarks,
        startDate: examData.startDate ? examData.startDate.split("T")[0] : "",
        endDate: examData.endDate ? examData.endDate.split("T")[0] : "",
        questions: examData.questions || [],
      });
      setError("");
    } catch (err) {
      setError("Failed to fetch exam");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuestionChange = (field, value) => {
    setNewQuestion({ ...newQuestion, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!newQuestion.questionText || !newQuestion.marks) {
      alert("Please fill in question text and marks");
      return;
    }

    if (newQuestion.options.some((opt) => !opt)) {
      alert("Please fill in all MCQ options");
      return;
    }
    if (!newQuestion.correctAnswer) {
      alert("Please select correct answer for MCQ");
      return;
    }

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions[editingQuestionIndex] = newQuestion;
      setFormData({ ...formData, questions: updatedQuestions });
      setEditingQuestionIndex(null);
    } else {
      setFormData({
        ...formData,
        questions: [...formData.questions, newQuestion],
      });
    }

    setNewQuestion({
      questionText: "",
      questionType: "mcq",
      marks: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  const editQuestion = (index) => {
    setEditingQuestionIndex(index);
    setNewQuestion(formData.questions[index]);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    try {
      await examApi.updateExam(id, formData);
      alert("Exam updated successfully!");
      navigate("/admin");
    } catch (err) {
      setError("Failed to update exam");
      console.error(err);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const response = await examApi.publishExam(id);
      setExam(response.data.exam);
      alert(response.data.message);
    } catch (err) {
      setError("Failed to update exam publish status");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="edit-exam-container">
        <p>Loading exam...</p>
      </div>
    );
  if (error)
    return (
      <div className="edit-exam-container">
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <div className="edit-exam-container">
      <button onClick={() => navigate("/admin")} className="btn-back">
        ← Back to Dashboard
      </button>

      <form onSubmit={handleUpdateExam} className="edit-exam-form">
        <div className="form-header">
          <h2>Edit Exam: {formData.title}</h2>
          <div className="header-actions">
            <span
              className={`status-badge ${exam.isPublished ? "published" : "draft"}`}
            >
              {exam.isPublished ? "✅ Published" : "⏳ Draft"}
            </span>
            <button
              type="button"
              onClick={handlePublishToggle}
              className={exam.isPublished ? "btn-unpublish" : "btn-publish-toggle"}
            >
              {exam.isPublished ? "Unpublish Exam" : "Publish Exam"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Exam Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleFormChange} required/>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleFormChange}/>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleFormChange} required/>
          </div>

          <div className="form-group">
            <label>Total Marks</label>
            <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleFormChange} required/>
          </div>

          <div className="form-group">
            <label>Passing Marks</label>
            <input type="number" name="passingMarks" value={formData.passingMarks} onChange={handleFormChange} required/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleFormChange}/>
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleFormChange}/>
          </div>
        </div>

        <div className="questions-section">
          <h3>Questions ({formData.questions.length})</h3>

          <div className="add-question-form">
            <h4>{editingQuestionIndex !== null ? "Edit Question" : "Add Question"}</h4>

            <div className="form-group">
              <label>Question Text</label>
              <textarea
                value={newQuestion.questionText}
                onChange={(e) => handleQuestionChange("questionText", e.target.value)}
                placeholder="Enter question text"
              />
            </div>

           
            <div className="form-group">
              <label>Question Type</label>
              <select value="mcq" disabled>
                <option value="mcq">Multiple Choice</option>
              </select>
            </div>

            <div className="form-group">
              <label>Marks</label>
              <input type="number" value={newQuestion.marks} onChange={(e)=>handleQuestionChange("marks", e.target.value)} placeholder="Enter marks"/>
            </div>

            <div className="form-group">
              <label>Options</label>
              {newQuestion.options.map((option, idx) => (
                <input key={idx} type="text" value={option} onChange={(e)=>handleOptionChange(idx,e.target.value)} placeholder={`Option ${idx+1}`} className="option-input"/>
              ))}
            </div>

            <div className="form-group">
              <label>Correct Answer</label>
              <select value={newQuestion.correctAnswer} onChange={(e)=>handleQuestionChange("correctAnswer", e.target.value)}>
                <option value="">Select correct answer</option>
                {newQuestion.options.map((opt,idx)=> opt && <option key={idx} value={opt}>{opt}</option>)}
              </select>
            </div>

            <button type="button" onClick={addQuestion} className="btn-add-question">
              {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
            </button>

          </div>

        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">Save Exam</button>
          <button type="button" onClick={()=>navigate("/admin")} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
