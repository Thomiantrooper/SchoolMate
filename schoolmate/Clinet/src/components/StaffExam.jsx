import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { 
  FiEdit2, 
  FiTrash2, 
  FiDownload, 
  FiPlus, 
  FiCheck, 
  FiFileText,
  FiPrinter,
  FiSave,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const StaffExam = () => {
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    grade: '',
    subject: '',
    questions: [{ 
      question: '', 
      options: ['', '', '', ''], 
      correctAnswer: '',
      marks: 1 
    }],
    date: ''
  });
  const [activeTab, setActiveTab] = useState('create');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Load questions from localStorage
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('examQuestions')) || [];
    setQuestions(storedQuestions);
  }, []);

  const saveQuestionsToStorage = (updatedQuestions) => {
    setQuestions(updatedQuestions);
    localStorage.setItem('examQuestions', JSON.stringify(updatedQuestions));
  };

  const handleAddQuestion = () => {
    setNewQuestion({
      grade: '',
      subject: '',
      questions: [{ 
        question: '', 
        options: ['', '', '', ''], 
        correctAnswer: '',
        marks: 1 
      }],
      date: new Date().toISOString().split('T')[0]
    });
    setEditingIndex(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (index) => {
    setNewQuestion(questions[index]);
    setEditingIndex(index);
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    
    // Validate question set
    if (!newQuestion.grade || !newQuestion.subject || !newQuestion.date) {
      alert('Please fill in all required fields (Grade, Subject, Date)');
      return;
    }
    
    // Validate each question
    for (const q of newQuestion.questions) {
      if (!q.question || q.options.some(opt => !opt)) {
        alert('Please fill in all question fields and options');
        return;
      }
      if (!q.correctAnswer) {
        alert('Please select a correct answer for each question');
        return;
      }
    }

    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = newQuestion;
      saveQuestionsToStorage(updated);
    } else {
      saveQuestionsToStorage([...questions, { ...newQuestion, id: Date.now() }]);
    }
    
    setShowQuestionModal(false);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question set?')) {
      const updated = [...questions];
      updated.splice(index, 1);
      saveQuestionsToStorage(updated);
    }
  };

  const handleQuestionChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...newQuestion.questions];
    updatedQuestions[index][name] = value;
    setNewQuestion({ ...newQuestion, questions: updatedQuestions });
  };

  const handleOptionChange = (e, qIndex, optIndex) => {
    const value = e.target.value;
    const updatedQuestions = [...newQuestion.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setNewQuestion({ ...newQuestion, questions: updatedQuestions });
  };

  const addNewQuestion = () => {
    setNewQuestion(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }
      ]
    }));
    setCurrentQuestionIndex(newQuestion.questions.length);
  };

  const removeQuestion = (index) => {
    if (newQuestion.questions.length <= 1) {
      alert('You must have at least one question');
      return;
    }
    
    const updatedQuestions = [...newQuestion.questions];
    updatedQuestions.splice(index, 1);
    setNewQuestion({ ...newQuestion, questions: updatedQuestions });
    setCurrentQuestionIndex(Math.min(index, updatedQuestions.length - 1));
  };

  // Generate PDF for Teachers (with answers)
  const generateTeacherPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('EXAM PAPER (TEACHER VERSION)', 105, 20, { align: 'center' });
    
    // Exam Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Grade: ${newQuestion.grade}`, 20, 35);
    doc.text(`Subject: ${newQuestion.subject}`, 20, 45);
    doc.text(`Date: ${newQuestion.date}`, 20, 55);
    
    // Questions
    let yPosition = 70;
    newQuestion.questions.forEach((q, qIndex) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${qIndex + 1}. ${q.question} (${q.marks} mark${q.marks > 1 ? 's' : ''})`, 20, yPosition);
      yPosition += 10;
      
      // Options
      doc.setFontSize(12);
      q.options.forEach((opt, optIndex) => {
        const isCorrect = opt === q.correctAnswer;
        doc.setTextColor(isCorrect ? (46, 125, 50) : (0, 0, 0));
        doc.text(`${String.fromCharCode(65 + optIndex)}. ${opt} ${isCorrect ? '✓' : ''}`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    });
    
    doc.save(`Exam_${newQuestion.grade}_${newQuestion.subject}_Teacher.pdf`);
  };

  // Generate PDF for Students (without answers)
  const generateStudentPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('EXAM PAPER (STUDENT VERSION)', 105, 20, { align: 'center' });
    
    // Exam Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Grade: ${newQuestion.grade}`, 20, 35);
    doc.text(`Subject: ${newQuestion.subject}`, 20, 45);
    doc.text(`Date: ${newQuestion.date}`, 20, 55);
    
    // Instructions
    doc.setFontSize(10);
    doc.text('Instructions:', 20, 65);
    doc.text('- Answer all questions', 25, 75);
    doc.text('- Circle the correct option for each question', 25, 85);
    
    // Questions
    let yPosition = 100;
    newQuestion.questions.forEach((q, qIndex) => {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${qIndex + 1}. ${q.question} (${q.marks} mark${q.marks > 1 ? 's' : ''})`, 20, yPosition);
      yPosition += 10;
      
      // Options
      doc.setFontSize(12);
      q.options.forEach((opt, optIndex) => {
        doc.text(`${String.fromCharCode(65 + optIndex)}. ${opt}`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    });
    
    doc.save(`Exam_${newQuestion.grade}_${newQuestion.subject}_Student.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Exam Management System</h1>
          <p className="mt-2">Create, manage, and distribute exams</p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'create' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('create')}
          >
            Create Exam
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'manage' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Exams
          </button>
        </div>
        
        {/* Create Exam Tab */}
        {activeTab === 'create' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Create New Exam</h2>
              <button
                onClick={handleAddQuestion}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <FiPlus /> Add Question Set
              </button>
            </div>
            
            {questions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FiFileText className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">No exam questions created yet</p>
                <p className="text-gray-400 mt-2">Click "Add Question Set" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((qSet, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-indigo-700">{qSet.grade} - {qSet.subject}</h3>
                        <p className="text-gray-600">{qSet.date}</p>
                        <p className="text-sm text-gray-500 mt-1">{qSet.questions.length} questions</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditQuestion(index)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Manage Exams Tab */}
        {activeTab === 'manage' && questions.length > 0 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Manage Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((qSet, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-indigo-700">{qSet.grade} - {qSet.subject}</h3>
                  <p className="text-gray-600">{qSet.date}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={generateStudentPDF}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700"
                    >
                      <FiDownload size={14} /> Student PDF
                    </button>
                    <button
                      onClick={generateTeacherPDF}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-blue-700"
                    >
                      <FiDownload size={14} /> Teacher PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Question Modal */}
      <AnimatePresence>
        {showQuestionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingIndex !== null ? 'Edit Question Set' : 'Add New Question Set'}
                  </h2>
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveQuestion}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                      <input
                        type="text"
                        placeholder="e.g., 10-A"
                        value={newQuestion.grade}
                        onChange={(e) => setNewQuestion({ ...newQuestion, grade: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="e.g., Mathematics"
                        value={newQuestion.subject}
                        onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newQuestion.date}
                        onChange={(e) => setNewQuestion({ ...newQuestion, date: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Questions Navigation */}
                  <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
                    {newQuestion.questions.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          currentQuestionIndex === index
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Q{index + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={addNewQuestion}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1"
                    >
                      <FiPlus size={16} /> Add
                    </button>
                  </div>
                  
                  {/* Current Question */}
                  {newQuestion.questions.length > 0 && (
                    <div className="border rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Question {currentQuestionIndex + 1}</h3>
                        {newQuestion.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(currentQuestionIndex)}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                        <textarea
                          name="question"
                          value={newQuestion.questions[currentQuestionIndex].question}
                          onChange={(e) => handleQuestionChange(e, currentQuestionIndex)}
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows="3"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                        <input
                          type="number"
                          name="marks"
                          min="1"
                          value={newQuestion.questions[currentQuestionIndex].marks}
                          onChange={(e) => handleQuestionChange(e, currentQuestionIndex)}
                          className="w-20 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                        {newQuestion.questions[currentQuestionIndex].options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correctAnswer-${currentQuestionIndex}`}
                              checked={newQuestion.questions[currentQuestionIndex].correctAnswer === opt}
                              onChange={() => {
                                const updatedQuestions = [...newQuestion.questions];
                                updatedQuestions[currentQuestionIndex].correctAnswer = opt;
                                setNewQuestion({ ...newQuestion, questions: updatedQuestions });
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(e, currentQuestionIndex, optIndex)}
                              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowQuestionModal(false)}
                      className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <FiSave /> Save Question Set
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffExam;