import React, { useState, useEffect } from 'react';

export default function ExamPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedExams, setBookmarkedExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [practiceScores, setPracticeScores] = useState({});
  const [theme, setTheme] = useState('light');
  const [examProgress, setExamProgress] = useState({});
  const [examFilter, setExamFilter] = useState('All');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');

  // Dummy exams to show off
  const exams = [
    { id: 1, subject: 'Mathematics', category: 'Math', date: '2025-05-10', time: '10:00 AM', status: 'Upcoming' },
    { id: 2, subject: 'Physics', category: 'Science', date: '2025-05-12', time: '2:00 PM', status: 'Upcoming' },
    { id: 3, subject: 'Chemistry', category: 'Science', date: '2025-04-25', time: '9:00 AM', status: 'Completed' },
    { id: 4, subject: 'Biology', category: 'Science', date: '2025-05-05', time: '11:00 AM', status: 'Missed' },
    { id: 5, subject: 'History', category: 'History', date: '2025-06-01', time: '1:00 PM', status: 'Upcoming' },
    { id: 6, subject: 'Geography', category: 'History', date: '2025-07-15', time: '3:00 PM', status: 'Missed' },
    { id: 7, subject: 'Computer Science', category: 'Tech', date: '2025-08-05', time: '10:30 AM', status: 'Completed' },
    { id: 8, subject: 'English', category: 'Literature', date: '2025-09-09', time: '2:30 PM', status: 'Upcoming' },
  ];

  const practiceQuestions = {
    Math: [
      {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswers: ['4'],
      },
      {
        question: 'What is 10 * 3?',
        options: ['30', '25', '35', '40'],
        correctAnswers: ['30'],
      },
    ],
    Science: [
      {
        question: 'What is the chemical symbol for water?',
        options: ['O2', 'H2O', 'CO2', 'HO2'],
        correctAnswers: ['H2O'],
      },
      {
        question: 'What is the unit of force?',
        options: ['Newton', 'Joule', 'Meter', 'Pascal'],
        correctAnswers: ['Newton'],
      },
    ],
    History: [
      {
        question: 'Who was the first President of the United States?',
        options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
        correctAnswers: ['George Washington'],
      },
      {
        question: 'In what year did World War II end?',
        options: ['1941', '1945', '1939', '1950'],
        correctAnswers: ['1945'],
      },
    ],
    Tech: [
      {
        question: 'Who developed the first computer?',
        options: ['Alan Turing', 'Charles Babbage', 'Bill Gates', 'Steve Jobs'],
        correctAnswers: ['Charles Babbage'],
      },
      {
        question: 'What does HTML stand for?',
        options: ['Hypertext Markup Language', 'High Tech Machine Learning', 'Hyperlink Text Markup Language', 'Hyper Media Language'],
        correctAnswers: ['Hypertext Markup Language'],
      },
    ],
    Literature: [
      {
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'J.K. Rowling'],
        correctAnswers: ['William Shakespeare'],
      },
      {
        question: 'What is the genre of "The Great Gatsby"?',
        options: ['Drama', 'Fiction', 'Romance', 'Science Fiction'],
        correctAnswers: ['Fiction'],
      },
    ],
  };

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedExams')) || [];
    const storedCompleted = JSON.parse(localStorage.getItem('completedExams')) || [];
    const storedScores = JSON.parse(localStorage.getItem('practiceScores')) || {};
    const storedProgress = JSON.parse(localStorage.getItem('examProgress')) || {};
    setBookmarkedExams(storedBookmarks);
    setCompletedExams(storedCompleted);
    setPracticeScores(storedScores);
    setExamProgress(storedProgress);
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarkedExams', JSON.stringify(bookmarkedExams));
    localStorage.setItem('completedExams', JSON.stringify(completedExams));
    localStorage.setItem('practiceScores', JSON.stringify(practiceScores));
    localStorage.setItem('examProgress', JSON.stringify(examProgress));
  }, [bookmarkedExams, completedExams, practiceScores, examProgress]);

  const filteredExams = exams.filter(exam => examFilter === 'All' || exam.status === examFilter).filter(exam =>
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
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
    setCurrentCategory(category);
    setCurrentQuestions(practiceQuestions[category]);
    setModalOpen(true);
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
    setAnswerFeedback(`You scored ${score} out of ${currentQuestions.length}`);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnswers({});
    setAnswerFeedback(null);
  };

  return (
    <div className={`min-h-screen p-8 font-sans flex flex-col items-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-purple-100 to-indigo-200'}`}>
      <div className="w-full max-w-7xl">
        <h1 className="text-5xl font-bold text-center text-indigo-700 mb-8">📝 Exam Portal</h1>

        <div className="flex justify-center gap-6 mb-10">
          <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all">
            View All Exams
          </button>
          <button onClick={toggleTheme} className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition-all">
            Toggle Theme
          </button>
        </div>

        {/* Search bar */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search by subject..."
            className="px-6 py-3 rounded-lg shadow-md text-lg border-2 w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="rounded-xl shadow-lg p-6 bg-white border border-gray-300">
              <h3 className="text-xl font-bold text-indigo-600">{exam.subject}</h3>
              <p className="text-black">Category: {exam.category}</p>
              <p className="text-black">Date: {exam.date} | Time: {exam.time}</p>
              <p className={`text-white text-center py-1 rounded-lg ${getStatusColor(exam.status)} mt-4`}>
                {exam.status}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => toggleBookmark(exam.id)}
                  className={`text-white font-semibold ${bookmarkedExams.includes(exam.id) ? 'bg-yellow-500' : 'bg-yellow-300'} px-4 py-2 rounded-lg`}
                >
                  {bookmarkedExams.includes(exam.id) ? 'Unbookmark' : 'Bookmark'}
                </button>

                <button
                  onClick={() => markAsCompleted(exam.id)}
                  className={`text-white font-semibold ${exam.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'} px-4 py-2 rounded-lg`}
                >
                  Mark as Completed
                </button>
              </div>

              <button
                onClick={() => takePracticeTest(exam.category)}
                className="w-full text-white font-semibold bg-indigo-600 px-4 py-2 rounded-lg mt-6"
              >
                Take Practice Test
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Practice Test */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-center mb-6 text-black">Practice Test for {currentCategory}</h2>

            <div className="space-y-6">
              {currentQuestions.map((question, index) => (
                <div key={index}>
                  <p className="text-black text-xl font-semibold">{question.question}</p>
                  <div className="mt-4 space-y-4">
                    {question.options.map((option, i) => (
                      <label key={i} className="flex items-center text-black">
                        <input
                          type="checkbox"
                          value={option}
                          onChange={() => handleAnswerSelection(option, index)}
                          checked={selectedAnswers[index]?.includes(option) || false}
                          className="mr-3 w-5 h-5"
                        />
                        <span className="text-lg">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleSubmitAnswer}
                className="bg-green-500 px-6 py-3 text-white rounded-lg"
              >
                Submit Answer
              </button>

              {answerFeedback && (
                <p className={`text-center text-lg font-semibold ${answerFeedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
                  {answerFeedback}
                </p>
              )}

              <button
                onClick={closeModal}
                className="bg-red-500 px-6 py-3 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
