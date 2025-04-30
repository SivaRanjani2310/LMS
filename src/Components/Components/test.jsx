import { useEffect, useState } from "react";
import "./Rough.css";
import courseDataJson from "../Components/Enrolled/sampleEnrolledData.json";
import { Lock, Unlock } from "lucide-react";

export default function Rough() {
  const [course, setCourse] = useState(null); // Initialize as null

  useEffect(() => {
    const processCoursesData = () => {
      const degreeData = courseDataJson.map((degree) => degree.courses).flat(); // Flatten nested courses
      if (degreeData.length > 0) {
        setCourse(degreeData[0]); // Set the first course
      }
    };
    processCoursesData();
  }, []);

  if (!course) {
    return <p>Loading...</p>; // Fallback UI while data is being processed
  }

  // Check if the course is completed
  const isCompleted = false;

  return (
    <div className="zion-courses-wrapper">
      <div className="zion-card">
        <div className="zion-course-card">
          <img src={course.thumbnail} alt={course.title} />
          <div className="zion-course-content">
            <h3 className="zion-course-title">{course.title}</h3>
            <p className="zion-course-description">{course.description}</p>
            <button
              className={`btn zion-btn ${
                isCompleted ? "btn-success" : "btn-danger"
              }`}
            >
              {isCompleted ? <Unlock /> : <Lock />}
              {isCompleted ? " Unlock" : " Locked"}
            </button>
          </div>
        </div>
      </div>
      <div className="zion-card">
        <div className="zion-course-card">
          <img src={course.thumbnail} alt={course.title} />
          <div className="zion-course-content">
            <h3 className="zion-course-title">{course.title}</h3>
            <p className="zion-course-description">{course.description}</p>
            <button
              className={`btn zion-btn ${
                isCompleted ? "btn-success" : "btn-danger"
              }`}
            >
              {isCompleted ? <Unlock /> : <Lock />}
              {isCompleted ? " Unlock" : " Locked"}
            </button>
          </div>
        </div>
      </div>
      <div className="zion-card">
        <div className="zion-course-card">
          <img src={course.thumbnail} alt={course.title} />
          <div className="zion-course-content">
            <h3 className="zion-course-title">{course.title}</h3>
            <p className="zion-course-description">{course.description}</p>
            <button
              className={`btn zion-btn ${
                isCompleted ? "btn-success" : "btn-danger"
              }`}
            >
              {isCompleted ? <Unlock /> : <Lock />}
              {isCompleted ? " Unlock" : " Locked"}
            </button>
          </div>
        </div>
      </div>
      <div className="zion-card">
        <div className="zion-course-card">
          <img src={course.thumbnail} alt={course.title} />
          <div className="zion-course-content">
            <h3 className="zion-course-title">{course.title}</h3>
            <p className="zion-course-description">{course.description}</p>
            <button
              className={`btn zion-btn ${
                isCompleted ? "btn-success" : "btn-danger"
              }`}
            >
              {isCompleted ? <Unlock /> : <Lock />}
              {isCompleted ? " Unlock" : " Locked"}
            </button>
          </div>
        </div>
      </div>
      <div className="zion-card">
        <div className="zion-course-card">
          <img src={course.thumbnail} alt={course.title} />
          <div className="zion-course-content">
            <h3 className="zion-course-title">{course.title}</h3>
            <p className="zion-course-description">{course.description}</p>
            <button
              className={`btn zion-btn ${
                isCompleted ? "btn-success" : "btn-danger"
              }`}
            >
              {isCompleted ? <Unlock /> : <Lock />}
              {isCompleted ? " Unlock" : " Locked"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
