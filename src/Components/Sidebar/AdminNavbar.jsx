import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../Redux/auth/action";
import Menu from "../Menu/Menu";
import { Dropdown } from "antd";

// Image imports
import user from "../../Assets/useravatar.png";
import logo from "../../Assets/logo.png";

// Correct imports (all icons verified to exist)
import { 
  HiOutlineHome, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineAcademicCap, 
  HiOutlineCalendar, 
  HiOutlineChartBar, 
  HiOutlineChatAlt2, 
  HiOutlineLogout,
  HiOutlineSpeakerphone 
} from "react-icons/hi";
import { FaGraduationCap, FaTasks, FaTrophy } from "react-icons/fa";
import { MdEvent, MdOutlineForum } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";
import { BiUser, BiUserCheck,BiLogOut  } from "react-icons/bi";
import { TbReport } from "react-icons/tb";
import { LuLayoutGrid } from "react-icons/lu"; // Added Lucide icon import

import { GoChevronDown } from "react-icons/go";  // Octicons chevron


// CSS
import "./Navbar.css";

const AdminNavbar = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useSelector((store) => store.auth);

  // useEffect(() => {
  //   if (!auth?.data?.isAuthenticated) {
  //     navigate("/");
  //   }
  // }, [auth?.data?.isAuthenticated, navigate]);

  // Safe destructuring
  const user = auth?.data?.user || {};
  const { userType = "", name = "User", premium = "false" } = user;

  const [toggle, setToggle] = useState(true);

  const studentData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/admin" },
    { icon: <FaTasks />, title: "MyTask", address: "/admin/adminTask" },
    { icon: <HiOutlineCalendar />, title: "Calendar", address: "/admin/adminCalendar" },
    { icon: <MdEvent />, title: "Events", address: "/eventsList" },
    { icon: <PiExamFill />, title: "Tests", address: "/testsList" },
    { icon: <BiUser />, title: "UserMarks", address: "/usermarks" },
    { icon: <HiOutlineChartBar />, title: "TaskProgress", address: "/admin/adminTaskProgress" },
    { icon: <HiOutlineChatAlt2 />, title: "Forum", address: "/admin/adminForum" },
    { icon: <HiOutlineQuestionMarkCircle />, title: "Query", address: "/admin/adminQuery" },
    { icon: <HiOutlineSpeakerphone />, title: "Announcement", address: "/admin/adminAnnouncement" },
    { icon: <FaTrophy />, title: "Achievements", address: "/admin/adminAchievements" },
  ];
  
  const adminData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/admin" },
    { icon: <FaGraduationCap />, title: "Degrees", address: "/degrees" },
    { icon: <MdEvent />, title: "Events", address: "/events" },
    { icon: <PiExamFill />, title: "Test", address: "/test" },
    { icon: <BiUserCheck />, title: "Usermarks", address: "/usermarks" },
    { icon: <HiOutlineLogout />, title: "Logout", address: "/logout" },
  ];
  
  const tutorData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/home" },
    { icon: <FaTasks />, title: "My Tasks", address: "/myTask" },
    { icon: <HiOutlineCalendar />, title: "Calendar", address: "/calendar" },
    { icon: <TbReport />, title: "Reports", address: "/reports" },
    { icon: <HiOutlineChatAlt2 />, title: "Forum", address: "/forum" },
    { icon: <HiOutlineQuestionMarkCircle />, title: "Queries", address: "/query" },
  ];
  


  const handleLogout = () => {
    navigate("/"); // Navigates to homepage
  };

  const dropdownItems = [
    {
      key: "1",
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div id="sidebar" className={toggle ? "hide" : ""}>
        <Link to="/" className="logo">
          <div className="logoBox">
            <img src={logo} alt="logo" />
            <LuLayoutGrid
              className="menuIconHidden"
              onClick={() => setToggle(!toggle)}
            />
          </div>
        </Link>

        <ul className="side-menu top">
       
          {userType === "" &&
            studentData.map((data, i) => (
              <Menu
                Icon={data.icon}
                Title={data.title}
                key={i}
                Address={data.address}
              />
            ))}
          {userType === "Admin" &&
            adminData.map((data, i) => (
              <Menu
                Icon={data.icon}
                Title={data.title}
                key={i}
                Address={data.address}
              />
            ))}

          {/* Logout at the bottom */}
          <span onClick={handleLogout}>
            <Menu Icon={<BiLogOut />} Title="Logout" Address="" />
          </span>
        </ul>
      </div>

      {/* Main Content */}
      <div id="content">
        <nav>
          <div>
            <LuLayoutGrid className="menuIcon" onClick={() => setToggle(!toggle)} />

            {userType === "Student" ? (
              premium === "false" ? (
                <Link to="/" className="nav-link">
                  🔥 Access all features with premium! <span>Buy now!</span>
                </Link>
              ) : (
                <span className="nav-link">🔥 You are a premium member!</span>
              )
            ) : (
              <span className="nav-link">🔥 Welcome to LMS!</span>
            )}
          </div>

          <div>
            <Dropdown menu={{ items: dropdownItems }} placement="bottomLeft" arrow>
              <div className="profile">
                <img src={user} alt="User" />
                <div>
                  <p>{name}</p>
                  <p>
                    {userType} <GoChevronDown />
                  </p>
                </div>
              </div>
            </Dropdown>
          </div>
        </nav>

        {/* Render children */}
        {children}
      </div>
    </>
  );
};

export default AdminNavbar;