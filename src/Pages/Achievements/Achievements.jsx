import { useEffect, useState } from "react";
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import "./Achievements.css";

const mockAchievements = [
  {
    id: 1,
    title: "Assignment Champion",
    description: "First to complete 10 assignments",
    badge: "gold",
    date: "2025-04-29",
    category: "assignments"
  },
  {
    id: 2,
    title: "Assignment Runner-up",
    description: "Second to complete 10 assignments",
    badge: "silver",
    date: "2025-04-28",
    category: "assignments"
  },
  {
    id: 3,
    title: "Assignment Finalist",
    description: "Third to complete 10 assignments",
    badge: "bronze",
    date: "2025-04-27",
    category: "assignments"
  },
  {
    id: 4,
    title: "Research Star",
    description: "Top performer in research internship",
    badge: "gold",
    date: "2025-04-20",
    category: "research"
  },
  {
    id: 5,
    title: "Research Scholar",
    description: "Second best in research internship",
    badge: "silver",
    date: "2025-04-19",
    category: "research"
  },
  {
    id: 6,
    title: "Consistent Participant",
    description: "Completed all weekly quizzes for a month",
    badge: "bronze",
    date: "2025-03-30",
    category: "participation"
  },
];

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Replace with API call if needed
    setAchievements(mockAchievements);
  }, []);

  const getBadgeEmoji = (badge) => {
    switch (badge) {
      case "gold":
        return "🥇";
      case "silver":
        return "🥈";
      case "bronze":
        return "🥉";
      default:
        return "🏅";
    }
  };

  const filteredAchievements = filter === "all" 
    ? achievements 
    : achievements.filter(item => item.category === filter);

  const achievementCategories = [
    { value: "all", label: "All Achievements" },
    { value: "assignments", label: "Assignments" },
    { value: "research", label: "Research" },
    { value: "participation", label: "Participation" }
  ];

  return (
    <Navbar>
      <div className="achievements-page">
        <Header Title="My Achievements" Address="User > Achievements" />

        <div className="achievements-container">
          <div className="achievements-header">
            <h2 className="section-title">Your Achievements</h2>
            <select 
              className="achievement-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {achievementCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {filteredAchievements.length === 0 ? (
            <div className="no-achievements">
              <p>No achievements found in this category.</p>
            </div>
          ) : (
            <div className="achievements-grid">
              {filteredAchievements.map((item) => (
                <div className={`achievement-card ${item.badge}`} key={item.id}>
                  <div className="badge-icon">{getBadgeEmoji(item.badge)}</div>
                  <div className="achievement-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="achievement-footer">
                      <span className="achievement-date">
                        🏆 Earned on {item.date}
                      </span>
                      <span className="achievement-category">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Achievements;