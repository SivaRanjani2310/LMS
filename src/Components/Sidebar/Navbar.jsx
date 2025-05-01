import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../Redux/auth/action";
import Menu from "../Menu/Menu";
import { Dropdown } from "antd";

import user from "../../Assets/useravatar.png";
import logo from "../../Assets/logo.png";

// Icon imports
import { BiLogOut, BiUserVoice } from "react-icons/bi";
import { TbLayoutGridAdd, TbUsers, TbBrandSpeedtest, TbReport } from "react-icons/tb";
import { LuLayoutGrid } from "react-icons/lu";
import { PiStudentDuotone } from "react-icons/pi";
import { HiOutlineHome } from "react-icons/hi";
import { GoChevronDown } from "react-icons/go";
import { RiAdminLine } from "react-icons/ri";
import { AiOutlineQuestion } from "react-icons/ai";

import { FaGraduationCap } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import {  TbLogout2 } from "react-icons/tb";
import { PiExamFill } from "react-icons/pi";
import { BiUserCheck } from "react-icons/bi";

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
    { icon: <BiUserVoice />, title: "Announcement", address: "/announcement" },
    { icon: <TbBrandSpeedtest />, title: "MyTask", address: "/myTask" },
    { icon: <TbLayoutGridAdd />, title: "Calendar", address: "/calendar" },
    { icon: <LuLayoutGrid />, title: "TaskProgress", address: "/taskProgress" },
    { icon: <RiAdminLine />, title: "Achievements", address: "/achievements" },
    { icon: <TbReport />, title: "Marks", address: "/marks" },
    { icon: <PiStudentDuotone />, title: "Forum", address: "/forum" },
    { icon: <AiOutlineQuestion />, title: "Query", address: "/query" },
  ];

  const adminData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/admin" },
    { icon: <FaGraduationCap />, title: "Degrees", address: "/degrees" },
    { icon: <MdEvent />, title: "Events", address: "/events" },
    { icon: <PiExamFill />, title: "Test", address: "/test" },
    { icon: <BiUserCheck />, title: "Usermarks", address: "/usermarks" },
    { icon: <TbLogout2 />, title: "Logout", address: "/" },
  ];

  const tutorData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/home" },
    { icon: <TbBrandSpeedtest />, title: "My Tasks", address: "/myTask" },
    { icon: <TbLayoutGridAdd />, title: "Calendar", address: "/calendar" },
    { icon: <TbReport />, title: "Reports", address: "/reports" },
    { icon: <PiStudentDuotone />, title: "Forum", address: "/forum" },
    { icon: <AiOutlineQuestion />, title: "Queries", address: "/query" },
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