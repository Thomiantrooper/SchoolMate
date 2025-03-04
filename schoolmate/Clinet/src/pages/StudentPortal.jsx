import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentHome from '../components/StudentHome';
import StudentLMS from '../components/StudentLMS';
import ExamPortal from '../components/ExamPortal';
import HomeworkPortal from '../components/HomeworkPortal';
import SchoolFeePortal from '../components/SchoolFeePortal';
import StudentRecords from '../components/StudentRecords';

export default function StudentPortal() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar with absolute fixed width */}
      <div className="w-[250px] min-w-[250px] max-w-[250px] flex-shrink-0">
        <StudentSidebar />
      </div>

      {/* Content area with flexible width */}
      <div className="flex-grow p-4">
        {tab === 'home' && <StudentHome />}
        {tab === 'LMS' && <StudentLMS />}
        {tab === 'exam-portal' && <ExamPortal />}
        {tab === 'homework-portal' && <HomeworkPortal />}
        {tab === 'school-fee-portal' && <SchoolFeePortal />}
        {tab === 'student-records' && <StudentRecords />}
      </div>
    </div>
  );
}
