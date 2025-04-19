import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Achievement.css";

const Achievement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { students } = useSelector((store) => store.student);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Badge data with color assignments
  const badges = [
    { title: "Participation", percentage: 70, color: "#4e73df" }, // Blue
    { title: "Completion", percentage: 80, color: "#1cc88a" }, // Green
    { title: "Excellence", percentage: 90, color: "#36b9cc" }, // Teal
    { title: "Mastery", percentage: 100, color: "#f6c23e" }, // Yellow
    { title: "Consistency", percentage: 100, color: "#e74a3b" }, // Red
    { title: "Teamwork", percentage: 87.5, color: "#858796" }, // Gray
    { title: "Innovation", percentage: 100, color: "#5a5c69" }, // Dark Gray
  ];

  return (
    <Navbar>
      <div className="leaderboard">
        <Header Title={"Achievement"} Address={"Achievement"} />
      </div>

      <div className="achievement-container">
        <h2 className="section-title">Badges</h2>
        <div className="badges-grid">
          {badges.map((badge, index) => (
            <div 
              key={index} 
              className="badge-card"
              style={{ 
                borderTop: `5px solid ${badge.color}`,
                borderBottom: `5px solid ${badge.color}`
              }}
            >
              <div className="badge-content">
                <h3 className="badge-title" style={{ color: badge.color }}>
                  {badge.title}
                </h3>
                <div 
                  className="percentage-circle" 
                  style={{ 
                    background: `${badge.color}20`, // 20% opacity of main color
                    borderColor: badge.color,
                    color: badge.color
                  }}
                >
                  <span>{badge.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Navbar>
  );
};

export default Achievement;