import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../Redux/auth/action";
import Menu from "../Menu/Menu";
import { Dropdown } from "antd";

import user from "../../Assets/useravatar.png";
import logo from "../../Assets/logo.png";



import { HiOutlineHome } from "react-icons/hi";
import { FaGraduationCap, FaTasks, FaBullhorn, FaTrophy } from "react-icons/fa";
import { MdEvent, MdOutlineForum, MdQueryBuilder } from "react-icons/md";
import { PiExamFill, PiStudent } from "react-icons/pi";
import { BiUserCheck, BiUserVoice } from "react-icons/bi";
import { BiUser,BiLogOut  } from "react-icons/bi";

import { TbReport, TbLogout, TbCalendar, TbProgress } from "react-icons/tb";
import { AiOutlineQuestion } from "react-icons/ai";
import { BsSpeedometer2, BsGraphUp } from "react-icons/bs";
import { LuLayoutGrid } from "react-icons/lu"; // Added Lucide icon import
import { GoChevronDown } from "react-icons/go";  // Octicons chevron


// CSS
import "./Navbar.css";

const Navbar = ({ children }) => {
  const dispatch = useDispatch();
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
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/home" },
    { icon: <FaBullhorn />, title: "Announcement", address: "/announcement" },
    { icon: <FaTasks />, title: "MyTask", address: "/myTask" },
    { icon: <TbCalendar />, title: "Calendar", address: "/calendar" },
    { icon: <BsGraphUp />, title: "TaskProgress", address: "/taskProgress" },
    { icon: <FaTrophy />, title: "Achievements", address: "/achievements" },
    { icon: <TbReport />, title: "Marks", address: "/marks" },
    { icon: <MdOutlineForum />, title: "Forum", address: "/forum" },
    { icon: <MdQueryBuilder />, title: "Query", address: "/query" },
  ];
  
  const adminData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/admin" },
    { icon: <FaGraduationCap />, title: "Degrees", address: "/degrees" },
    { icon: <MdEvent />, title: "Events", address: "/events" },
    { icon: <PiExamFill />, title: "Test", address: "/test" },
    { icon: <BiUserCheck />, title: "Usermarks", address: "/usermarks" },
    { icon: <TbLogout />, title: "Logout", address: "/" },
  ];
  
  const tutorData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/home" },
    { icon: <FaTasks />, title: "My Tasks", address: "/myTask" },
    { icon: <TbCalendar />, title: "Calendar", address: "/calendar" },
    { icon: <TbReport />, title: "Reports", address: "/reports" },
    { icon: <MdOutlineForum />, title: "Forum", address: "/forum" },
    { icon: <MdQueryBuilder />, title: "Queries", address: "/query" },
  ];

  const navigate = useNavigate();

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
          {userType === "Tutor" &&
            tutorData.map((data, i) => (
              <Menu
                Icon={data.icon}
                Title={data.title}
                key={i}
                Address={data.address}
              />
            ))}
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
            <Menu Icon={<BiLogOut />} Title="Logout" Address="/" />
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

export default Navbar;