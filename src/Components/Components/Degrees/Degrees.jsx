// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Degrees.css";

// import { getAllDegrees } from "../../Admin/firebase/degreeApi";
// import imgd from "../Assets/Images/imagenotxt2.png";
// import LoadingPage from "../LoadingPage/LoadingPage";
// import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";

// const Degrees = () => {
//   const navigate = useNavigate();
//   const [degreesData, setDegreesData] = useState([]);
//   const [allCourses, setAllCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//     const [fetchError, setFetchError] = useState(false);
//     const [selectedFilters, setSelectedFilters] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getAllDegrees();
//         const allDegrees = response;
//         console.log(allDegrees);

//         // filtering purschased course
//         const userInfo = JSON.parse(localStorage.getItem("userdata"));
//         // console.log(userInfo);
//           if (userInfo) {
//             const purchasedDegreeIds = userInfo?.purchasedDegrees || [];
//           // Checking Degree if buyed
//           // if (purchasedDegreeIds.length > 0) {
//           //   // Filtering
//           //   const remainingDegrees = allDegrees.filter(
//           //     (Degree) => !purchasedCourseIds.includes(Degree.id)
//           //   );
//           //   setDegreesData(remainingDegrees);
//             // }
//             if (purchasedDegreeIds.length > 0) {
//               // Filtering
//               const remainingDegrees = allDegrees.filter(
//                 (Degree) => !purchasedDegreeIds.includes(Degree.id) // Fixed variable name
//               );
//               setDegreesData(remainingDegrees);
//             } else {
//               setDegreesData(allDegrees);
//             }
//         } else {
//           setFetchError(true);
//           alert("User not logged in, Go to Profile page");
//           console.log("No user info found in localStorage");
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.log(error);
//         setIsLoading(false);
//         setFetchError(true);
//       }
//     };
//     fetchData();
//   }, []);

//   // resolving image path
//   // const resolveImagePath = (imagePath) => {
//   //   if (
//   //     imagePath &&
//   //     (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
//   //   ) {
//   //     return imagePath;
//   //   } else if (imagePath && imagePath.startsWith("base64")) {
//   //     return imgd;
//   //   } else {
//   //     try {
//   //       return require(`../Assets/Images/${imagePath}`);
//   //     } catch (error) {
//   //       return imgd;
//   //     }
//   //   }
//   // };
//   const resolveImagePath = (imagePath) => {
//     if (typeof imagePath === "string") {
//       if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
//         return imagePath;
//       } else if (imagePath.startsWith("base64")) {
//         return imgd;
//       } else {
//         try {
//           return require(`../Assets/Images/${imagePath}`);
//         } catch (error) {
//           return imgd;
//         }
//       }
//     }
//     return imgd; // Fallback for non-string or invalid values
//   };

//   useEffect(() => {
//     const getAllCourses = () => {
//       let courses = [];
//       try {
//         degreesData.forEach((degree) => {
//           degree.courses.forEach((course) => {
//             if (!courses.includes(course.title)) {
//               courses.push(course.title);
//             }
//           });
//         });

//         // Random
//         for (let i = courses.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [courses[i], courses[j]] = [courses[j], courses[i]];
//         }
//       } catch (err) {
//         console.log(err);
//       }
//       return courses.slice(0, 10);
//     };
//     if (degreesData.length > 0) {
//       const courses = getAllCourses();
//       setAllCourses(courses);
//     }
//   }, [degreesData]);

//   const getCourseList = (courses) => {
//     const MAX_WORD_COUNT = 20;
//     let totalWords = 0;
//     let courseList = [];

//     for (let i = 0; i < courses?.length && i < 3; i++) {
//       const course = courses[i];
//       if (!course.title) continue;
//       const wordCount = course.courseTitle.split(" ").length;

//       if (totalWords + wordCount > MAX_WORD_COUNT) {
//         break;
//       }

//       totalWords += wordCount;
//       courseList.push(course);
//     }

//     return courseList;
//     };

//     const filterDegrees = (filters) => {
//       try {
//         if (filters.length === 0) {
//           return degreesData;
//         } else {
//           return degreesData.filter((course) =>
//             course.courses.some((course) => filters.includes(course.title))
//           );
//         }
//       } catch (err) {
//         console.log(err);
//         setFetchError(true);
//         return [];
//       }
//     };

//     const handleFilterClick = (filter) => {
//       if (selectedFilters.includes(filter)) {
//         setSelectedFilters(selectedFilters.filter((f) => f !== filter));
//       } else {
//         setSelectedFilters([...selectedFilters, filter]);
//       }
//     };

//      const clearFilters = () => {
//        setSelectedFilters([]);
//     };

//     //  const truncateDescription = (degree_description) => {
//     //    const words = degree_description.split(/\s+/);
//     //    const truncated = words.slice(0, 15).join(" ");
//     //    return truncated;
//     //  };

//     const truncateDescription = (description) => {
//       // Validate input to ensure it's a string
//       if (!description || typeof description !== "string") {
//         return ""; // Return empty string for invalid input
//       }

//       // Trim and split by whitespace
//       const words = description.trim().split(/\s+/);

//       // Check if truncation is needed
//       if (words.length <= 15) {
//         return description; // Return original if within limit
//       }

//       // Truncate and add ellipsis
//       return words.slice(0, 15).join(" ") + " ...";
//     };

//     if (isLoading) {
//       return (
//         <div>
//           <LoadingPage />
//         </div>
//       );
//     }

//   if (fetchError) {
//     return <ErrorDataFetchOverlay />;
//   }

//   return (
//     <>
//       <div className="main-content">
//         <div className="cardContainer3">
//           <h2>Degrees</h2>
//           <div className="filterChips">
//             {allCourses.map((course, index) => (
//               <div
//                 key={index}
//                 className={`filterChip ${
//                   selectedFilters.includes(course) ? "active" : ""
//                 }`}
//                 onClick={() => handleFilterClick(course)}
//               >
//                 {/* {course} */}
//                 {console.log(course)}
//               </div>
//             ))}
//             {selectedFilters.length > 0 && (
//               <button className="clearFilters" onClick={clearFilters}>
//                 Clear All
//               </button>
//             )}
//           </div>

//           <div className="courseContainer3">
//             {filterDegrees(selectedFilters).map((degree) => (
//               <div className="courseCard3" key={degree.id}>
//                 <div className="courseOverlay3">
//                   <div className="courseImageBox3">
//                     <img
//                       src={
//                         degree.thumbnail
//                           ? resolveImagePath(degree.thumbnail)
//                           : imgd
//                       }
//                       alt={degree.degreeTitle}
//                       className="courseImage3"
//                     />
//                     <div className="courseImageTxt3">{degree.degreeTitle}</div>
//                   </div>
//                   <div className="courseDetails3">
//                     <p>{truncateDescription(degree.description)}...</p>
//                     {/* {degree.description} */}
//                     <button className="courseDetailBtn3">View Details</button>
//                   </div>
//                 </div>
//                 <div className="courseLessonBox3">
//                   <h5>Courses</h5>
//                   <ul>
//                     {getCourseList(degree.courses).map((course, index) => {
//                       console.log();
//                       return <li key={index}>{course.courseTitle}</li>;
//                     })}

//                     {degree.courses?.length >
//                       getCourseList(degree.courses).length && (
//                       <li>...and more</li>
//                     )}
//                   </ul>
//                   <button
//                     onClick={() =>
//                       navigate(`/home/courseDetails/${degree._id}`)
//                     }
//                     className="lessonDetailBtn3"
//                   >
//                     View degree
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Degrees;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Degrees.css";

import { getAllDegrees } from "../../Admin/firebase/degreeApi";
import imgd from "../Assets/Images/imagenotxt2.png";
import LoadingPage from "../LoadingPage/LoadingPage";
import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";
import axios from "axios";

const Degrees = () => {
  const navigate = useNavigate();
  const [degreesData, setDegreesData] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const baseApi = process.env.REACT_APP_BASE_API;
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await getAllDegrees();
        const response = await axios.get(
          `/api/degree`
        );

        const allDegrees = response.data;

        // Retrieve user info from localStorage
        const userInfo = JSON.parse(localStorage.getItem("userdata"));

        if (userInfo) {
          const purchasedDegreeIds = userInfo?.purchasedDegrees || [];

          // Filter purchased degrees
          const remainingDegrees = allDegrees.filter(
            (degree) => !purchasedDegreeIds.includes(degree.id)
          );

          setDegreesData(remainingDegrees);
        } else {
          setFetchError(true);
          alert("User not logged in. Go to Profile page.");
          console.log("No user info found in localStorage");
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setFetchError(true);
      }
    };
    fetchData();
  }, []);

  // const resolveImagePath = (imagePath) => {
  //   if (
  //     imagePath &&
  //     (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
  //   ) {
  //     return imagePath;
  //   } else {
  //     return imgd; // Fallback to default image
  //   }
  // };

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

  useEffect(() => {
    const getAllCourses = () => {
      let courses = [];
      try {
        degreesData.forEach((degree) => {
          degree.courses.forEach((course) => {
            if (!courses.includes(course.courseTitle)) {
              courses.push(course.courseTitle);
            }
          });
        });

        // Shuffle courses randomly
        for (let i = courses.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [courses[i], courses[j]] = [courses[j], courses[i]];
        }
      } catch (err) {
        console.log(err);
      }
      return courses.slice(0, 10);
    };

    if (degreesData.length > 0) {
      const courses = getAllCourses();
      setAllCourses(courses);
    }
  }, [degreesData]);

  const getCourseList = (courses) => {
    const MAX_WORD_COUNT = 20;
    let totalWords = 0;
    let courseList = [];

    for (let i = 0; i < courses?.length && i < 3; i++) {
      const course = courses[i];
      if (!course || !course.courseTitle) continue;
      const wordCount = course.courseTitle.split(" ").length;

      if (totalWords + wordCount > MAX_WORD_COUNT) {
        break;
      }

      totalWords += wordCount;
      courseList.push(course);
    }

    return courseList;
  };

  const filterDegrees = (filters) => {
    if (filters.length === 0) {
      return degreesData;
    } else {
      return degreesData.filter((degree) =>
        degree.courses.some((course) => filters.includes(course.courseTitle))
      );
    }
  };

  const handleFilterClick = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
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

  if (isLoading) {
    return <LoadingPage />;
  }

  if (fetchError) {
    return <ErrorDataFetchOverlay />;
  }

  return (
    <>
      <div className="main-content">
        <div className="cardContainer3">
          <h2>Degrees</h2>
          <div className="filterChips">
            {allCourses.map((course, index) => (
              <div
                key={index}
                className={`filterChip ${
                  selectedFilters.includes(course) ? "active" : ""
                }`}
                onClick={() => handleFilterClick(course)}
              >
                {course}
              </div>
            ))}
            {selectedFilters.length > 0 && (
              <button className="clearFilters" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="courseContainer3">
            {filterDegrees(selectedFilters).map((degree) => (
              <div className="courseCard3" key={degree.id}>
                <div className="courseOverlay3">
                  <div className="courseImageBox3">
                    {/* <img
                      src={resolveImagePath(degree.thumbnail?.url)}
                      alt={degree.degreeTitle}
                      className="courseImage3"
                    /> */}
                    <img
                      src={degree.thumbnail || imgd}
                      alt={degree.degreeTitle}
                      className="courseImage3"
                    />
                    <div className="courseImageTxt3">{degree.degreeTitle}</div>
                  </div>
                  <div className="courseDetails3">
                    <p>{truncateDescription(degree.description)}</p>
                    <button className="courseDetailBtn3">View Details</button>
                  </div>
                </div>
                <div className="courseLessonBox3">
                  <h5>Lessons</h5>
                  <ul>
                    {getCourseList(degree.courses).map((course, index) => (
                      <li key={index}>{course.courseTitle}</li>
                    ))}
                    {degree.courses?.length >
                      getCourseList(degree.courses).length && (
                      <li>...and more</li>
                    )}
                  </ul>
                  <button
                    onClick={() =>
                      navigate(`/home/degrees/${degree.degreeId}`, {
                        state: degree,
                      })
                    }
                    className="lessonDetailBtn3"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Degrees;
