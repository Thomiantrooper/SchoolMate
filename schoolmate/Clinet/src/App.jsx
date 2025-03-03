import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ThemeLayout from "./components/ThemeLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminFinance from "./pages/AdminFinance";
import AdminAcademy from "./pages/AdminAcademy";
import AdminStudent from "./pages/AdminStudent";
import AdminStaff from "./pages/AdminStaff";
import AdminStudentFees from "./pages/AdminStudenFee";
import AdminStaffSalary from "./pages/AdminStaffSalary";


export default function App() {
  return (
    <ThemeLayout>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-finance" element={<AdminFinance />} />
          <Route path="/admin-academy" element={<AdminAcademy />} />
          <Route path="/admin-student" element={<AdminStudent />} />
          <Route path="/admin-staff" element={<AdminStaff />} />
          <Route path="/admin-student-fee" element={<AdminStudentFees />} />
          <Route path="/admin-staff-salary" element={<AdminStaffSalary />} />
          </Route> 
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeLayout>
  );
}
