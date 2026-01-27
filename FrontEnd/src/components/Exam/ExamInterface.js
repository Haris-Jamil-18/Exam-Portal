import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../../services/api';
import '../styles/ExamInterface.css';

const ExamInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && examStarted) {
      handleSubmitExam();
    }
  }, [timeRemaining, examStarted]);

  const fetchExam = async () => {
    try {
      const response = await examApi.getExamById(id);
      setExam(response.data.exam);
      setError('');
    } catch (err) {
      setError('Failed to fetch exam');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startExam = async () => {
    try {
      const response = await examApi.startExam(id);
      setSubmission(response.data.submission);
      setTimeRemaining(exam.duration * 60);
      setExamStarted(true);
      // Initialize answers
      const initialAnswers = {};
      exam.questions.forEach((q, idx) => {
        initialAnswers[idx] = '';
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError('Failed to start exam');
      console.error(err);
    }
  };

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: value,
    });
  };

  const handleSubmitExam = async () => {
    if (!submission) return;

    try {
      // Convert answers object to array format expected by backend
      const answersArray = exam.questions.map((question, idx) => ({
        questionId: question._id,
        userAnswer: answers[idx] || '',
      }));

      const submissionData = {
        answers: answersArray,
        timeSpent: exam.duration * 60 - timeRemaining,
      };
      await examApi.submitExam(submission._id, submissionData);
      alert('Exam submitted successfully!');
      navigate('/results');
    } catch (err) {
      setError('Failed to submit exam');
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="exam-container"><p>Loading exam...</p></div>;
  if (error) return <div className="exam-container"><p className="error-message">{error}</p></div>;
  if (!exam) return <div className="exam-container"><p>Exam not found</p></div>;

  if (!examStarted) {
    return (
      <div className="exam-container">
        <div className="exam-info">
          <h1>{exam.title}</h1>
          <p>{exam.description}</p>
          <div className="exam-stats">
            <div>⏱️ Duration: {exam.duration} minutes</div>
            <div>⭐ Total Marks: {exam.totalMarks}</div>
            <div>✅ Passing Marks: {exam.passingMarks}</div>
            <div>❓ Questions: {exam.questions.length}</div>
          </div>
          <button onClick={startExam} className="btn-start-exam">
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2>{exam.title}</h2>
        <div className="timer">
          ⏱️ Time Remaining: <span className="time-value">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="exam-body">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="question-section">
          <h3>Question {currentQuestionIndex + 1} of {exam.questions.length}</h3>
          <p className="question-text">{currentQuestion.questionText}</p>
          <p className="question-marks">Marks: {currentQuestion.marks}</p>

          {currentQuestion.questionType === 'mcq' && (
            <div className="options">
              {currentQuestion.options.map((option, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answers[currentQuestionIndex] === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {(currentQuestion.questionType === 'shortAnswer' || currentQuestion.questionType === 'essay') && (
            <textarea
              className="answer-textarea"
              value={answers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write your answer here..."
              rows={6}
            />
          )}
        </div>

        <div className="navigation-buttons">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="btn-nav"
          >
            Previous
          </button>

          <div className="question-list">
            {exam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`question-btn ${currentQuestionIndex === idx ? 'active' : ''} ${answers[idx] ? 'answered' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === exam.questions.length - 1}
            className="btn-nav"
          >
            Next
          </button>
        </div>

        <button onClick={handleSubmitExam} className="btn-submit">
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default ExamInterface;
