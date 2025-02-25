import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Dummy components for different pages
function Profile() {
  return <h2>Profile Page</h2>;
}

function Settings() {
  return <h2>Settings Page</h2>;
}

function DashboardHome() {
  return <h2>Home Page</h2>;
}

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
    <div style={{
      display: "flex",
      minHeight: "140vh",
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
        <h2 style={{ marginBottom: "30px", fontSize: "24px", fontWeight: "bold" }}>Dashboard</h2>
        
        {/* Sidebar Buttons Container */}
        <div style={{ width: "100%" }}>
          <SidebarButton label="🏠 Home" to="/dashboard?tab=home" active={tab === "home"} />
          <SidebarButton label="👤 Profile" to="/dashboard?tab=profile" active={tab === "profile"} />
          <SidebarButton label="⚙️ Settings" to="/dashboard?tab=settings" active={tab === "settings"} />
        </div>
      </div>

      


      
      
    </div>
  );
}

// Sidebar Button Component
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
