import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeLayout";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/user/userSlice"; 

export default function StaffHeader() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector(state => state.user);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(currentUser?.profilePicture || "/default-profile.png");

  useEffect(() => {
    setProfileImage(currentUser?.profilePicture || "/default-profile.png");
  }, [currentUser?.profilePicture]);


  const handleSignOut = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    setDarkMode(false);
    navigate("/signin");
  };

  return (
    <Navbar className="border-b-2 shadow-md px-4 py-2 bg-white dark:bg-gray-900 transition-all duration-300">
      <Link to="/" className="self-center text-lg font-bold text-gray-800 dark:text-white flex items-center">
        <motion.span 
          className="px-3 py-2 bg-gradient-to-r from-blue-600 via-teal-500 to-green-400 rounded-xl text-white shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          SchoolMate
        </motion.span>
      </Link>
      
      {/* 🔍 Search Input (Hidden on Mobile) */}
      <form className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
        <TextInput type="text" placeholder="Search..." rightIcon={AiOutlineSearch} className="bg-transparent focus:ring-0 border-none" />
      </form>
      
      {/* 🌙 Dark Mode & User Section */}
      <div className="flex gap-4 md:order-2 items-center">
        {/* 🌙 Dark Mode Toggle */}
        <Button 
          className="w-10 h-10 hidden sm:flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-600 dark:text-white" />}
        </Button>

        {/* 🧑‍🎓 User Profile Dropdown */}
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={profileImage} rounded className="cursor-pointer" />}>
            <Dropdown.Header>
              <span className="block text-sm font-semibold">@{currentUser.username}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</span>
            </Dropdown.Header>

            <Dropdown.Item onClick={() => navigate('/staff-page/profile')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              Signout
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button gradientDuoTone="purpleToBlue" outline className="px-4 py-2 rounded-lg">
              Signin
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      {/* 📌 Navbar Links */}
      <Navbar.Collapse className="space-x-4">
        <Navbar.Link active={path === "/staff-page"} as={"div"}>
          <Link to="/staff-page" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-all duration-200">
            Home
          </Link>
        </Navbar.Link>
        
      </Navbar.Collapse>
    </Navbar>
  );
}
