import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";

import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Forum.css";

import forumDataJson from "./forum.json"; // ⬅️ import the JSON directly

const Forum = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { students } = useSelector((store) => store.student);

  const [forumData, setForumData] = useState({ topics: [], recentThreads: [] });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Load static forum data
  useEffect(() => {
    setForumData(forumDataJson); // ⬅️ set imported JSON into state
  }, []);

  return (
    <Navbar>
      <div className="leaderboard">
        <Header Title={"Forum"} Address={"Forum"} />
      </div>

      <div className="leaderboardData px-4">
        <div className="container mt-4 forum-container">
          {/* Search and New Post */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search discussions..."
            />
            <button
              className="btn btn-primary"
              onClick={() => navigate("/forum/new-thread")}
            >
              + New Thread
            </button>
          </div>

          {/* Forum Topics */}
          <div className="forum-section mb-4">
            <h5 className="mb-3">Forum Topics</h5>
            <div className="list-group">
              {forumData.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => navigate(`/forum/topic/${topic.id}`)}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6>{topic.title}</h6>
                      <small>{topic.description}</small>
                    </div>
                    <span className="badge bg-secondary">
                      {topic.postCount} Posts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Threads */}
          <div className="forum-section">
            <h5 className="mb-3">Recent Threads</h5>
            <ul className="list-group">
              {forumData.recentThreads.map((thread, index) => (
                <li className="list-group-item" key={index}>
                  <strong>{thread.title}</strong> <br />
                  <small>Posted by {thread.author} • {thread.timeAgo}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default Forum;
