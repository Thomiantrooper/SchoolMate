import { Link, useLocation } from "react-router-dom";

export default function StaffSidebar() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tab = urlParams.get("tab");

  return (
    <div
      style={{
        width: "280px",
        minHeight: "100vh", // Full height of the viewport
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

      {/* Sidebar Buttons Container */}
      <div style={{ width: "100%" }}>
        <SidebarButton label="🏠 Profile" to="/staff-page/profile?tab=home" active={tab === "profile"} />
        <SidebarButton label="📚 Modules" to="/staff-page/modules?tab=module" active={tab === "module"} />
        <SidebarButton label="💰 Payments" to="/staff-page/payment?tab=payment" active={tab === "payment"} />
        <SidebarButton label="📞 Contacts" to="/staff-page/contact?tab=contact" active={tab === "contact"} />
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
