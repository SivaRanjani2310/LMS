import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../Redux/auth/action";
import Menu from "../Menu/Menu";
import { Dropdown } from "antd";

// Image imports
import user from "../../Assets/useravatar.png";
import logo from "../../Assets/logo.png";

// Icon imports
import { BiLogOut, BiUserVoice } from "react-icons/bi";
import { TbLayoutGridAdd, TbUsers, TbBrandSpeedtest } from "react-icons/tb";
import { LuLayoutGrid } from "react-icons/lu";
import { PiStudentDuotone } from "react-icons/pi";
import { HiOutlineHome } from "react-icons/hi";
import { GoChevronDown } from "react-icons/go";
import { RiAdminLine } from "react-icons/ri";
import { AiOutlineQuestion } from "react-icons/ai";
import { TbReport } from "react-icons/tb";

// CSS import
import "./Navbar.css";

const Navbar = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useSelector((store) => store.auth);
  if (!auth.data.isAuthenticated) {
    return navigate("/");
  }

  const {
    user: { userType, name, premium },
  } = auth.data;

  const [toggle, setToggle] = useState(true);

  const studentData = [
    { icon: <HiOutlineHome />, title: "Dashboard", address: "/home" },
    { icon: <BiUserVoice />, title: "Announcement", address: "/announcement" },
    { icon: <TbBrandSpeedtest />, title: "My Task", address: "/myTask" },
    { icon: <TbLayoutGridAdd />, title: "Calendar", address: "/calendar" },
    { icon: <LuLayoutGrid />, title: "Task Progress", address: "/taskprogress" },
    // { icon: <TbReport />, title: "Task Report", address: "/taskReport" },
    { icon: <RiAdminLine />, title: "Achievements", address: "/achievement" },
    { icon: <TbReport />, title: "Marks", address: "/marks" },
    { icon: <PiStudentDuotone />, title: "Forum", address: "/forum" },
    { icon: <AiOutlineQuestion />, title: "Query", address: "/query" },
  ];

  const handleLogout = () => {
    dispatch(authLogout());
  };

  const items = [
    {
      key: "1",
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  return (
    <>
      <div id="sidebar" className={toggle ? "hide" : ""}>
        <Link href="/" className="logo">
          <div className="logoBox">
            <img src={logo} alt="logo" />
            <LuLayoutGrid
              className="menuIconHidden"
              onClick={() => setToggle(!toggle)}
            />
          </div>
        </Link>

        <ul className="side-menu top">
          {userType === "Student" &&
            studentData.map((data, i) => (
              <Menu
                key={i}
                Icon={data.icon}
                Title={data.title}
                Address={data.address}
              />
            ))}

          <span onClick={handleLogout}>
            <Menu Icon={<BiLogOut />} Title={"Logout"} Address={""} />
          </span>
        </ul>
      </div>

      <div id="content">
        <nav>
          <div>
            <LuLayoutGrid
              className="menuIcon"
              onClick={() => setToggle(!toggle)}
            />
            {userType === "Student" ? (
              premium === "false" ? (
                <Link href="/" className="nav-link">
                  🔥 Access all features with premium! <span>Buy now!</span>
                </Link>
              ) : (
                "🔥 You are a premium member!"
              )
            ) : (
              <Link href="/" className="nav-link">
                🔥 Welcome to LMS!
              </Link>
            )}
          </div>
          <div>
            <Dropdown menu={{ items }} placement="bottomLeft" arrow>
              <Link href="/" className="profile">
                <img src={user} />
                <div>
                  <p>{name}..</p>
                  <p>
                    {userType} <GoChevronDown />
                  </p>
                </div>
              </Link>
            </Dropdown>
          </div>
        </nav>
        {children}
      </div>
    </>
  );
};

export default Navbar;
