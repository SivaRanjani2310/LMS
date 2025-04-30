import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";

import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./MyTask.css";

const MyTask = () => {
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

  return (
    <Navbar>
      {/* Header */}
      <div className="leaderboard">
        <Header Title={"My Task"} Address={"My Task"} />
      </div>

      <div className="leaderboardData px-4">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h5 className="fw-bold">Active Courses (6)</h5>
    <div className="search-box">
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        style={{ maxWidth: "250px" }}
      />
    </div>
  </div>

  <div className="row g-3">
    {[
      "Content Writer Team",
      "Course Development Team",
      "Legal internship",
      "Guest Lecture",
      "Mock Interview",
      "Research Group",
    ].map((title, index) => (
      <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={index}>
        <div className="card custom-card h-100">
          <div className="card-img-top bg-light rounded-top" style={{ height: "100px" }}>
            {/* You can insert an <img src="..." /> here instead */}
          </div>
          <div className="card-body text-center p-2">
            <p className="mb-1 fw-medium">{title}</p>
            {title === "Guest Lecture" && (
              <div className="progress" style={{ height: "5px" }}>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: "0%" }}
                  aria-valuenow="0"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


    </Navbar>
  );
};

export default MyTask;
