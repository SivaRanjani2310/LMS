import React, { useState, useEffect } from "react";
import "./CourseDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";
import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";
import { Tab, Tabs, Accordion } from "react-bootstrap";
import imgd from "../Assets/Images/imagenotxt2.png";
import PaymentSuccess from "../PaymentSuccess/PaymentSuccess";
import { addCourseToUser } from "../../Admin/firebase/userApi";
import axios from "axios";

const CourseDetails = () => {
  const location = useLocation();
  const { course, degreeid } = location.state || {};
  console.log(course, degreeid);

  const coursedetails = course;
  const navigate = useNavigate();

  const userDataString = localStorage.getItem("userdata");
  const userData = JSON.parse(userDataString);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [fetchError, setFetchError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [courseContentDetailsData, setCourseContentDetailsData] = useState({});
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    setCourseContentDetailsData(coursedetails);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [coursedetails]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const makepayment = async (courseTitle, courseId, userId, degreeid) => {
    if (localStorage.getItem("isloggedin") === "true") {
      try {
        const existingData = localStorage.getItem("updatecourse");
        const updatecourseData = existingData ? JSON.parse(existingData) : [];

        if (
          updatecourseData.some(
            (entry) => entry.userId === userId && entry.courseId === courseId
          )
        ) {
          alert("You have already purchased this course.");
          setIsPurchased(true);
          return;
        }
        const degreeId = degreeid;
        // await addCourseToUser(userId, courseId, courseTitle, degreeId);
        const res = await axios.post(`/api/user/${userId}/add-course`, {
          courseId,
          courseTitle,
        });
        console.log(res);

        const newEntry = { userId, courseId, degreeId, courseTitle };
        updatecourseData.push(newEntry);
        localStorage.setItem("updatecourse", JSON.stringify(updatecourseData));

        console.log("Course successfully purchased:", newEntry);
        setPaymentSuccess(true);
      } catch (error) {
        console.error("Error during course payment:", error);
      }
    } else {
      navigate("/");
    }
  };

  const handleLessonClick = (index) => {
    setActiveLesson(index === activeLesson ? null : index);
  };

  if (isLoading) {
    return <LoadingPage message="Loading course details, please wait..." />;
  }

  if (fetchError) {
    return (
      <ErrorDataFetchOverlay message="Failed to load course details. Please try again later." />
    );
  }

  return (
    <>
      {paymentSuccess && (
        <PaymentSuccess
          userName={userData.name}
          courseId={courseContentDetailsData.courseId}
          price={courseContentDetailsData.price}
          courseTitle={courseContentDetailsData.title}
          degreeid={degreeid}
        />
      )}
      <div className="courseDetailsBox">
        <div
          className="row CDHeader g-0"
          style={{
            backgroundImage: `url(${coursedetails.thumbnail || imgd})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="row CDBody g-0">
          <div className="CDMHS">
            <div className="CDtabBox">
              <Tabs
                id="course-content-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                role="tablist"
              >
                <Tab
                  eventKey="description"
                  title="Description"
                  aria-label="Course Description"
                >
                  <h4>{coursedetails.courseTitle || "Course Title"}</h4>
                  <p>
                    {isExpanded
                      ? coursedetails?.description ||
                        "No description available."
                      : coursedetails?.description
                          ?.split("\n")
                          .slice(0, 1)
                          .join(" ") || "No description available."}

                    {coursedetails?.description?.split("\n").length > 1 && (
                      <span
                        className="read-more-link text-primary px-1"
                        onClick={toggleDescription}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </span>
                    )}
                  </p>
                  <h4>What you will gain after completion of the course</h4>
                  <div className="CDOverviewPills">
                    {coursedetails?.overviewPoints?.length > 0 ? (
                      coursedetails.overviewPoints.map((point, index) => (
                        <span key={index} className="overview-button">
                          {point?.heading || "No heading available"}
                        </span>
                      ))
                    ) : (
                      <p>No overview points available.</p>
                    )}
                  </div>
                </Tab>
                <Tab
                  eventKey="chapters"
                  title="Chapters"
                  aria-label="Course Chapters"
                >
                  <Accordion
                    activeKey={activeLesson}
                    onSelect={handleLessonClick}
                  >
                    {coursedetails?.chapters?.length > 0 ? (
                      coursedetails.chapters.map((chapter, index) => (
                        <Accordion.Item
                          key={chapter?.id || index}
                          eventKey={index}
                        >
                          <Accordion.Header>
                            <div className="CDlesson-meta">
                              <div className="CDlesson-title">
                                {index + 1}.{" "}
                                {chapter?.title || "Untitled Chapter"}
                              </div>
                              <span>
                                Total Content: {chapter?.lessons?.length || 0}
                              </span>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <ul className="list-group">
                              {chapter?.lessons?.map((lesson, lessonIndex) => (
                                <li
                                  key={lessonIndex}
                                  className="list-group-item"
                                >
                                  <span className="video-number">
                                    {lessonIndex + 1}.{" "}
                                    {lesson?.title || "Untitled Lesson"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))
                    ) : (
                      <p>No chapters available for this course yet.</p>
                    )}
                  </Accordion>
                </Tab>
              </Tabs>
            </div>
          </div>
          <div className="CDRHS">
            <div className="CDPriceBox">
              <h3>₹ {coursedetails?.price || "Free"}</h3>
              {coursedetails?.price && (
                <div className="CDOffer">
                  <div className="CDStrike">
                    ₹ {coursedetails?.price * 2 || "N/A"}
                  </div>
                  <span>50% Off</span>
                </div>
              )}
              <button
                className="CDBuyBtn"
                onClick={() =>
                  makepayment(
                    courseContentDetailsData.courseTitle,
                    courseContentDetailsData.courseId,
                    userData.id,
                    degreeid
                  )
                }
                disabled={isPurchased}
              >
                {isPurchased ? "Purchased" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
