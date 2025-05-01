import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentHome from '../components/StudentHome';
import StudentLMS from '../components/StudentLMS';
import ExamPortal from '../components/ExamPortal';
import HomeworkPortal from '../components/HomeworkPortal';
import SchoolFeePortal from '../components/SchoolFeePortal';
import StudentRecords from '../components/StudentRecords';

function DailyTip() {
  const tips = [
    'Break study sessions into 25-minute sprints.',
    'Practice past papers to prepare effectively.',
    'Use diagrams to visualize information.',
    'Explain topics to a friend to improve recall.',
  ];
  const [tip, setTip] = useState('');
  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);
  return (
    <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow text-blue-800 dark:text-blue-200">
      💡 <strong>Study Tip:</strong> {tip}
    </div>
  );
}

function ProgressSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'LMS Progress', percent: 72 },
        { label: 'Homework Done', percent: 58 },
        { label: 'Exam Attendance', percent: 89 },
      ].map(({ label, percent }) => (
        <div key={label} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="mb-2 font-medium">{label}</div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <div className="text-sm text-right mt-1 text-gray-500 dark:text-gray-300">{percent}%</div>
        </div>
      ))}
    </div>
  );
}

function ExamCountdown({ examDate = '2025-05-10T09:00:00' }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(examDate) - new Date();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [examDate]);

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow text-yellow-800 dark:text-yellow-200">
      ⏳ <strong>Next Exam In:</strong> {timeLeft}
    </div>
  );
}

function UpcomingEvents() {
  const events = [
    { date: 'May 3', title: 'Science Fair Project Due' },
    { date: 'May 6', title: 'Math Midterm' },
    { date: 'May 12', title: 'Field Trip' },
  ];
  return (
    <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow text-green-900 dark:text-green-200">
      📅 <strong>Upcoming Events:</strong>
      <ul className="mt-2 space-y-1 text-sm">
        {events.map((e, i) => (
          <li key={i}>🗓️ <strong>{e.date}:</strong> {e.title}</li>
        ))}
      </ul>
    </div>
  );
}

function SkillOfTheDay() {
  const skills = [
    'Learn to take Cornell Notes',
    'Try Pomodoro Timer today!',
    'Explore AI tools for study',
    'Master a new keyboard shortcut',
  ];
  const [skill, setSkill] = useState('');
  useEffect(() => {
    setSkill(skills[Math.floor(Math.random() * skills.length)]);
  }, []);
  return (
    <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg shadow text-purple-800 dark:text-purple-200">
      🎓 <strong>Skill of the Day:</strong> {skill}
    </div>
  );
}

function MoodTracker() {
  const [mood, setMood] = useState('');
  const moodData = {
    '😊': {
      message: "Glad you're feeling great!",
      bg: 'bg-green-100 dark:bg-green-900',
      emoji: '🌞',
    },
    '😐': {
      message: "Hope your day improves!",
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      emoji: '🌤️',
    },
    '😞': {
      message: "Take it easy. You're not alone.",
      bg: 'bg-red-100 dark:bg-red-900',
      emoji: '🌧️',
    },
  };

  const currentMood = moodData[mood];

  return (
    <div
      className={`p-4 rounded-lg shadow transition-all duration-300 ${
        currentMood ? currentMood.bg : 'bg-pink-100 dark:bg-pink-900'
      } text-gray-900 dark:text-white`}
    >
      🧘 <strong>How are you feeling today?</strong>
      <div className="flex gap-2 mt-2">
        {Object.keys(moodData).map((m) => (
          <button
            key={m}
            className={`text-2xl p-1 rounded-full hover:scale-110 ${
              mood === m ? 'bg-white dark:bg-gray-800 ring-2 ring-gray-400' : ''
            }`}
            onClick={() => setMood(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {mood && (
        <div className="mt-2 flex flex-col items-center text-center space-y-2">
          <div className="text-5xl">{currentMood.emoji}</div>
          <div className="text-lg font-medium">{currentMood.message}</div>
        </div>
      )}
    </div>
  );
}

function PersonalGoals() {
  const goals = [
    { title: 'Read 10 pages', completed: true },
    { title: 'Revise Physics Chapter 2', completed: false },
    { title: 'Submit Homework', completed: false },
  ];
  return (
    <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg shadow text-indigo-900 dark:text-indigo-200">
      🎯 <strong>Today’s Goals</strong>
      <ul className="mt-2 text-sm space-y-1">
        {goals.map((goal, i) => (
          <li key={i} className={goal.completed ? 'line-through' : ''}>
            ✅ {goal.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DailyChallenge() {
  const challenges = [
    'Take a 10-minute walk after studying.',
    'Try a new study method like SQ3R.',
    'Tidy up your study space.',
    'Reach out to a classmate for group study.',
  ];
  const [challenge, setChallenge] = useState('');
  useEffect(() => {
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
  }, []);
  return (
    <div className="bg-teal-100 dark:bg-teal-900 p-4 rounded-lg shadow text-teal-800 dark:text-teal-200">
      🎯 <strong>Daily Challenge:</strong> {challenge}
    </div>
  );
}

export default function StudentPortal() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-[250px] min-w-[250px] max-w-[250px] border-r dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
        <StudentSidebar setTab={setTab} />
      </div>

      {/* Content */}
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {/* Dynamic Tab Content */}
        {tab === 'home' && <StudentHome />}
        {tab === 'LMS' && <StudentLMS />}
        {tab === 'exam-portal' && <ExamPortal />}
        {tab === 'homework-portal' && <HomeworkPortal />}
        {tab === 'school-fee-portal' && <SchoolFeePortal />}
        {tab === 'student-records' && <StudentRecords />}

        {/* Always-Visible Extra Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DailyTip />
          <SkillOfTheDay />
          <MoodTracker />
          <UpcomingEvents />
          <ProgressSummary />
          <ExamCountdown />
          <PersonalGoals />
          <DailyChallenge />
        </div>
      </div>
    </div>
  );
}
