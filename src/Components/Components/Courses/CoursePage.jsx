import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CoursePage.css";
import imgd from "../Assets/Images/imagenotxt2.png";

const CoursePage = () => {
  const {degreeid} = useParams()
  const location = useLocation();
  const navigate = useNavigate();
  const courseData = location.state;
  console.log(degreeid);

  if (!courseData) {
    return <div>No course data available</div>;
  }

  const resolveImagePath = (imagePath) => {
    if (typeof imagePath === "string") {
      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
      } else if (imagePath.startsWith("base64")) {
        return imgd;
      } else {
        try {
          return require(`../Assets/Images/${imagePath}`);
        } catch (error) {
          return imgd;
        }
      }
    }
    return imgd; // Fallback for non-string or invalid values
  };

  const truncateDescription = (description) => {
    if (!description || typeof description !== "string") {
      return "";
    }
    const words = description.trim().split(/\s+/);
    if (words.length <= 15) {
      return description;
    }
    return words.slice(0, 15).join(" ") + " ...";
  };
console.log("Thumbnail URL:", courseData.thumbnail);
  return (
    <>
      <div className="main-content">
        <div className="courseDetailsBox">
          <div
            className="row CDHeader g-0"
            style={{
              backgroundImage: `url(${courseData.thumbnail || imgd})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* <img src={courseData.thumbnail || imgd} alt="" /> */}
            {/* <div className="CDHeaderIntroVideo">
              <div className="embed-responsive-16by9">
                klkdjsf
              </div>
            </div> */}
          </div>
          <div className="row CDBody g-0">
            <div className="cardContainer3">
              {/* <h2>{courseData.degreeTitle}</h2> */}
              <div className="filterChips">
                <h2>Courses</h2>
              </div>

              <div className="courseContainer3">
                {courseData.courses.map((course) => (
                  <div className="courseCard3" key={course.courseId}>
                    <div className="courseOverlay3">
                      <div className="courseImageBox3">
                        <img
                          // src={resolveImagePath(course.thumbnail?.url)}
                          src={course.thumbnail || imgd}
                          alt={course.courseTitle}
                          className="courseImage3"
                        />
                        <div className="courseImageTxt3">
                          {course.courseTitle}
                        </div>
                      </div>
                      <div className="courseDetails3">
                        <p>{truncateDescription(course.description)}</p>
                        <button className="courseDetailBtn3">
                          View Details
                        </button>
                      </div>
                    </div>
                    {/* {course.courseTitle} */}
                    <div className="courseLessonBox3">
                      <h5>Lessons</h5>
                      <ul>
                        {/* {getCourseList(degree.courses).map((course, index) => (
                      <li key={index}>{course.courseTitle}</li>
                    ))} */}
                        {/* {degree.courses?.length >
                      getCourseList(degree.courses).length && (
                      <li>...and more</li>
                      )} */}
                        {/* {course.chapters()} */}
                      </ul>
                      <button
                        onClick={() =>
                          navigate(
                            `/home/degrees/courseDetails/${course.courseId}`,
                            {
                              state:{ course,degreeid }
                              
                            }
                          )
                        }
                        className="lessonDetailBtn3"
                      >
                        View Course Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div>
    //   <p>{courseData.description}</p>
    //   <h3>Courses:</h3>
    //   <ul>
    //   </ul>
    // </div>
  );
};

export default CoursePage;
