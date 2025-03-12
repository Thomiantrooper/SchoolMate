import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


function StudentHome() {
  return <h2></h2>;
}

function StudentLMS() {
  return <h2></h2>;
}

function ExamPortal() {
  return <h2></h2>;
}

function HomeworkPortal() {
  return <h2></h2>;
}

function SchoolFeePortal() {
  return <h2></h2>;
}

function StudentRecords() {
  return <h2></h2>;
}

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
    <div style={{
      display: "flex",
      minHeight: "220vh",
      backgroundColor: "#F5F5F5"
    }}>
      
      {/* Sidebar */}
      <div style={{
        width: "280px",
        background: "linear-gradient(135deg, #6E44FF, #B43E8F)",
        color: "#fff",
        padding: "30px 15px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        alignItems: "center",
        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ marginBottom: "30px", fontSize: "24px", fontWeight: "bold" }}>Student Portal</h2>
        
        {/* Sidebar Buttons Container */}
        <div style={{ width: "100%" }}>
          <SidebarButton label="🏠 Home" to="/student-page/student-portal?tab=home" active={tab === "home"} />
          <SidebarButton label="📚 LMS" to="/student-page/student-portal?tab=LMS" active={tab === "LMS"} />
          <SidebarButton label="📝 Exam Portal" to="/student-page/student-portal?tab=exam-portal" active={tab === "exam-portal"} />
          <SidebarButton label="📖 Homework Portal" to="/student-page/student-portal?tab=homework-portal" active={tab === "homework-portal"} />
          <SidebarButton label="💰 School Fee Portal" to="/student-page/student-portal?tab=school-fee-portal" active={tab === "school-fee-portal"} />
          <SidebarButton label="📂 Student Records" to="/student-page/student-portal?tab=student-records" active={tab === "student-records"} />
        </div>
      </div>
      
      {tab === 'home' && <StudentHome />}
      {tab === 'LMS' && <StudentLMS />}
      {tab === 'exam-portal' && <ExamPortal />}
      {tab === 'homework-portal' && <HomeworkPortal />}
      {tab === 'school-fee-portal' && <SchoolFeePortal />}
      {tab === 'student-records' && <StudentRecords />}
    </div>
  );
}


function SidebarButton({ label, to, active }) {
  return (
    <Link to={to} style={{
      display: "block",
      padding: "12px 20px",
      margin: "8px 0",
      borderRadius: "12px",
      textAlign: "center",
      background: active ? "#FFD700" : "rgba(255, 255, 255, 0.15)",
      color: active ? "#333" : "#ffffff",
      fontWeight: "600",
      textDecoration: "none",
      transition: "background 0.3s, transform 0.2s",
      boxShadow: active ? "0px 4px 12px rgba(255, 215, 0, 0.5)" : "none"
    }}>
      {label}
    </Link>
  );
}