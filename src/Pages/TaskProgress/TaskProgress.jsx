import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";

import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./TaskProgress.css";

import taskProgressData from "./TaskProgress.json";

const TaskProgress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      setCourses(taskProgressData);
      setSelectedCourse(taskProgressData[0]?.courseName || "");
    }
  }, [isAuthenticated, navigate]);

  const currentCourseData = courses.find(
    (course) => course.courseName === selectedCourse
  );

  return (
    <Navbar>
      <div className="leaderboard px-4">
        <Header Title={"Task Progress"} Address={"TaskProgress"} />

        <div className="d-flex justify-content-between align-items-center my-4">
          <h4 className="mb-0">Course: {selectedCourse}</h4>
          <select
            className="form-select w-auto"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courses.map((course) => (
              <option key={course.courseName} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Student</th>
                <th>Task</th>
                <th>Due Date</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {currentCourseData?.students?.map((student, idx) => {
                const percentage = Math.round(
                  (student.completed / student.total) * 100
                );
                return (
                  <tr key={idx}>
                    <td>{student.name}</td>
                    <td>{student.task}</td>
                    <td>{student.dueDate}</td>
                    <td>
                      <div className="progress" style={{ height: "20px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                        >
                          {student.completed}/{student.total}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!currentCourseData?.students?.length && (
                <tr>
                  <td colSpan="4">No task data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Navbar>
  );
};

export default TaskProgress;
