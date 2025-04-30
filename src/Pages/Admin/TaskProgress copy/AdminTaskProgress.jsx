import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../../../Components/Sidebar/Navbar";
import Header from "../../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./AdminTaskProgress.css";

import taskProgressData from "././TaskProgress.json";

const AdminTaskProgress = () => {
  const navigate = useNavigate();
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
    setCourses(taskProgressData);
    if (taskProgressData.length > 0) {
      setSelectedCourse(taskProgressData[0].courseName);
    }
  }, [isAuthenticated]);

  const currentCourseData = courses.find(
    (course) => course.courseName === selectedCourse
  );

  return (
    <Navbar>
      <div className="admin-task px-4">
        <Header Title={"Admin Task Progress"} Address={"Admin > Task Progress"} />

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
          <table className="table table-hover table-bordered text-center">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Task</th>
                <th>Due Date</th>
                <th>Completed</th>
                <th>Total</th>
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
                    <td>{idx + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.task}</td>
                    <td>{student.dueDate}</td>
                    <td>{student.completed}</td>
                    <td>{student.total}</td>
                    <td>
                      <div className="progress" style={{ height: "20px" }}>
                        <div
                          className={`progress-bar ${percentage === 100 ? "bg-success" : "bg-info"}`}
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!currentCourseData?.students?.length && (
                <tr>
                  <td colSpan="7">No data available for this course</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Navbar>
  );
};

export default AdminTaskProgress;
