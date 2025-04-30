import React from "react";
import "./CourseContent.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import tick from "../Assets/SVG/tick.svg";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_BASE_API;

const CourseContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState({});
  const [userId, setUserId] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCourseData, setCurrentCourseData] = useState({});
  const [activeAccordion, setActiveAccordion] = useState(null);

  // These indices indicate the current chapter, lesson and sub-lesson
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSubLessonIndex, setCurrentSubLessonIndex] = useState(0);

  const [degreeProgress, setDegreeProgress] = useState([null]);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progressPercentage, setProgressPercentage] = useState();

  const courseDetails = location.state;
  console.log("Course Details", courseDetails);
  const userInfo = JSON.parse(localStorage.getItem("userdata"));

  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [completedSublessons, setCompletedSublessons] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCourseData(courseDetails);
        if (userInfo) {
          const userId = userInfo._id;
          setUserId(userId);
        } else {
          setFetchError(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setIsLoading(false);
        setFetchError(true);
      }
    };
    fetchData();

    const fetchvideo = async () => {
      try {
        const res = await axios.get(
          `${apiBaseUrl}/api/users/progress/${userInfo._id}/${userInfo.applyingFor}`
        );
        const data = res.data.degreeProgress;
        console.log("Degree Progress", data);
        setDegreeProgress(data);
        const completed = new Set();
        let totalChapterProgress = 0;
        let totalChapters = 0;
        data.courses.forEach((course) => {
          course.chapters.forEach((chapter) => {
            setProgressPercentage(course.progressPercentage);
            chapter.lessons.forEach((lesson) => {
              lesson.subLessons.forEach((subLesson) => {
                if (subLesson.isComplete) {
                  completed.add(
                    `${chapter.chapterId}-${lesson.lessonId}-${subLesson.subLessonId}`
                  );
                }
              });
            });
          });
        });
        const averageProgress =
          totalChapters > 0 ? totalChapterProgress / totalChapters : 0;
        // setProgressPercentage(averageProgress);
        setCompletedExercises(completed);
        console.log("Completed Lessons", completed);
        console.log("Average Chapter Progress", averageProgress);
      } catch (error) {
        console.error("Error fetching video progress:", error);
      }
    };

    fetchvideo();
  }, []);

  const handleCurrentContent = async (
    data,
    chapterId,
    lessonId,
    subLessonId
  ) => {
    console.log("Current Content", data, chapterId, courseId, subLessonId);
    const modifiedData = {
      ...data,
      exerciseNo: subLessonId,
      lessonNo: lessonId,
      chapterNo: chapterId,
      type: data.fileType,
      link: data.file,
    };
    setCurrentCourseData(modifiedData);
    setCurrentChapterIndex(chapterId);
    setCurrentLessonIndex(lessonId);
    setCurrentSubLessonIndex(subLessonId);
    // Open the corresponding chapter in the side dropdown.
    setActiveAccordion(courseData.chapters[chapterId]?.chapterId);
  };

  // Renders video/audio/PDF/PPT content based on file type.
  const renderContent = (
    link,
    typeManual,
    data,
    lessonIndex,
    exerciseIndex,
    chapterIndex
  ) => {
    if (typeManual === "video/mp4") {
      return (
        <>
          <div className="embed-responsive-item">
            <video
              controls
              onEnded={() => {
                handleMediaEnd(data, lessonIndex, exerciseIndex, chapterIndex);
              }}
              style={{ maxWidth: "100%", width: "100%", borderRadius: "1em" }}
            >
              <source src={link ? `${link}` : "/test.mp4"} type="video/mp4" />
            </video>
          </div>
        </>
      );
    } else if (typeManual === "audio/mpeg") {
      return (
        <>
          <div className="embed-responsive-item">
            <img
              src={courseData.thumbnail}
              alt=""
              style={{
                maxWidth: "100%",
                display: "block",
                width: "100%",
                height: "400px",
                objectFit: "fill",
                borderRadius: "1em",
              }}
            />
            <audio
              controls
              style={{ width: "100%", marginTop: "1em" }}
              onEnded={() => {
                handleMediaEnd({ title: `${data?.title} `}, lessonIndex, exerciseIndex);
              }}
            >
              <source src={link} type="audio/mp3" />
            </audio>
          </div>
        </>
      );
    } else if (typeManual === "application/pdf") {
      return (
        <>
          <div className="embed-responsive-item">
            <object
              data={`${link}#view=FitH`}
              type="application/pdf"
              height={500}
              width={"100%"}
              style={{ height: "400px", borderRadius: "1em" }}
            ></object>
          </div>
          <div className="MarkAsCompleted">
            <button
              className="NextBtn"
              onClick={() => handleMediaEnd(data, lessonIndex, exerciseIndex)}
            >
              {" "}
              Mark as Completed
            </button>
          </div>
        </>
      );
    } else if (
      typeManual ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const officeEmbedUrl = "https://view.officeapps.live.com/op/view.aspx?src=${link}";
      return (
        <>
          <div className="embed-responsive-item">
            <iframe
              title="PPT Viewer"
              src={officeEmbedUrl}
              style={{ width: "100%", height: "500px", border: "none" }}
              allow="autoplay; encrypted-media"
              onError={(e) => {
                e.target.src = officeEmbedUrl;
              }}
            />
            <div className="MarkAsCompleted">
              <button
                className="NextBtn"
                onClick={() => handleMediaEnd(data, lessonIndex, exerciseIndex)}
              >
                {" "}
                Mark as Completed
              </button>
            </div>
          </div>
        </>
      );
    }
  };

  const handleMediaEnd = async () => {
    if (
      currentChapterIndex === null ||
      currentLessonIndex === null ||
      currentSubLessonIndex === null
    ) {
      console.error("Invalid indices for chapter or lesson.");
      return;
    }
    try {
      const exerciseKey = `${currentChapterIndex}-${currentLessonIndex}-${currentSubLessonIndex}`;
      const currentChapter = courseData?.chapters?.find(
        (chapter) => chapter.chapterId === currentChapterIndex
      );
      const currentLesson = currentChapter?.lessons?.find(
        (lesson) => lesson.lessonId === currentLessonIndex
      );
      const currentSublesson = currentLesson?.subLessons?.find(
        (sublesson) => sublesson.subLessonId === currentSubLessonIndex
      );
      if (!currentChapter || !currentLesson || !currentSublesson) {
        console.error("Chapter or Lesson data not found:", {
          currentChapterIndex,
          currentLessonIndex,
          currentSubLessonIndex,
        });
        return;
      }
      setCompletedExercises((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.add(exerciseKey);
        return updatedSet;
      });
      console.log(`Marked lesson completed: ${currentSublesson.title}`);
      await progress_data(currentLessonIndex, currentChapterIndex, currentSubLessonIndex);
    } catch (error) {
      console.error("Error in handleMediaEnd:", error);
    }
  };

  const progress_data = async (lessonIndex, chapterIndex, subLessonIndex) => {
    console.log("Progress Data:", lessonIndex, chapterIndex, subLessonIndex);
    const totalExercises = degreeProgress.courses?.reduce(
      (total, chapter) => total + chapter.lessons?.length,
      0
    );
    const progress_percentage =
      totalExercises > 0
        ? (completedExercises.size / totalExercises) * 100
        : 0;
    const watchedPercentage = progress_percentage;
    if (!userId || !courseId || watchedPercentage == null) {
      console.error("Missing required data for API request.");
      return;
    }
    try {
      const endpoint = `${apiBaseUrl}/api/users/progress`;
      const payload = {
        userId,
        degreeId: userInfo.applyingFor,
        lessonId: lessonIndex,
        subLessonId: subLessonIndex,
      };
      const response = await axios.post(endpoint, payload);
      console.log("Progress updated successfully:", response.data);
    } catch (err) {
      console.error("Error updating progress:", err.message, err.response?.data || {});
    }
  };

  const truncateText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  function convertToReadableDuration(duration) {
    if (!duration || duration === "0") {
      return "3mins+";
    }
    const [minutes, seconds] = duration.split(":");
    return `${parseInt(minutes, 10)}m ${parseInt(seconds, 10)}s`;
  }

  const [completedTests, setCompletedTests] = useState(new Set());
  const markTestAsCompleted = (chapterId) => {
    setCompletedTests((prev) => new Set([...prev, chapterId]));
  };

  


  const handleNext = async () => {
  if (!courseData?.chapters || courseData.chapters.length === 0) {
    console.error("No chapters available.");
    return;
  }

  // Initialize to first chapter if none selected
  if (currentChapterIndex < 0) {
    setCurrentChapterIndex(0);
    setCurrentLessonIndex(0);
    setCurrentSubLessonIndex(0);
    setActiveAccordion(courseData.chapters[0].chapterId);
    
    // Set the initial content to display
    const firstChapter = courseData.chapters[0];
    if (firstChapter.lessons?.length > 0 && firstChapter.lessons[0].subLessons?.length > 0) {
      const firstSubLesson = firstChapter.lessons[0].subLessons[0];
      handleCurrentContent(
        firstSubLesson,
        0, // chapterIndex
        0, // lessonIndex
        0  // subLessonIndex
      );
    }
    return;
  }

  const currentChapter = courseData.chapters[currentChapterIndex];
  if (!currentChapter?.lessons || currentChapter.lessons.length === 0) {
    console.error("No lessons in current chapter.");
    return;
  }

  // Find the current lesson
  const currentLesson = currentChapter.lessons[currentLessonIndex];
  if (!currentLesson?.subLessons || currentLesson.subLessons.length === 0) {
    console.error("No sub-lessons in current lesson.");
    return;
  }

  // Check if there's a next sub-lesson in the current lesson
  if (currentSubLessonIndex < currentLesson.subLessons.length - 1) {
    const nextSubLessonIndex = currentSubLessonIndex + 1;
    setCurrentSubLessonIndex(nextSubLessonIndex);
    
    // Update the displayed content
    const nextSubLesson = currentLesson.subLessons[nextSubLessonIndex];
    handleCurrentContent(
      nextSubLesson,
      currentChapterIndex,
      currentLessonIndex,
      nextSubLessonIndex
    );
    return;
  }

  // If no more sub-lessons in current lesson, move to next lesson
  if (currentLessonIndex < currentChapter.lessons.length - 1) {
    const nextLessonIndex = currentLessonIndex + 1;
    setCurrentLessonIndex(nextLessonIndex);
    setCurrentSubLessonIndex(0);
    
    // Update the displayed content
    const nextLesson = currentChapter.lessons[nextLessonIndex];
    if (nextLesson.subLessons?.length > 0) {
      const firstSubLesson = nextLesson.subLessons[0];
      handleCurrentContent(
        firstSubLesson,
        currentChapterIndex,
        nextLessonIndex,
        0
      );
    }
    return;
  }

  // If we've reached the end of the chapter
  console.log("Reached end of current chapter");
  // Optionally, you could automatically move to the next chapter here
};
  // ------------------------------------------------------------------

  return (
    <>
      <p className="leftside" onClick={() => navigate(-1)}>
        Back
      </p>
      <div className="courseContentContainer min-vh-100">
        <div className="row firstRow g-0">
          <div className="courseContentHeader">
            <button className="BackBtn" onClick={() => navigate(-1)}>
              Back
            </button>
            <div className="courseHeading">
              {truncateText(courseData.title, 45)}
            </div>
            <button className="NextBtn" onClick={() => handleNext()}>
              Next
            </button>
          </div>
          <div className="courseContentProgressBar">
            <ProgressBar progress={progressPercentage || 0} />
          </div>
        </div>

        <div className="row secondRow">
          <div className="col-md-8 pdy">
            <div className="videoBox">
              <div className="embed-responsive embed-responsive-16by9">
                {courseData?.chapters?.length > 0 &&
                  renderContent(
                    !currentCourseData.link ? "/test.mp4" : currentCourseData.link,
                    !currentCourseData.link ? "/test.mp4" : currentCourseData.type
                  )}
              </div>
              <div>
                <div className="infoBox">
                  <h1>{courseData.title}</h1>
                  {courseData.chapters && courseData.chapters.length > 0 && (
                    <div className="lessonDescriptionBox">
                      <h3 className="lessonDescriptionBoxTitle">
                        {!currentCourseData.title
                          ? courseData.chapters.title
                          : currentCourseData.title}
                      </h3>
                      <p className="lessonDescriptionBoxDescription">
                        {!currentCourseData.notes
                          ? courseData.chapters.description
                          : currentCourseData.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 CCaccordianBox h-100">
            <Accordion
              activeKey={activeAccordion}
              onSelect={(key) => setActiveAccordion(key)}
            >
              {courseData?.chapters &&
                courseData.chapters.map((chapter, index) => {
                  const ChapterCompleted = chapter.lessons?.every((lesson) =>
                    lesson.subLessons?.every((subLesson) =>
                      completedExercises.has(
                        `${chapter.chapterId}-${lesson.lessonId}-${subLesson.subLessonId}`
                      )
                    )
                  );
                  return (
                    <Accordion.Item key={chapter.chapterId} eventKey={chapter.chapterId}>
                      <Accordion.Header>
                        <div className="CClesson-meta">
                          <div className="CClesson-title">
                            <div>
                              {index + 1}. {chapter.title}
                            </div>
                            {ChapterCompleted && (
                              <img className="content-watched" src={tick} alt="watched" />
                            )}
                          </div>
                          <span>Total Content: {chapter.lessons?.length}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Accordion>
                          {chapter.lessons.map((lesson) => {
                            const LessonCompleted = lesson.subLessons?.every(
                              (subLesson) =>
                                completedExercises.has(
                                  `${chapter.chapterId}-${lesson.lessonId}-${subLesson.subLessonId}`
                                )
                            );
                            return (
                              <Accordion.Item
                                key={lesson.lessonId}
                                eventKey={`${chapter.chapterId}-${lesson.lessonId}`}
                              >
                                <Accordion.Header>
                                  <div className="CClesson-meta">
                                    <div className="CClesson-title">
                                      <div>
                                        {index + 1}. {lesson.title}
                                      </div>
                                      {LessonCompleted && (
                                        <img className="content-watched" src={tick} alt="watched" />
                                      )}
                                    </div>
                                    <span>Total Content : {lesson.subLessons?.length}</span>
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                  {lesson.subLessons && lesson.subLessons.length > 0 ? (
                                    <ul className="list-group d-flex">
                                      {lesson.subLessons.map((subLesson) => (
                                        <React.Fragment key={subLesson.subLessonId}>
                                          <li
                                            className={`list-group-item ${
                                              completedExercises.has(
                                                `${chapter.chapterId}-${lesson.lessonId}-${subLesson.subLessonId}`
                                              )
                                                ? "completedLesson"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleCurrentContent(
                                                subLesson,
                                                chapter.chapterId,
                                                lesson.lessonId,
                                                subLesson.subLessonId
                                              )
                                            }
                                          >
                                            <span className="video-number">
                                              <span>{subLesson.title}</span>
                                              {(completedExercises.has(
                                                `${chapter.chapterId}-${lesson.lessonId}-${subLesson.subLessonId}`
                                              ) ||
                                                completedSublessons.has(
                                                  `${chapter.chapterId}-${lesson.lessonId}-${subLesson.subLessonId}`
                                                )) && (
                                                <img className="content-watched" src={tick} alt="watched" />
                                              )}
                                            </span>
                                            {subLesson.fileType === "video/mp4" ? (
                                              <span className="lesson-duration">
                                                Duration:{" "}
                                                {subLesson.duration
                                                  ? convertToReadableDuration(Math.floor(lesson.duration / 1000))
                                                  : "N/A"}
                                              </span>
                                            ) : (
                                              <span className="lesson-duration">
                                                Type: {truncateText(subLesson?.fileType, 30)}
                                              </span>
                                            )}
                                          </li>
                                          {subLesson.test && subLesson.test.length > 0 ? (
                                            <div className="testButtonBox">
                                              <div className="testButtonBox">
                                                <div className="testButtonInr">
                                                  <div className="testButtonTxt">UnderStand Start</div>
                                                  <button
                                                    className="testButton text-nowrap"
                                                    onClick={() => {
                                                      subLesson.test[0].type === "MCQ"
                                                        ? navigate(`/home/courseContent/${courseId}/assessmentTest`, {
                                                            state: { test: subLesson.test },
                                                          })
                                                        : subLesson.test[0].type === "paragraph"
                                                        ? navigate(`/home/courseContent/${courseId}/writtenTest`, {
                                                            state: { test: subLesson.test },
                                                          })
                                                        : null;
                                                      handleMediaEnd(
                                                        subLesson,
                                                        chapter.chapterId,
                                                        lesson.lessonId,
                                                        subLesson.subLessonId
                                                      );
                                                    }}
                                                  >
                                                    Test
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          ) : null}
                                        </React.Fragment>
                                      ))}
                                    </ul>
                                  ) : (
                                    <div>No Sub-Lessons Available</div>
                                  )}
                                </Accordion.Body>
                              </Accordion.Item>
                            );
                          })}
                          {chapter.test && chapter.test.length > 0 ? (
                            <div className="testButtonBox">
                              <div className="testButtonInr">
                                <div className="testButtonTxt">
                                  Take a Test to Confirm Your Understanding
                                </div>
                                <button
                                  className="testButton"
                                  onClick={() => {
                                    if (chapter.test[0].type === "MCQ") {
                                      navigate(`/home/courseContent/${courseId}/assessmentTest`, {
                                        state: { test: chapter.test },
                                      });
                                    } else if (chapter.test[0].type === "paragraph") {
                                      navigate(`/home/courseContent/${courseId}/writtenTest`, {
                                        state: { test: chapter.test, chapterId: chapter._id },
                                      });
                                    }
                                    markTestAsCompleted(chapter.chapterId);
                                  }}
                                >
                                  Take Test
                                  {completedTests.has(chapter.chapterId) && (
                                    <img className="content-watched" src={tick} alt="Completed" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </Accordion>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseContent;
