import React, { useState, useEffect } from 'react';

export default function ExamPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedExams, setBookmarkedExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [practiceScores, setPracticeScores] = useState({});

  const exams = [
    { id: 1, subject: 'Mathematics', date: '2025-05-10', time: '10:00 AM', status: 'Upcoming' },
    { id: 2, subject: 'Physics', date: '2025-05-12', time: '2:00 PM', status: 'Upcoming' },
    { id: 3, subject: 'Chemistry', date: '2025-04-25', time: '9:00 AM', status: 'Completed' },
    { id: 4, subject: 'Biology', date: '2025-05-05', time: '11:00 AM', status: 'Missed' },
  ];

  // Load from localStorage
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedExams')) || [];
    const storedCompleted = JSON.parse(localStorage.getItem('completedExams')) || [];
    const storedScores = JSON.parse(localStorage.getItem('practiceScores')) || {};
    setBookmarkedExams(storedBookmarks);
    setCompletedExams(storedCompleted);
    setPracticeScores(storedScores);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bookmarkedExams', JSON.stringify(bookmarkedExams));
    localStorage.setItem('completedExams', JSON.stringify(completedExams));
    localStorage.setItem('practiceScores', JSON.stringify(practiceScores));
  }, [bookmarkedExams, completedExams, practiceScores]);

  const filteredExams = exams.filter(exam =>
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const takePracticeTest = (examId) => {
    const score = Math.floor(Math.random() * 100) + 1;
    setPracticeScores(prev => ({ ...prev, [examId]: score }));
    alert(`Practice Test Completed! You scored: ${score}%`);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data?')) {
      setBookmarkedExams([]);
      setCompletedExams([]);
      setPracticeScores({});
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-indigo-200 p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-5xl font-bold text-center text-indigo-700 mb-8">📝 Exam Portal</h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Manage your exams, bookmark favorites, take practice tests and track your performance.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all">
            View All Exams
          </button>
          <button onClick={clearAllData} className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-all">
            Clear All Data
          </button>
        </div>

        {/* Search bar */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search by subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          />
        </div>

        {/* Bookmarked Exams */}
        {bookmarkedExams.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-center mb-8 text-purple-700">⭐ My Bookmarked Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {bookmarkedExams.map((examId) => {
                const exam = exams.find((e) => e.id === examId);
                if (!exam) return null;
                return (
                  <div key={exam.id} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-yellow-400 relative hover:shadow-2xl transition-all">
                    <div
                      onClick={() => toggleBookmark(exam.id)}
                      className="absolute top-4 right-4 cursor-pointer text-2xl"
                    >
                      ⭐
                    </div>

                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-yellow-600 mb-2">{exam.subject}</h2>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${getStatusColor(exam.status)}`}>
                        {exam.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-gray-700 text-sm">
                      <p><strong>Date:</strong> {exam.date}</p>
                      <p><strong>Time:</strong> {exam.time}</p>
                      {practiceScores[exam.id] && (
                        <p className="text-green-600"><strong>Practice Score:</strong> {practiceScores[exam.id]}%</p>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <button onClick={() => takePracticeTest(exam.id)} className="w-full px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all text-sm">
                        Take Practice Test
                      </button>
                      <button onClick={() => markAsCompleted(exam.id)} className="w-full px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all text-sm">
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Exams */}
        <div>
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">📚 All Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-indigo-400 relative hover:shadow-2xl transition-all"
              >
                <div
                  onClick={() => toggleBookmark(exam.id)}
                  className="absolute top-4 right-4 cursor-pointer text-2xl"
                >
                  {bookmarkedExams.includes(exam.id) ? '⭐' : '☆'}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-indigo-600 mb-2">{exam.subject}</h2>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${getStatusColor(completedExams.includes(exam.id) ? 'Completed' : exam.status)}`}>
                    {completedExams.includes(exam.id) ? 'Completed' : exam.status}
                  </span>
                </div>

                <div className="space-y-2 text-gray-700 text-sm">
                  <p><strong>Date:</strong> {exam.date}</p>
                  <p><strong>Time:</strong> {exam.time}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No exams found for your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
