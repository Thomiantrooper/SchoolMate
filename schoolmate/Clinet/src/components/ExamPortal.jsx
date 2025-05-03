import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaRegBookmark, FaLock, FaEye, FaEyeSlash, FaHistory, FaCalendarAlt, FaClock, FaSearch, FaSun, FaMoon, FaCheck, FaTimes, FaChevronRight } from 'react-icons/fa';
import { MdSecurity, MdVerifiedUser } from 'react-icons/md';

export default function ExamPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedExams, setBookmarkedExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [practiceScores, setPracticeScores] = useState({});
  const [theme, setTheme] = useState('dark');
  const [examProgress, setExamProgress] = useState({});
  const [examFilter, setExamFilter] = useState('All');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [securityMode, setSecurityMode] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [correctSecurityCode] = useState('1234'); // In real app, this should be securely stored
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Dummy exams data
  const exams = [
    { id: 1, subject: 'Mathematics', category: 'Math', date: '2025-05-10', time: '10:00 AM', status: 'Upcoming', duration: '2 hours', location: 'Room 101' },
    { id: 2, subject: 'Physics', category: 'Science', date: '2025-05-12', time: '2:00 PM', status: 'Upcoming', duration: '1.5 hours', location: 'Room 205' },
    { id: 3, subject: 'Chemistry', category: 'Science', date: '2025-04-25', time: '9:00 AM', status: 'Completed', duration: '2 hours', location: 'Lab 3', score: '87%' },
    { id: 4, subject: 'Biology', category: 'Science', date: '2025-05-05', time: '11:00 AM', status: 'Missed', duration: '1 hour', location: 'Room 302' },
    { id: 5, subject: 'History', category: 'History', date: '2025-06-01', time: '1:00 PM', status: 'Upcoming', duration: '1.5 hours', location: 'Room 110' },
    { id: 6, subject: 'Geography', category: 'History', date: '2025-07-15', time: '3:00 PM', status: 'Missed', duration: '1 hour', location: 'Room 210' },
    { id: 7, subject: 'Computer Science', category: 'Tech', date: '2025-08-05', time: '10:30 AM', status: 'Completed', duration: '3 hours', location: 'Computer Lab', score: '92%' },
    { id: 8, subject: 'English', category: 'Literature', date: '2025-09-09', time: '2:30 PM', status: 'Upcoming', duration: '2 hours', location: 'Room 105' },
  ];

  const practiceQuestions = {
    Math: [
      {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswers: ['4'],
        explanation: 'Basic addition of two numbers.'
      },
      {
        question: 'What is 10 * 3?',
        options: ['30', '25', '35', '40'],
        correctAnswers: ['30'],
        explanation: 'Multiplication of 10 by 3 gives 30.'
      },
    ],
    Science: [
      {
        question: 'What is the chemical symbol for water?',
        options: ['O2', 'H2O', 'CO2', 'HO2'],
        correctAnswers: ['H2O'],
        explanation: 'Water consists of two hydrogen atoms and one oxygen atom.'
      },
      {
        question: 'What is the unit of force?',
        options: ['Newton', 'Joule', 'Meter', 'Pascal'],
        correctAnswers: ['Newton'],
        explanation: 'Force is measured in Newtons (N) in the SI system.'
      },
    ],
    History: [
      {
        question: 'Who was the first President of the United States?',
        options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
        correctAnswers: ['George Washington'],
        explanation: 'George Washington served from 1789 to 1797.'
      },
      {
        question: 'In what year did World War II end?',
        options: ['1941', '1945', '1939', '1950'],
        correctAnswers: ['1945'],
        explanation: 'WWII ended in 1945 with the surrender of Japan.'
      },
    ],
    Tech: [
      {
        question: 'Who developed the first computer?',
        options: ['Alan Turing', 'Charles Babbage', 'Bill Gates', 'Steve Jobs'],
        correctAnswers: ['Charles Babbage'],
        explanation: 'Charles Babbage designed the first mechanical computer in the early 19th century.'
      },
      {
        question: 'What does HTML stand for?',
        options: ['Hypertext Markup Language', 'High Tech Machine Learning', 'Hyperlink Text Markup Language', 'Hyper Media Language'],
        correctAnswers: ['Hypertext Markup Language'],
        explanation: 'HTML is the standard markup language for creating web pages.'
      },
    ],
    Literature: [
      {
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'J.K. Rowling'],
        correctAnswers: ['William Shakespeare'],
        explanation: 'Shakespeare wrote this famous tragedy in the late 16th century.'
      },
      {
        question: 'What is the genre of "The Great Gatsby"?',
        options: ['Drama', 'Fiction', 'Romance', 'Science Fiction'],
        correctAnswers: ['Fiction'],
        explanation: 'The Great Gatsby is considered a classic of American fiction.'
      },
    ],
  };

  useEffect(() => {
    // Load from localStorage
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedExams')) || [];
    const storedCompleted = JSON.parse(localStorage.getItem('completedExams')) || [];
    const storedScores = JSON.parse(localStorage.getItem('practiceScores')) || {};
    const storedProgress = JSON.parse(localStorage.getItem('examProgress')) || {};
    const storedTheme = localStorage.getItem('theme') || 'dark';
    const storedSecurity = localStorage.getItem('securityMode') === 'true';
    
    setBookmarkedExams(storedBookmarks);
    setCompletedExams(storedCompleted);
    setPracticeScores(storedScores);
    setExamProgress(storedProgress);
    setTheme(storedTheme);
    setSecurityMode(storedSecurity);
    
    // Apply theme
    document.body.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('bookmarkedExams', JSON.stringify(bookmarkedExams));
    localStorage.setItem('completedExams', JSON.stringify(completedExams));
    localStorage.setItem('practiceScores', JSON.stringify(practiceScores));
    localStorage.setItem('examProgress', JSON.stringify(examProgress));
    localStorage.setItem('theme', theme);
    localStorage.setItem('securityMode', securityMode);
  }, [bookmarkedExams, completedExams, practiceScores, examProgress, theme, securityMode]);

  const filteredExams = exams
    .filter(exam => examFilter === 'All' || exam.status === examFilter)
    .filter(exam => exam.subject.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleSecurityMode = () => {
    if (securityMode) {
      setSecurityMode(false);
    } else {
      setShowSecurityModal(true);
    }
  };

  const verifySecurityCode = () => {
    if (securityCode === correctSecurityCode) {
      setSecurityMode(true);
      setIsVerified(true);
      setShowSecurityModal(false);
      setSecurityCode('');
    } else {
      alert('Incorrect security code!');
    }
  };

  const updateProgress = (examId, score) => {
    setExamProgress(prev => ({
      ...prev,
      [examId]: { ...prev[examId], score: score, attempts: (prev[examId]?.attempts || 0) + 1 }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Missed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const toggleBookmark = (examId) => {
    if (bookmarkedExams.includes(examId)) {
      setBookmarkedExams(prev => prev.filter(id => id !== examId));
    } else {
      setBookmarkedExams(prev => [...prev, examId]);
    }
  };

  const markAsCompleted = (examId) => {
    if (!completedExams.includes(examId)) {
      setCompletedExams(prev => [...prev, examId]);
    }
  };

  const takePracticeTest = (category) => {
    if (securityMode && !isVerified) {
      setShowSecurityModal(true);
      return;
    }
    
    setCurrentCategory(category);
    setCurrentQuestions(practiceQuestions[category]);
    setModalOpen(true);
    setIsVerified(false); // Reset verification for next time
  };

  const handleAnswerSelection = (answer, questionIndex) => {
    setSelectedAnswers(prev => {
      const updatedAnswers = { ...prev };
      if (updatedAnswers[questionIndex]) {
        if (updatedAnswers[questionIndex].includes(answer)) {
          updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter(ans => ans !== answer);
        } else {
          updatedAnswers[questionIndex].push(answer);
        }
      } else {
        updatedAnswers[questionIndex] = [answer];
      }
      return updatedAnswers;
    });
  };

  const handleSubmitAnswer = () => {
    let score = 0;
    currentQuestions.forEach((question, index) => {
      if (
        selectedAnswers[index] &&
        JSON.stringify(selectedAnswers[index].sort()) === JSON.stringify(question.correctAnswers.sort())
      ) {
        score++;
      }
    });
    
    const percentage = Math.round((score / currentQuestions.length) * 100);
    setAnswerFeedback({
      score: score,
      total: currentQuestions.length,
      percentage: percentage,
      passed: percentage >= 70
    });
    
    // Update practice scores
    setPracticeScores(prev => ({
      ...prev,
      [currentCategory]: [...(prev[currentCategory] || []), percentage]
    }));
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnswers({});
    setAnswerFeedback(null);
  };

  const getAverageScore = (category) => {
    const scores = practiceScores[category] || [];
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
      {/* Security Verification Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`rounded-xl shadow-2xl p-6 max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-center mb-4">
                <MdSecurity className="text-4xl text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-4">Security Verification</h2>
              <p className="text-center mb-6">Enter your security code to continue:</p>
              
              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-center text-xl font-mono"
                  placeholder="Enter 4-digit code"
                  maxLength="4"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowSecurityModal(false);
                    setSecurityCode('');
                  }}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={verifySecurityCode}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Exam Portal
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Manage your exams, track progress, and practice for success
          </p>
        </motion.header>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-between items-center mb-8 gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams by subject..."
              className="w-full pl-12 pr-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl flex items-center gap-2 ${theme === 'dark' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'}`}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            
            <button
              onClick={toggleSecurityMode}
              className={`p-3 rounded-xl flex items-center gap-2 ${securityMode ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            >
              <FaLock size={16} />
              <span className="hidden sm:inline">Security</span>
            </button>
            
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Exams</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <div className={`p-6 rounded-xl shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Upcoming Exams
            </h3>
            <p className="text-3xl font-bold">{exams.filter(e => e.status === 'Upcoming').length}</p>
          </div>
          
          <div className={`p-6 rounded-xl shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaCheck className="text-green-500" /> Completed Exams
            </h3>
            <p className="text-3xl font-bold">{completedExams.length}</p>
          </div>
          
          <div className={`p-6 rounded-xl shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaBookmark className="text-yellow-500" /> Bookmarked
            </h3>
            <p className="text-3xl font-bold">{bookmarkedExams.length}</p>
          </div>
        </motion.div>

        {/* Exams Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
        >
          {filteredExams.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ y: -5 }}
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-l-4 ${getStatusColor(exam.status)}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{exam.subject}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{exam.category}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleBookmark(exam.id)}
                    className={`text-xl ${bookmarkedExams.includes(exam.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                  >
                    {bookmarkedExams.includes(exam.id) ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>{exam.time} • {exam.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdVerifiedUser className="text-gray-500" />
                    <span>{exam.location}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(exam.status)} text-white`}>
                    {exam.status}
                  </span>
                  
                  {exam.score && (
                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold">
                      Score: {exam.score}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => markAsCompleted(exam.id)}
                    disabled={exam.status === 'Completed'}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${exam.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                  >
                    {exam.status === 'Completed' ? 'Completed' : 'Mark Complete'}
                  </button>
                  
                  <button
                    onClick={() => takePracticeTest(exam.category)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    Practice <FaChevronRight size={12} />
                  </button>
                </div>
                
                {practiceScores[exam.category] && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600" 
                        style={{ width: `${getAverageScore(exam.category)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                      Avg. practice score: {getAverageScore(exam.category)}%
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-6">
              <FaSearch size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Exams Found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search or filters"
                : examFilter !== 'All' 
                  ? `No ${examFilter} exams found`
                  : "No exams available at the moment"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Practice Test Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaHistory className="text-blue-500" /> {currentCategory} Practice Test
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-8">
                  {currentQuestions.map((question, index) => (
                    <div key={index} className="pb-6 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                      
                      <div className="space-y-3">
                        {question.options.map((option, i) => (
                          <label 
                            key={i} 
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedAnswers[index]?.includes(option) 
                              ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700' 
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                          >
                            <input
                              type="checkbox"
                              value={option}
                              onChange={() => handleAnswerSelection(option, index)}
                              checked={selectedAnswers[index]?.includes(option) || false}
                              className="mr-3 w-5 h-5"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      
                      {answerFeedback && (
                        <div className={`mt-4 p-3 rounded-lg ${question.correctAnswers.every(ans => selectedAnswers[index]?.includes(ans)) && 
                                        selectedAnswers[index]?.every(ans => question.correctAnswers.includes(ans))
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}
                        >
                          <p className="font-semibold">
                            {question.correctAnswers.every(ans => selectedAnswers[index]?.includes(ans)) && 
                             selectedAnswers[index]?.every(ans => question.correctAnswers.includes(ans))
                              ? 'Correct!'
                              : 'Incorrect'}
                          </p>
                          <p className="text-sm mt-1">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  {answerFeedback ? (
                    <>
                      <div className={`p-4 rounded-lg w-full sm:w-auto text-center ${answerFeedback.passed 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}
                      >
                        <p className="font-bold text-lg">
                          {answerFeedback.passed ? '🎉 Well Done! ' : 'Keep Practicing! '}
                          {answerFeedback.score}/{answerFeedback.total} ({answerFeedback.percentage}%)
                        </p>
                        <p className="text-sm mt-1">
                          {answerFeedback.passed 
                            ? 'You passed this practice test!'
                            : 'Try again to improve your score'}
                        </p>
                      </div>
                      
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Finish
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSubmitAnswer}
                      className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      disabled={Object.keys(selectedAnswers).length < currentQuestions.length}
                    >
                      Submit Answers
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}