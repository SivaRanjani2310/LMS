import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Component imports
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import SalesDiv from "../../../Components/SalesDiv/SalesDiv";
import Header from "../../../Components/Header/Header";

// Icons
import { PiKeyReturnThin } from "react-icons/pi";
import { FiShoppingCart } from "react-icons/fi";
import { BsTruck, BsClipboardMinus } from "react-icons/bs";
import { AiOutlineTag, AiOutlineLineChart } from "react-icons/ai";
import Admin_home from "./Admin_home/Admin_home";


// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// CSS and assets
import "react-vertical-timeline-component/style.min.css";
import "./Dashboard.css";
import demo from "../../../Assets/cartoon.svg";

// Sample data
import { pieData, COLORS } from "../../../data.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const { dashboard } = useSelector((store) => store.dashboard);

  const overviewData = [
    {
      icon: <FiShoppingCart />,
      title: "Admins",
      number: dashboard?.admins?.length || 0,
    },
    {
      icon: <PiKeyReturnThin />,
      title: "Tutors",
      number: dashboard?.tutors?.length || 0,
    },
    {
      icon: <BsTruck />,
      title: "Student",
      number: dashboard?.students?.length || 0,
    },
    {
      icon: <AiOutlineTag />,
      title: "Contents",
      number: dashboard?.contents?.length || 0,
    },
    {
      icon: <BsClipboardMinus />,
      title: "Quizzes",
      number: dashboard?.quizzes?.length || 0,
    },
    {
      icon: <AiOutlineLineChart />,
      title: "Doubts",
      number: dashboard?.doubts?.length || 0,
    },
  ];



  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     return navigate("/");
  //   }
  // }, []);

  const timelineData = [
    { date: "2025-04-01", viewers: 10 },
    { date: "2025-04-02", viewers: 25 },
    { date: "2025-04-03", viewers: 40 },
    { date: "2025-04-04", viewers: 30 },
    { date: "2025-04-05", viewers: 55 },
  ];

  return (
    <div>
      <AdminNavbar>
        <div className="main">
          {/* Header */}
          {/* <Header Title={"Overview"} Address={"Default"} /> */}

          <Admin_home />

        </div>
      </AdminNavbar>
    </div>
  );
};

export default Dashboard;
