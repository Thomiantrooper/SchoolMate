import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffExam = () => {
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    grade: '',
    questions: [{ question: '', options: ['', ''], correctAnswer: '' }],
    date: ''
  });
  const [error, setError] = useState(null);
  const [marks, setMarks] = useState(null);
  const [answers, setAnswers] = useState([]);

  // Fetching all questions
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      setError('Failed to load questions');
    }
  };

  // Fetching all submissions
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('/api/submissions');
      setSubmissions(response.data);
    } catch (error) {
      setError('Failed to load submissions');
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchSubmissions();
  }, []);

  // Add a new question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/questions', newQuestion);
      fetchQuestions(); // Refresh question list after adding new one
      setNewQuestion({
        grade: '',
        questions: [{ question: '', options: ['', ''], correctAnswer: '' }],
        date: ''
      });
    } catch (error) {
      setError('Failed to add question');
    }
  };

  // Handle question field changes
  const handleInputChange = (e, index, field) => {
    const value = e.target.value;
    const updatedQuestions = [...newQuestion.questions];
    updatedQuestions[index][field] = value;
    setNewQuestion({ ...newQuestion, questions: updatedQuestions });
  };

  // Submit answers for a student
  const handleSubmitAnswers = async () => {
    try {
      const response = await axios.post('/api/submissions', {
        studentId: '12345', // Sample student ID
        studentName: 'John Doe', // Sample student name
        answers,
      });
      setMarks(response.data.marks);
    } catch (error) {
      setError('Failed to submit answers');
    }
  };

  // Handle change in answer options
  const handleAnswerChange = (e, questionId) => {
    const selectedOption = e.target.value;
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find((ans) => ans.questionId === questionId);
      if (existingAnswer) {
        existingAnswer.selectedOption = selectedOption;
        return [...prevAnswers];
      }
      return [...prevAnswers, { questionId, selectedOption }];
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Staff Exam Management</h2>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

      {/* Add Question Form */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Add New Question</h3>
        <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Grade"
            value={newQuestion.grade}
            onChange={(e) => setNewQuestion({ ...newQuestion, grade: e.target.value })}
            style={{
              padding: '8px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            required
          />
          <textarea
            placeholder="Date"
            value={newQuestion.date}
            onChange={(e) => setNewQuestion({ ...newQuestion, date: e.target.value })}
            style={{
              padding: '8px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            required
          />
          {newQuestion.questions.map((q, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) => handleInputChange(e, index, 'question')}
                style={{
                  padding: '8px',
                  margin: '5px 0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
                required
              />
              {q.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...q.options];
                    updatedOptions[optIndex] = e.target.value;
                    const updatedQuestions = [...newQuestion.questions];
                    updatedQuestions[index].options = updatedOptions;
                    setNewQuestion({ ...newQuestion, questions: updatedQuestions });
                  }}
                  style={{
                    padding: '8px',
                    margin: '5px 0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                  required
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleInputChange(e, index, 'correctAnswer')}
                style={{
                  padding: '8px',
                  margin: '5px 0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Question
          </button>
        </form>
      </div>

      {/* Display All Questions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>All Questions</h3>
        <ul>
          {questions.map((questionSet) => (
            <li key={questionSet._id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '4px' }}>
              <h4 style={{ fontSize: '1.2rem' }}>{questionSet.grade} - {new Date(questionSet.date).toLocaleDateString()}</h4>
              {questionSet.questions.map((q, index) => (
                <div key={index}>
                  <p>{q.question}</p>
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} style={{ display: 'block', marginTop: '5px' }}>
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        value={option}
                        onChange={(e) => handleAnswerChange(e, q._id)}
                        style={{ marginRight: '5px' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {/* Display All Submissions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>All Submissions</h3>
        <ul>
          {submissions.map((submission) => (
            <li key={submission._id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '4px' }}>
              <h4 style={{ fontSize: '1.2rem' }}>{submission.studentName}</h4>
              <p>Marks: {submission.marks}</p>
              <p>Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Answers */}
      <div>
        <button
          onClick={handleSubmitAnswers}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit Answers
        </button>
        {marks !== null && <p>Your Marks: {marks}</p>}
      </div>
    </div>
  );
};

export default StaffExam;
