import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashSettings from '../components/DashSettings';
import DashHome from '../components/DashHome';
import DashStudents from '../components/DashStudents'
import DashFinance from '../components/DashFinance';
import DashAcademy from '../components/DashAcademy';
import DashStaff from '../components/DashStaff';
export default function Dashboard() {
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {tab === 'home' && <DashHome />}
      {tab === 'profile' && <DashProfile />}
      {tab === 'settings' && <DashSettings />}
      {tab === 'students' && <DashStudents />}
      {tab === 'finance' && <DashFinance />}
      {tab === 'academy' && <DashAcademy />}
      {tab === 'staff' && <DashStaff />}
    </div>
  );
}