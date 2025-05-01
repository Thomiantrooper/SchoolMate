import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const StaffExam = () => {
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    grade: '',
    questions: [{ question: '', options: ['', ''], correctAnswer: '' }],
    date: ''
  });
  const [error, setError] = useState(null);
  const [marks, setMarks] = useState(null);
  const [answers, setAnswers] = useState([]);

  // Load questions & submissions from localStorage
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions')) || [];
    setQuestions(storedQuestions);
    setSubmissions(storedSubmissions);
  }, []);

  const saveQuestionsToStorage = (updated) => {
    setQuestions(updated);
    localStorage.setItem('questions', JSON.stringify(updated));
  };

  const saveSubmissionsToStorage = (updated) => {
    setSubmissions(updated);
    localStorage.setItem('submissions', JSON.stringify(updated));
  };

  const handleAddOrUpdateQuestion = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = newQuestion;
      saveQuestionsToStorage(updated);
      setEditingIndex(null);
    } else {
      saveQuestionsToStorage([...questions, { ...newQuestion, id: Date.now() }]);
    }

    setNewQuestion({
      grade: '',
      questions: [{ question: '', options: ['', ''], correctAnswer: '' }],
      date: ''
    });
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    saveQuestionsToStorage(updated);
  };

  const handleEditQuestion = (index) => {
    setNewQuestion(questions[index]);
    setEditingIndex(index);
  };

  const handleInputChange = (e, index, field) => {
    const value = e.target.value;
    const updatedQuestions = [...newQuestion.questions];
    updatedQuestions[index][field] = value;
    setNewQuestion({ ...newQuestion, questions: updatedQuestions });
  };

  const handleAnswerChange = (e, questionId) => {
    const selectedOption = e.target.value;
    setAnswers((prev) => {
      const existing = prev.find((ans) => ans.questionId === questionId);
      if (existing) {
        return prev.map((ans) =>
          ans.questionId === questionId ? { ...ans, selectedOption } : ans
        );
      }
      return [...prev, { questionId, selectedOption }];
    });
  };

  const handleSubmitAnswers = () => {
    let score = 0;
    for (let qSet of questions) {
      for (let q of qSet.questions) {
        const studentAns = answers.find((a) => a.questionId === q.question);
        if (studentAns && studentAns.selectedOption === q.correctAnswer) {
          score++;
        }
      }
    }
    const submission = {
      studentId: '12345',
      studentName: 'John Doe',
      marks: score,
      submittedAt: new Date().toISOString()
    };
    const updated = [...submissions, submission];
    saveSubmissionsToStorage(updated);
    setMarks(score);
  };

  // Download PDF function
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Exam Questions', 20, 20);

    let yPosition = 30;
    questions.forEach((qSet) => {
      doc.setFontSize(14);
      doc.setTextColor(255, 0, 0); // Red color for grade and date
      doc.text(`Grade: ${qSet.grade} - Date: ${qSet.date}`, 20, yPosition);
      yPosition += 10;
      doc.setTextColor(0, 0, 0); // Reset to black color

      qSet.questions.forEach((q, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${q.question}`, 20, yPosition);
        yPosition += 10;

        q.options.forEach((opt, i) => {
          doc.text(`${String.fromCharCode(65 + i)}. ${opt}`, 30, yPosition);
          yPosition += 8;
        });
        yPosition += 10;
      });
    });

    doc.save('exam_questions.pdf');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212' }}>
      <div style={{ width: '100%', maxWidth: '800px', padding: '20px', backgroundColor: '#1E1E1E', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px', color: '#FFF' }}>Staff Exam Management</h2>
        
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleAddOrUpdateQuestion} style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#FFF' }}>Add / Edit Question</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Grade"
              value={newQuestion.grade}
              onChange={(e) => setNewQuestion({ ...newQuestion, grade: e.target.value })}
              style={{ padding: '10px', color: 'white', border: '1px solid #444', borderRadius: '4px', fontSize: '1rem', backgroundColor: '#333' }}
              required
            />
            <input
              type="text"
              placeholder="Date"
              value={newQuestion.date}
              onChange={(e) => setNewQuestion({ ...newQuestion, date: e.target.value })}
              style={{ padding: '10px', color: 'white', border: '1px solid #444', borderRadius: '4px', fontSize: '1rem', backgroundColor: '#333' }}
              required
            />
            <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '4px', backgroundColor: '#333' }}>
              {newQuestion.questions.map((q, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => handleInputChange(e, index, 'question')}
                    style={{ padding: '10px', color: 'white', width: '100%', marginBottom: '10px', border: '1px solid #444', borderRadius: '4px', fontSize: '1rem', backgroundColor: '#333' }}
                    required
                  />
                  {q.options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[i] = e.target.value;
                        const updated = [...newQuestion.questions];
                        updated[index].options = newOptions;
                        setNewQuestion({ ...newQuestion, questions: updated });
                      }}
                      style={{
                        padding: '10px',
                        color: 'white',
                        width: '100%',
                        marginBottom: '10px',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        backgroundColor: '#333',
                      }}
                      required
                    />
                  ))}
                </div>
              ))}
            </div>
            <button type="submit" style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem' }}>
              {editingIndex !== null ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>

        <div>
          <h3 style={{ marginBottom: '15px', color: '#FFF' }}>All Questions</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {questions.map((qSet, index) => (
              <li key={index} style={{ border: '1px solid #444', marginBottom: '10px', padding: '15px', borderRadius: '4px', backgroundColor: '#333' }}>
                <strong style={{ color: 'red' }}>{qSet.grade}</strong> - <span style={{ color: 'red' }}>{qSet.date}</span>
                {qSet.questions.map((q, i) => (
                  <div key={i}>
                    <p style={{ marginBottom: '8px', color: 'white' }}>{q.question}</p>
                    {q.options.map((opt, j) => (
                      <label key={j} style={{ display: 'block', color: 'white' }}>
                        <input
                          type="radio"
                          name={`question-${q.question}`}
                          value={opt}
                          onChange={(e) => handleAnswerChange(e, q.question)}
                        /> <span style={{ color: 'white' }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                ))}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleEditQuestion(index)} style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteQuestion(index)} style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9rem', marginLeft: '10px' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Download PDF Button */}
        <button onClick={downloadPDF} style={{ padding: '12px', backgroundColor: '#2196F3', color: 'white', marginTop: '20px', border: 'none', borderRadius: '4px', fontSize: '1.1rem' }}>
          Download Exam Questions (PDF)
        </button>
      </div>
    </div>
  );
};

export default StaffExam;
