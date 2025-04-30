// import React, { useState, useEffect } from "react";
// import "./AssessmentTest.css";
// import logoela from "../assets/brand-footer.png";
// // import questionData from './Questionsdata.json';
// import { FaCheckCircle } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
// import Dropdown from "react-bootstrap/Dropdown";
// import { confirmAlert } from "react-confirm-alert"; // Import
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

// //react-router
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// const apiBaseUrl = process.env.REACT_APP_BASE_API;
// const userInfo = JSON.parse(localStorage.getItem("userdata"));

// const AssessmentTest = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { test } = location.state;
//   console.log(test);

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [score, setScore] = useState({});
//   const [timeLeft, setTimeLeft] = useState(3600); // 23 minutes and 46 seconds
//   const [selectedUserDropdown, setSelectedUserDropdown] = useState(1);
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
//   const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});
//   const [showPopup, setShowPopup] = useState(false);
//   // var questionData = JSON.parse(localStorage.getItem("questionData"));
//   // var questionData = test[0];
//   var questionData = test?.[0] || {};

//   console.log(questionData);

//   const [finalScore, setFinalScore] = useState(0);

//   useEffect(() => {
//     setTimeLeft(localStorage.getItem("TimeLeft"));
//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

  

//   const handleBookmark = () => {
    
//     setBookmarkedQuestions({
//       ...bookmarkedQuestions,
//       [`${currentSectionIndex}-${currentQuestionIndex}`]:
//         bookmarkedQuestions[
//           `${currentSectionIndex}-${currentQuestionIndex}`
//         ] === "true"
//           ? "false"
//           : "true",
//     });
//   };

  

//   const handleNavigation = (direction) => {
//     const currentSectionQuestions = questionData?.questions || [];
  
//     if (direction === "next" && currentQuestionIndex < currentSectionQuestions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else if (direction === "previous" && currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };
  


//   const handleOptionChange = (event) => {
//     const selectedValue = event.target.value;
//     setSelectedOptions({
//       ...selectedOptions,
//       [`${currentSectionIndex}-${currentQuestionIndex}`]: selectedValue,
//     });
  
//     const currentQuestion = currentSectionQuestions[currentQuestionIndex];
//     setScore({
//       ...score,
//       [`${currentSectionIndex}-${currentQuestionIndex}`]:
//         currentQuestion?.correctAnswer === selectedValue ? 1 : 0,
//     });
//   };
  

//   const handleSelectChange = (event) => {
//     const selectedSectionIndex = parseInt(event.target.value) - 1;
//     setSelectedUserDropdown(event.target.value);
//     setCurrentSectionIndex(selectedSectionIndex);
//     setCurrentQuestionIndex(0);
//   };

  

//   const handleNextSection = () => {
//     if (currentSectionIndex < questionData.sections.length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1);
//       setCurrentQuestionIndex(0);
//     }
//   };

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const remainingSeconds = seconds % 60;
//     var timercolor = {};
//     if (seconds <= 30) {
//       timercolor = { color: "red" };
//     }
//     return (
//       <div className="time-row">
//         <div className="time-item">
//           <p style={timercolor} className="para-one">
//             {hours.toString().padStart(2, "0")}
//           </p>
//           <p className="para-two">Hours</p>
//         </div>
//         <div className="time-item">
//           <p style={timercolor} className="para-one">
//             {minutes.toString().padStart(2, "0")}
//           </p>
//           <p className="para-two">Minutes</p>
//         </div>
//         <div className="time-item">
//           <p style={timercolor} className="para-one">
//             {remainingSeconds.toString().padStart(2, "0")}
//           </p>
//           <p className="para-two">Seconds</p>
//         </div>
//       </div>
//     );
//   };

//   const formatTimevalue = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const remainingSeconds = seconds % 60;
//     var time = "0";
//     console.log(minutes);
//     if (hours > 0) {
//       time =
//         hours.toString().padStart(2, "0") +
//         " hours " +
//         minutes.toString().padStart(2, "0") +
//         " minutues " +
//         remainingSeconds.toString().padStart(2, "0") +
//         " seconds";
//     } else if (minutes > 0) {
//       time =
//         minutes.toString().padStart(2, "0") +
//         " minutues " +
//         remainingSeconds.toString().padStart(2, "0") +
//         " seconds";
//     } else {
//       time = remainingSeconds.toString().padStart(2, "0") + " seconds";
//     }
//     return time;
//   };

  
//   const currentSectionQuestions = questionData?.questions || [];
//   // const currentSectionQuestions = questionData.questions || [];

//   const currentQuestion = currentSectionQuestions[currentQuestionIndex] || null;
//   // const currentQuestion = test?.questions[currentQuestionIndex] || null;

//   // console.log("currentSection", currentSection);
//   console.log(currentSectionQuestions);

//   console.log("currentQuestion", currentQuestion);

//   let [totalQuestions, settotalQuestions] = useState(0);
//   useEffect(() => {
//     if (questionData && questionData.questions) {
//       settotalQuestions(questionData.questions.length);
//     }
//   }, [questionData]);
 
//   const answeredCount = Object.keys(selectedOptions).length;
//   const bookmarkedCount = Object.keys(bookmarkedQuestions).length;
//   const notAnsweredCount = totalQuestions - answeredCount;

//   const isCurrentSectionCompleted = currentSectionQuestions.every((_, index) =>
//     selectedOptions.hasOwnProperty(`${currentSectionIndex}-${index}`)
//   );

  

//   function finishtest() {

//     if (answeredCount < totalQuestions) {
//       setShowPopup(true);
//     }
//     else{
//     if (notAnsweredCount > 0) {
//       confirmAlert({
//         title: `You have ${notAnsweredCount} unanswered questions`,
//         message: "Do you wish to continue?",
//         buttons: [
//           {
//             label: "Yes",
//             onClick: () => testcomplete(),
//           },
//           {
//             label: "No",
//           },
//         ],
//       });
//     } else {
//       confirmAlert({
//         title: `You have ${formatTimevalue(timeLeft)} time left`,
//         message: "Make sure that your answers are correct. Do you wish to continue?",
//         buttons: [
//           {
//             label: "Yes",
//             onClick: () => testcomplete(),
//           },
//           {
//             label: "No",
//           },
//         ],
//       });
//     }
//   }
// }
  
//   async function testcomplete() {
//     try {
//       const formData = new FormData();
//       formData.append("userId", userInfo?._id);
//       formData.append("degreeId", userInfo?.applyingFor);
  
//       const processedAnswers = currentSectionQuestions.map((question, index) => {
//         const userAnswer = selectedOptions[`${currentSectionIndex}-${index}`] || null;
//         const isCorrect = userAnswer === question.correctAnswer;
        
//         return {
//           question: question.question,
//           userAnswer,
//           correctAnswer: question.correctAnswer,
//           type:"MCQ",
//           marks: isCorrect ? 1 : 0,
//           maxMark:1,

//         };
//       });
  
//       console.log("Processed Answers:", processedAnswers); // Debugging
  
//       if (processedAnswers.length === 0) {
//         alert("No answers recorded. Please ensure answers are selected before submission.");
//         return;
//       }
  
//       const subLessons = [
//         {
//           sublessonId: questionData._id,
//           attempts: [{ answers: processedAnswers }],
//         },
//       ];
  
//       formData.append("subLessons", JSON.stringify(subLessons));
  
//       // if (selectedFiles.length > 0) {
//       //   selectedFiles.forEach((file) => formData.append("answerFiles", file));
//       // }
  
//       const response = await axios.post(`${apiBaseUrl}/api/answer/submit1`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       console.log("Response:", response.data);
  
//       if (response.status === 201) {
//         alert("Test submitted successfully!");
//         navigate(-1);
//       } else {
//         alert("Test submission failed! Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       alert("Failed to submit test. Please check the console for more details.");
//     }
//   }
  




//   return (
//     <div className="assessment-head">
//       <div className="assessment-inside">
//         <div className="nav-content">
//           <div className="brand-logo">
//             <img src={logoela} alt="C-Suite Academy" height="40px" />
//           </div>
          
//           <button
//             className="button-finish"
//             onClick={(e) => {
//               e.preventDefault();
//               finishtest();
//             }}
//             // disabled={notAnsweredCount > 0}
//           >
//             Finish
//           </button>
//           {/* Popup Modal */}
//       {showPopup && (
//         <div className="popup">
//           <div className="popup-content">
//             <h2>⚠️ Attention!</h2>
//             <p>Please attend all the questions before finishing the test.</p>
//             <button onClick={() => setShowPopup(false)}>OK</button>
//           </div>
//         </div>
//       )}

//         </div>

//         <div className="container-fluid">
//           <div className="row">
//             <div className="w-75 h-100 left-side">
//               <main className="quiz-main">
//                 <div className="first-content">
//                   <p className="count-question">
//                     {(currentQuestionIndex + 1).toString().padStart(2, "0")}
//                     <span>/</span>
//                     {currentSectionQuestions?.length}
//                   </p>
                  
//                 </div>

//                 <p className="question-style">{currentQuestion?.question}</p>

//                 <form>
//                   {currentQuestion?.options?.map((option, index) => (
//                     <div className="button-style-icons" key={index}>
//                       <label>
//                         <input
//                           type="radio"
//                           value={option}
//                           checked={
//                             selectedOptions[
//                               `${currentSectionIndex}-${currentQuestionIndex}`
//                             ] === option
//                           }
//                           onChange={handleOptionChange}
//                         />
//                         <FaCheckCircle className="icon-style" size="1.8rem" />
//                         {` ${String.fromCharCode(65 + index)}. ${option}`}
//                       </label>
//                     </div>
//                   ))}
//                 </form>

//                 <div className="navigation-button">
//                   <button
//                     className="button-previous"
//                     onClick={() => handleNavigation("previous")}
//                     disabled={currentQuestionIndex === 0}>
//                     Previous
//                   </button>
//                   {!(
//                     isCurrentSectionCompleted &&
//                     currentSectionIndex <questionData.length - 1
//                   ) && (
//                     <button
//                       className="button-next"
//                       onClick={() => handleNavigation("next")}
//                       disabled={
//                         currentQuestionIndex ===
//                         currentSectionQuestions.length - 1
//                       }>
//                       Next
//                     </button>
//                   )}
//                   {isCurrentSectionCompleted &&
//                     currentSectionIndex < questionData.length - 1 && (
//                       <button
//                         className="button-next"
//                         onClick={handleNextSection}>
//                         Next Section
//                       </button>
//                     )}
//                   <button
//                     className="button-bookmark"
//                     onClick={handleBookmark}>{`${
//                     bookmarkedQuestions[
//                       `${currentSectionIndex}-${currentQuestionIndex}`
//                     ] === "true"
//                       ? "Bookmarked"
//                       : "Bookmark"
//                   }`}</button>
//                 </div>
//               </main>
//             </div>
//             <div className="w-25 h-100 right-side">
//               <div className="w-100 right-side-component">
//                 {/* <div className="timer">{formatTime(timeLeft)}</div> */}
//                 <div
//                   className="questions-container"
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "5px",
//                     width: "100%",
//                   }}
//                 >
//                   <div className="questions">
//                     <p>Questions</p>
//                   </div>
                  
//                   <div
//                     id="Test-marks-container"
//                     style={{ width: "100%", paddingLeft: "2rem" }}
//                   >
//                     <div className="question-numbers">
//                       {currentSectionQuestions.map((question, quesIndex) => (
//                         <button
//                           key={quesIndex}
//                           className={`question-number ${
//                             quesIndex === currentQuestionIndex ? "active" : ""
//                           }
//                           ${
//                             selectedOptions[
//                               `${currentSectionIndex}-${quesIndex}`
//                             ]
//                               ? "answered"
//                               : ""
//                           }
//                           `}
//                           onClick={() => setCurrentQuestionIndex(quesIndex)}
//                         >
//                           {/* {`${(quesIndex + 1).toString().padStart(2, '0')}`} <FontAwesomeIcon icon={faCheckCircle} style={{color:`${!selectedOptions[`${currentSectionIndex}-${quesIndex}`] && bookmarkedQuestions[`${currentSectionIndex}-${quesIndex}`]=="true"? 'orange' : ''}`}}  size='1rem'className='icon-check pl-4' /> */}
//                           {`${(quesIndex + 1).toString().padStart(2, "0")}`}
//                           <FontAwesomeIcon
//                             icon={faCheckCircle}
//                             size="1rem"
//                             className={`icon-check pl-4 ${
//                               bookmarkedQuestions[
//                                 `${currentSectionIndex}-${quesIndex}`
//                               ] === "true"
//                                 ? "bookmarked"
//                                 : ""
//                             }`}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="test-checkup-field">
//                   <div id="answered-txt">
//                     Answered
//                     <span>
//                       {answeredCount}/{totalQuestions}
//                     </span>
//                   </div>
//                   <div id="not-answered-txt">
//                     Not Answered
//                     <span>
//                       {notAnsweredCount}/{totalQuestions}
//                     </span>
//                   </div>
//                   <div id="bookmarked-txt">
//                     Bookmarked <span>{bookmarkedCount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssessmentTest;



import React, { useState, useEffect } from "react";
import "./AssessmentTest.css";
import logoela from "../assets/brand-footer.png";
import { FaCheckCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

//react-router
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_BASE_API;
const userInfo = JSON.parse(localStorage.getItem("userdata"));

const AssessmentTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { test } = location.state;
  console.log(test);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 23 minutes and 46 seconds
  const [selectedUserDropdown, setSelectedUserDropdown] = useState(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  var questionData = test?.[0] || {};

  console.log(questionData);

  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    setTimeLeft(localStorage.getItem("TimeLeft"));
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBookmark = () => {
    setBookmarkedQuestions({
      ...bookmarkedQuestions,
      [`${currentSectionIndex}-${currentQuestionIndex}`]:
        bookmarkedQuestions[
          `${currentSectionIndex}-${currentQuestionIndex}`
        ] === "true"
          ? "false"
          : "true",
    });
  };

  const handleNavigation = (direction) => {
    const currentSectionQuestions = questionData?.questions || [];

    if (direction === "next" && currentQuestionIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === "previous" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOptions({
      ...selectedOptions,
      [`${currentSectionIndex}-${currentQuestionIndex}`]: selectedValue,
    });

    const currentQuestion = currentSectionQuestions[currentQuestionIndex];
    setScore({
      ...score,
      [`${currentSectionIndex}-${currentQuestionIndex}`]:
        currentQuestion?.correctAnswer === selectedValue ? 1 : 0,
    });
  };

  const handleSelectChange = (event) => {
    const selectedSectionIndex = parseInt(event.target.value) - 1;
    setSelectedUserDropdown(event.target.value);
    setCurrentSectionIndex(selectedSectionIndex);
    setCurrentQuestionIndex(0);
  };

  const handleNextSection = () => {
    if (currentSectionIndex < questionData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    var timercolor = {};
    if (seconds <= 30) {
      timercolor = { color: "red" };
    }
    return (
      <div className="time-row">
        <div className="time-item">
          <p style={timercolor} className="para-one">
            {hours.toString().padStart(2, "0")}
          </p>
          <p className="para-two">Hours</p>
        </div>
        <div className="time-item">
          <p style={timercolor} className="para-one">
            {minutes.toString().padStart(2, "0")}
          </p>
          <p className="para-two">Minutes</p>
        </div>
        <div className="time-item">
          <p style={timercolor} className="para-one">
            {remainingSeconds.toString().padStart(2, "0")}
          </p>
          <p className="para-two">Seconds</p>
        </div>
      </div>
    );
  };

  const formatTimevalue = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    var time = "0";
    console.log(minutes);
    if (hours > 0) {
      time =
        hours.toString().padStart(2, "0") +
        " hours " +
        minutes.toString().padStart(2, "0") +
        " minutues " +
        remainingSeconds.toString().padStart(2, "0") +
        " seconds";
    } else if (minutes > 0) {
      time =
        minutes.toString().padStart(2, "0") +
        " minutues " +
        remainingSeconds.toString().padStart(2, "0") +
        " seconds";
    } else {
      time = remainingSeconds.toString().padStart(2, "0") + " seconds";
    }
    return time;
  };

  const currentSectionQuestions = questionData?.questions || [];
  const currentQuestion = currentSectionQuestions[currentQuestionIndex] || null;

  let [totalQuestions, settotalQuestions] = useState(0);
  useEffect(() => {
    if (questionData && questionData.questions) {
      settotalQuestions(questionData.questions.length);
    }
  }, [questionData]);

  const answeredCount = Object.keys(selectedOptions).length;
  const bookmarkedCount = Object.keys(bookmarkedQuestions).length;
  const notAnsweredCount = totalQuestions - answeredCount;

  const isCurrentSectionCompleted = currentSectionQuestions.every((_, index) =>
    selectedOptions.hasOwnProperty(`${currentSectionIndex}-${index}`)
  );

  function finishtest() {
    if (answeredCount < totalQuestions) {
      setShowPopup(true);
    } else {
      if (notAnsweredCount > 0) {
        confirmAlert({
          title: `You have ${notAnsweredCount} unanswered questions`,
          message: "Do you wish to continue?",
          buttons: [
            {
              label: "Yes",
              onClick: () => testcomplete(),
            },
            {
              label: "No",
            },
          ],
        });
      } else {
        confirmAlert({
          title: `You have ${formatTimevalue(timeLeft)} time left`,
          message: "Make sure that your answers are correct. Do you wish to continue?",
          buttons: [
            {
              label: "Yes",
              onClick: () => testcomplete(),
            },
            {
              label: "No",
            },
          ],
        });
      }
    }
  }

  async function testcomplete() {
    try {
      const formData = new FormData();
      formData.append("userId", userInfo?._id);
      formData.append("degreeId", userInfo?.applyingFor);

      const processedAnswers = currentSectionQuestions.map((question, index) => {
        const userAnswer = selectedOptions[`${currentSectionIndex}-${index}`] || null;
        const isCorrect = userAnswer === question.correctAnswer;

        return {
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          type: "MCQ",
          marks: isCorrect ? 1 : 0,
          maxMark: 1,
        };
      });

      console.log("Processed Answers:", processedAnswers); // Debugging

      if (processedAnswers.length === 0) {
        alert("No answers recorded. Please ensure answers are selected before submission.");
        return;
      }

      const subLessons = [
        {
          sublessonId: questionData._id,
          attempts: [{ answers: processedAnswers }],
        },
      ];

      formData.append("subLessons", JSON.stringify(subLessons));

      const response = await axios.post(`${apiBaseUrl}/api/answer/submit1`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", response.data);

      if (response.status === 201) {
        alert("Test submitted successfully!");
        navigate(-1);
      } else {
        alert("Test submission failed! Please try again.");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please check the console for more details.");
    }
  }

  return (
    <div className="assessment-head">
      <div className="assessment-inside">
        <div className="nav-content">
          <div className="brand-logo">
            <img src={logoela} alt="C-Suite Academy" height="40px" />
          </div>

          {/* Back Button */}
          <button
            className="button-back"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            Back
          </button>

          <button
            className="button-finish"
            onClick={(e) => {
              e.preventDefault();
              finishtest();
            }}
          >
            Finish
          </button>

          {/* Popup Modal */}
          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>⚠️ Attention!</h2>
                <p>Please attend all the questions before finishing the test.</p>
                <button onClick={() => setShowPopup(false)}>OK</button>
              </div>
            </div>
          )}
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="w-75 h-100 left-side">
              <main className="quiz-main">
                <div className="first-content">
                  <p className="count-question">
                    {(currentQuestionIndex + 1).toString().padStart(2, "0")}
                    <span>/</span>
                    {currentSectionQuestions?.length}
                  </p>
                </div>

                <p className="question-style">{currentQuestion?.question}</p>

                <form>
                  {currentQuestion?.options?.map((option, index) => (
                    <div className="button-style-icons" key={index}>
                      <label>
                        <input
                          type="radio"
                          value={option}
                          checked={
                            selectedOptions[
                              `${currentSectionIndex}-${currentQuestionIndex}`
                            ] === option
                          }
                          onChange={handleOptionChange}
                        />
                        <FaCheckCircle className="icon-style" size="1.8rem" />
                        {` ${String.fromCharCode(65 + index)}. ${option}`}
                      </label>
                    </div>
                  ))}
                </form>

                <div className="navigation-button">
                  <button
                    className="button-previous"
                    onClick={() => handleNavigation("previous")}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  {!(
                    isCurrentSectionCompleted &&
                    currentSectionIndex < questionData.length - 1
                  ) && (
                    <button
                      className="button-next"
                      onClick={() => handleNavigation("next")}
                      disabled={
                        currentQuestionIndex ===
                        currentSectionQuestions.length - 1
                      }
                    >
                      Next
                    </button>
                  )}
                  {isCurrentSectionCompleted &&
                    currentSectionIndex < questionData.length - 1 && (
                      <button
                        className="button-next"
                        onClick={handleNextSection}
                      >
                        Next Section
                      </button>
                    )}
                  <button
                    className="button-bookmark"
                    onClick={handleBookmark}
                  >{`${
                    bookmarkedQuestions[
                      `${currentSectionIndex}-${currentQuestionIndex}`
                    ] === "true"
                      ? "Bookmarked"
                      : "Bookmark"
                  }`}</button>
                </div>
              </main>
            </div>
            <div className="w-25 h-100 right-side">
              <div className="w-100 right-side-component">
                <div
                  className="questions-container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    width: "100%",
                  }}
                >
                  <div className="questions">
                    <p>Questions</p>
                  </div>

                  <div
                    id="Test-marks-container"
                    style={{ width: "100%", paddingLeft: "2rem" }}
                  >
                    <div className="question-numbers">
                      {currentSectionQuestions.map((question, quesIndex) => (
                        <button
                          key={quesIndex}
                          className={`question-number ${
                            quesIndex === currentQuestionIndex ? "active" : ""
                          }
                          ${
                            selectedOptions[
                              `${currentSectionIndex}-${quesIndex}`
                            ]
                              ? "answered"
                              : ""
                          }
                          `}
                          onClick={() => setCurrentQuestionIndex(quesIndex)}
                        >
                          {`${(quesIndex + 1).toString().padStart(2, "0")}`}
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            size="1rem"
                            className={`icon-check pl-4 ${
                              bookmarkedQuestions[
                                `${currentSectionIndex}-${quesIndex}`
                              ] === "true"
                                ? "bookmarked"
                                : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="test-checkup-field">
                  <div id="answered-txt">
                    Answered
                    <span>
                      {answeredCount}/{totalQuestions}
                    </span>
                  </div>
                  <div id="not-answered-txt">
                    Not Answered
                    <span>
                      {notAnsweredCount}/{totalQuestions}
                    </span>
                  </div>
                  <div id="bookmarked-txt">
                    Bookmarked <span>{bookmarkedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTest;
