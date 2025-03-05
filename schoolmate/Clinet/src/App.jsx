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
import LandingPage from "./pages/LandingPage";
import StudentHeader from "./components/StudentHeader";
import StudentFooter from "./components/StudentFooter";
import StudentProfile from "./pages/StudentProfile";
import StudentPortal from "./pages/StudentPortal"; 
import StudentPaymentPage from "./components/StudentPaymentPage"
import LeaveRequest from "./pages/LeaveRequest"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout with Header & Footer */}
        <Route 
          path="/*" 
          element={
            <ThemeLayout>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin-finance" element={<AdminFinance />} />
                  <Route path="/admin-academy" element={<AdminAcademy />} />
                  <Route path="/admin-student" element={<AdminStudent />} />
                  <Route path="/admin-staff" element={<AdminStaff />} />
                  <Route path="/admin-student-fee" element={<AdminStudentFees />} />
                  <Route path="/admin-staff-salary" element={<AdminStaffSalary />} />
                  <Route path="/leave-request" element={<LeaveRequest />} />
                </Route> 
              </Routes>
              <Footer />
            </ThemeLayout>
          } 
        />

        {/* Student Pages with Separate Header & Footer */}
        <Route 
          path="/student-page/*"  // Allows nested student routes
          element={
            <ThemeLayout>  
              <StudentHeader />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/student-profile" element={<StudentProfile />} /> 
                <Route path="/student-portal" element={<StudentPortal />} /> 
                <Route path="/payment" element={<StudentPaymentPage />} />
              </Routes>
              <StudentFooter />
            </ThemeLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
