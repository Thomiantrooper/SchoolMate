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

export default function App() {
  return (
    <ThemeLayout>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          </Route> 
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeLayout>
  );
}
