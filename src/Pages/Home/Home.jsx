import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../Redux/dashboard/action";

// Component imports
import Navbar from "../../Components/Sidebar/Navbar";
import SalesDiv from "../../Components/SalesDiv/SalesDiv";
import Header from "../../Components/Header/Header";

// Icons
import { PiKeyReturnThin } from "react-icons/pi";
import { FiShoppingCart } from "react-icons/fi";
import { BsTruck, BsClipboardMinus } from "react-icons/bs";
import { AiOutlineTag, AiOutlineLineChart } from "react-icons/ai";

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
import "./Home.css";
import demo from "../../Assets/cartoon.svg";

// Sample data
import { pieData, COLORS } from "../../data.js";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);

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

  useEffect(() => {
    dispatch(getDashboardData());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/");
    }
  }, []);

  const timelineData = [
    { date: "2025-04-01", viewers: 10 },
    { date: "2025-04-02", viewers: 25 },
    { date: "2025-04-03", viewers: 40 },
    { date: "2025-04-04", viewers: 30 },
    { date: "2025-04-05", viewers: 55 },
  ];

  return (
    <div>
      <Navbar>
        <div className="main">
          {/* Header */}
          <Header Title={"Overview"} Address={"Default"} />

          {/* Overview Section */}
          <div className="overview">
            <div className="overview-left">
              <div>
                <h2>Welcome to LMS</h2>
                <p>Here's what's happening in your account today</p>
              </div>
              <div>
                <button>What's New!</button>
              </div>
              <img src={demo} alt="welcome" />
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts">
            {/* Line Chart */}
            <div className="lineChart">
              <div className="chartHead">
                <p>Video Watch Timeline</p>
              </div>
              <div className="chartBox">
                <div className="chartOne">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="viewers"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pie & Doughnut Charts */}
            <div className="pieCharts">
             
              {/* Doughnut Chart */}
              <div className="chartContainer">
                <h4>Users Overview (Doughnut)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="homeFooter">
            Copyright 2024 © Learning Management System
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Home;
