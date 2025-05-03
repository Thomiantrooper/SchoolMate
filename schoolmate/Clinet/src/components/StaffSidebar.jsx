import { Link, useLocation } from "react-router-dom";

export default function StaffSidebar() {
  const location = useLocation();

  return (
    <div
      style={{
        width: "280px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #004AAD, #6A1B9A)",
        color: "#fff",
        padding: "30px 15px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        alignItems: "center",
        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ marginBottom: "30px", fontSize: "24px", fontWeight: "bold" }}>Staff Portal</h2>

      <div style={{ width: "100%" }}>
        <SidebarButton label="🏠 Profile" to="/staff-page/profile" active={location.pathname.includes("profile")} />
        <SidebarButton label="📚 Modules" to="/staff-page/modules" active={location.pathname.includes("modules")} />
        <SidebarButton label="💰 Payments" to="/staff-page/payment" active={location.pathname.includes("payment")} />
        <SidebarButton label="📞 Contacts" to="/staff-page/contact" active={location.pathname.includes("contact")} />
        <SidebarButton label="📝 Exam" to="/staff-page/exam" active={location.pathname.includes("exam")} />
        <SidebarButton label="🌴 Leave-Request" to="/staff-page/staff-leave" active={location.pathname.includes("staff-leave")} />
        <SidebarButton label="📂 Student Records" to="/staff-page/staff-records" active={location.pathname.includes("staff-records")} />
      </div>
    </div>
  );
}

function SidebarButton({ label, to, active }) {
  return (
    <Link
      to={to}
      style={{
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
        boxShadow: active ? "0px 4px 12px rgba(255, 215, 0, 0.5)" : "none",
      }}
    >
      {label}
    </Link>
  );
}
