import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";

import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Announcement.css";

import announcementData from "./Announcement.json"; // ✅ Local import

const Announcement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { students } = useSelector((store) => store.student);

  const [announcements, setAnnouncements] = useState([]);



  useEffect(() => {
    setAnnouncements(announcementData); // ✅ Set from imported data
  }, []);

  const getBadgeClass = (type) => {
    switch (type) {
      case "New":
        return "bg-success";
      case "Alert":
        return "bg-warning text-dark";
      case "Event":
        return "bg-info text-white";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Navbar>
      <div className="leaderboard">
        <Header Title={"Announcement"} Address={"Announcement"} />
      </div>

      <div className="leaderboardData px-4">
        <h5 className="mb-4 mt-3">Latest Announcements</h5>

        {announcements.map((item, idx) => (
          <div key={idx} className="announcement-card mb-3 p-3 shadow-sm border rounded">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-1">{item.title}</h6>
              <span className={`badge ${getBadgeClass(item.type)}`}>{item.type}</span>
            </div>
            <p className="mb-1 text-muted">{item.description}</p>
            <small className="text-secondary">Posted by {item.postedBy} • {item.date}</small>
          </div>
        ))}
      </div>
    </Navbar>
  );
};

export default Announcement;
