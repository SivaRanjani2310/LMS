




import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../Degrees/Degrees.css";
import "./Enrolled.css"
import { useNavigate } from "react-router-dom";
import imgd from "../Assets/Images/imagenotxt2.png";
import LoadingPage from "../LoadingPage/LoadingPage";
import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";
// import courseDataJson from "../Assets/Data/CourseList.json";
import courseDataJson from "./sampleEnrolledData.json";
import { getEnrolledCourses } from "../../Admin/firebase/userApi";
import { getCourseById } from "../../Admin/firebase/degreeApi";
import axios from "axios";
import { Lock, Unlock } from "lucide-react";
const Enrolled = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [allLessons, setAllLessons] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [hasPurchasedCourses, setHasPurchasedCourses] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userdata"));
  const userId = userInfo.id;

   const apiBaseUrl = process.env.REACT_APP_BASE_API;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const LoginUser = JSON.parse(localStorage.getItem("userdata")); // Retrieve logged-in user from localStorage
        // if (!LoginUser) {
        //   console.error("LoginUser is not found in localStorage.");
        //   return;
        // }
        console.log(LoginUser);

        // const userData = await axios.get(`/api/users/${LoginUser.id}`); // Fetch users data from the API
        // const { user } = userData.data;
        // const userDegree = user.applyingFor;
        // console.log(userDegree.degreeId);

        
        const degreeData = await axios.get(
          `${apiBaseUrl}/api/degrees/${LoginUser.applyingFor}`
        );
        const degree = degreeData.data.degree;
        console.log(degree);
        setIsLoading(false)
        setFetchError(false)
        setCoursesData(degree.courses);
        
        // You can save or set the degree details here if needed
        // For example, if you're using React state:
        // setCurrentDegree(CurrentDegree);
      } catch (error) {
        setIsLoading(false)
        setFetchError(false)
        console.error("Error fetching user or degree:", error);
      }
    };

    fetchUser();
  }, []);


  const resolveImagePath = (imagePath) => {
    if (
      imagePath &&
      (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    ) {
      return imagePath;
    }
    // else if (imagePath && imagePath.startsWith("base64")) {
    //   return imgd;
    // }
    else {
      try {
        return require(`../Assets/Images/${imagePath}`);
      } catch (error) {
        return imgd;
      }
    }
  };

  

 
  const truncateDescription = (description) => {
    const words = description.split(" ");
    const truncated = words.slice(0, 15).join(" ");
    return truncated;
  };

  

    const isCompleted = true;

  return (
    <>
      <div className="main-content">
        <div className="cardContainer3">
          <h2>Enrolled Courses</h2>
          {!coursesData && (
            <h3>No courses have been purchased. Please purchase a course.</h3>
          )}

          
          <div className="courseContainer3">
            
            

            {coursesData.map((course) => {
              return (
                <div className="" key={course._id}>
                  <div className="zion-card">
                    <div className="zion-course-card">
                      <img
                        src={course.thumbnail ? course.thumbnail : imgd}
                        alt={course.title}
                      />
                      <div className="zion-course-content">
                        <h3 className="zion-course-title">{course.title}</h3>
                        <p className="zion-course-description">
                          {truncateDescription(course.description)}
                          {/* {course.description} */}
                        </p>
                        {/* <ul>
                          {course?.chapters
                            ?.slice(0, 3)
                            .map((chapter, index) => (
                              <li key={index}>{chapter.title}</li>
                            ))}
                          {course?.chapters?.length > 3 && <li>...and more</li>}
                        </ul> */}
                        <div className="">
                          {/* <button
                            className="btn btn-primary"
                            onClick={() =>
                              navigate(`/home/courseContent/${course.id}`, {
                                state: course,
                              })
                            }
                          ></button> */}
                          <button
                            className={`btn ${
                              isCompleted ? "btn-success" : "btn-danger"
                            }`}
                            onClick={() =>
                              navigate(`/home/courseContent/${course.courseId}`, {
                                state: course,
                              })
                            }
                          >
                            {isCompleted ? <Unlock /> : <Lock />}
                            {isCompleted ? " Unlock" : " Locked"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Enrolled;
