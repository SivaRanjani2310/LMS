import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";

import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./TaskReport.css";

import coursesData from "./TaskReportData.json";

const TaskReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      setCourses(coursesData);
    }
  }, [isAuthenticated, navigate]);

  return (
    <Navbar>
      <div className="leaderboard px-4">
        <Header Title={"TaskReport"} Address={"Task Report"} />

        <div className="card my-4">
          <div className="card-body">
            <h4 className="mb-4">Course-wise Marks</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Course Name</th>
                    <th>Total Marks</th>
                    <th>Lessons</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.courseTitle}>
                      <td>{course.courseTitle}</td>
                      <td>{course.totalMarks}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedCourse(course)}
                        >
                          View Lessons
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedCourse && (
  <>
    <div className="custom-modal-backdrop"></div>
    <div className="custom-modal-wrapper">
      <div className="modal-content shadow-lg">
        <div className="modal-header">
          <h5 className="modal-title">Lessons for {selectedCourse.courseTitle}</h5>
        
        </div>
        <div className="modal-body">
          <p><strong>Total Marks:</strong> {selectedCourse.totalMarks}</p>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Lesson Title</th>
                  <th>Lesson Marks</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.lessons.map((lesson) => (
                  <tr key={lesson.lessonId}>
                    <td>{lesson.lessonTitle}</td>
                    <td>{lesson.lessonMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setSelectedCourse(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </>
)}

      </div>
    </Navbar>
  );
};

export default TaskReport;
