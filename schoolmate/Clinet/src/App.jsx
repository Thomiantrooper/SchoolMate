import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Header from "./components/header";
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
import StudentPaymentPage from "./components/StudentPaymentPage";
import LeaveRequest from "./pages/LeaveRequest";
import StudentLMS from "./components/StudentLMS";
import WorkloadBalancer from "./pages/WorkloadBalancer";
import TeacherScheduler from "./pages/TeacherScheduler";
import Chatbot from "./pages/Chatbot";
import AiWork from "./pages/AiWork";
import StaffSalaryAssign from "./components/StaffSalaryAssign";
import AdminMaintenance from "./components/AdminMaintenance";
import AdminIncome from "./components/AdminIncome"
import StaffExam from "./components/StaffExam";

import StaffHeader from "./components/StaffHeader";
import StaffFooter from "./components/StaffFooter";
import StaffDashboard from "./pages/StaffDashboard";
import StaffProfile from "./components/StaffProfile";
import StaffModule from "./components/StaffModule";
import StaffPayment from "./components/StaffPayment";
import StaffContact from "./components/StaffContact";
import AddIncomePage from "./components/AddIncome";
import StaffAddBankdetails from "./components/StaffAddBankdetails";
import Library from "./pages/Library";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

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
                <Route path="/chat-bot" element={<Chatbot />} />



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
                  <Route path="/lms" element={<StudentLMS />} />
                  <Route path="/ai-workload" element={<WorkloadBalancer />} />
                  <Route path="/teacher-scheduler" element={<TeacherScheduler />} />
                  <Route path="/ai-schedule" element={<AiWork />} />
                  <Route path="/assign-salary" element={<StaffSalaryAssign />} />
                  <Route path="/admin-maintenance" element={<AdminMaintenance />} />
                  <Route path="/admin-income" element={<AdminIncome />} />
                  <Route path="/admin-income/add" element={<AddIncomePage />} />
                  <Route path="/admin-income/add/:incomeId" element={<AddIncomePage />} />
                  <Route path="/library" element={<Library />} />
                </Route>
              </Routes>
              <Footer />
            </ThemeLayout>
          }
        />

        {/* Student Pages with Separate Header & Footer */}
        <Route
          path="/student-page/*"
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

        {/* Staff Pages with Separate Header & Footer */}
        <Route
          path="/staff-page/*"
          element={
            <ThemeLayout>
              <StaffHeader />
              <Routes>
                <Route path="/" element={<StaffDashboard />} />
                <Route path="/profile" element={<StaffProfile />} />
                <Route path="/modules" element={<StaffModule />} />
                <Route path="/payment" element={<StaffPayment />} />
                <Route path="/contact" element={<StaffContact />} />
                <Route path="/exam" element={<StaffExam />} />
                <Route path="/bank-details" element={<StaffAddBankdetails />} />
              </Routes>
              <StaffFooter />
            </ThemeLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
