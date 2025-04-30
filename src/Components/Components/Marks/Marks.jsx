// import React, { useState } from "react";
// import "./Marks.css";

// const Marks = () => {
//   const [marksData, setMarksData] = useState({
//     totalMarks: 19,
//     totalPossibleMarks: 25,
//     percentage: 76,
//     chapters: [
//       {
//         courseId: "chapter123",
//         bestMarks: 8,
//         maxMarks: 10,
//         attempts: [
//           {
//             answers: [
//               {
//                 question: "What is React?",
//                 marks: 4,
//                 type: "MCQ",
//                 userAnswer: "A JS library",
//                 correctAnswer: "A JS library",
//               },
//               {
//                 question: "What is state?",
//                 marks: 4,
//                 type: "QuestionAnswer",
//                 userAnswer: "Data that changes",
//                 correctAnswer: "Data that changes",
//               },
//             ],
//           },
//           {
//             answers: [
//               {
//                 question: "What is React?",
//                 marks: 5,
//                 type: "MCQ",
//                 userAnswer: "A JS library",
//                 correctAnswer: "A JS library",
//               },
//               {
//                 question: "What is state?",
//                 marks: 3,
//                 type: "QuestionAnswer",
//                 userAnswer: "Data that changes",
//                 correctAnswer: "Data that changes",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         courseId: "chapter456",
//         bestMarks: 11,
//         maxMarks: 15,
//         attempts: [
//           {
//             answers: [
//               {
//                 question: "What is Node.js?",
//                 marks: 6,
//                 type: "MCQ",
//                 userAnswer: "A runtime",
//                 correctAnswer: "A runtime",
//               },
//               {
//                 question: "What is Express?",
//                 marks: 5,
//                 type: "QuestionAnswer",
//                 userAnswer: "A framework",
//                 correctAnswer: "A framework",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//     subLessons: [
//       {
//         courseId: "sublesson789",
//         bestMarks: 5,
//         maxMarks: 8,
//         attempts: [
//           {
//             answers: [
//               {
//                 question: "What is JSX?",
//                 marks: 5,
//                 type: "MCQ",
//                 userAnswer: "Syntax extension",
//                 correctAnswer: "Syntax extension",
//               },
//               {
//                 question: "What are props?",
//                 marks: 0,
//                 type: "QuestionAnswer",
//                 userAnswer: "Data passed to components",
//                 correctAnswer: "Data passed to components",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   });

//   const [selectedAttempt, setSelectedAttempt] = useState(null);

//   return (
//     <div className="container-fluid mt-4">
//       <h2 className="text-center text-primary">Marks Summary</h2>
//       <table className="table table-bordered table-striped shadow-sm">
//         <thead className="table-dark">
//           <tr>
//             <th>Total Marks</th>
//             <th>Total Possible Marks</th>
//             <th>Percentage</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>{marksData.totalMarks ?? "N/A"}</td>
//             <td>{marksData.totalPossibleMarks ?? "N/A"}</td>
//             <td>{marksData.percentage ? `${marksData.percentage}%` : "N/A"}</td>
//           </tr>
//         </tbody>
//       </table>

//       {marksData.chapters && marksData.chapters.length > 0 && (
//         <>
//           <h2 className="text-center text-success">Chapters</h2>
//           <table className="table table-hover table-bordered shadow-sm">
//             <thead className="table-info">
//               <tr>
//                 <th>Chapter ID</th>
//                 <th>Best Marks</th>
//                 <th>Max Marks</th>
//                 <th>Attempts</th>
//               </tr>
//             </thead>
//             <tbody>
//               {marksData.chapters.map((chapter) => (
//                 <React.Fragment key={chapter.courseId}>
//                   <tr>
//                     <td>{chapter.courseId}</td>
//                     <td>{chapter.bestMarks ?? "N/A"}</td>
//                     <td>{chapter.maxMarks ?? "N/A"}</td>
//                     <td>
//                       {chapter.attempts?.map((attempt, index) => (
//                         <div key={index}>
//                           <button
//                             className="btn btn-outline-primary m-1"
//                             onClick={() => setSelectedAttempt(attempt)}
//                           >
//                             Attempt {index + 1} (
//                             {attempt.answers.reduce(
//                               (sum, ans) => sum + ans.marks,
//                               0
//                             )}
//                             Marks)
//                           </button>
//                         </div>
//                       )) || "No attempts"}
//                     </td>
//                   </tr>
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//       {marksData.subLessons && marksData.subLessons.length > 0 && (
//         <>
//           <h2 className="text-center text-info">Sub-Lessons</h2>
//           <table className="table table-hover table-bordered shadow-sm">
//             <thead className="table-warning">
//               <tr>
//                 <th>Sub-Lesson ID</th>
//                 <th>Best Marks</th>
//                 <th>Max Marks</th>
//                 <th>Attempts</th>
//               </tr>
//             </thead>
//             <tbody>
//               {marksData.subLessons.map((subLesson) => (
//                 <tr key={subLesson.courseId}>
//                   <td>{subLesson.courseId}</td>
//                   <td>{subLesson.bestMarks ?? "N/A"}</td>
//                   <td>{subLesson.maxMarks ?? "N/A"}</td>
//                   <td>
//                     {subLesson.attempts?.map((attempt, index) => (
//                       <div key={index}>
//                         <button
//                           className="btn btn-outline-success m-1"
//                           onClick={() => setSelectedAttempt(attempt)}
//                         >
//                           Attempt {index + 1} (
//                           {attempt.answers.reduce(
//                             (sum, ans) => sum + ans.marks,
//                             0
//                           )}
//                           Marks)
//                         </button>
//                       </div>
//                     )) || "No attempts"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//       {selectedAttempt && (
//         <div className="modal fade show d-block" tabIndex="-1">
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">Attempt Details</h5>
//                 <button
//                   className="btn-close"
//                   onClick={() => setSelectedAttempt(null)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <table className="table table-bordered shadow-sm">
//                   <thead className="table-primary">
//                     <tr>
//                       <th>Question</th>
//                       <th>Marks</th>
//                       <th>Your Answer</th>
//                       <th>Correct Answer</th>
//                       <th>Correct</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedAttempt.answers?.map((answer, index) => (
//                       <tr key={index}>
//                         <td>{answer.question ?? "N/A"}</td>
//                         <td>{answer.marks ?? "N/A"}</td>
//                         <td>{answer.userAnswer ?? "N/A"}</td>
//                         <td>{answer.correctAnswer || "N/A"}</td>
//                         <td>
//                           {answer.userAnswer === answer.correctAnswer
//                             ? "true"
//                             : "false"}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-danger"
//                   onClick={() => setSelectedAttempt(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Marks;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import "./Marks.css";


// const apiBaseUrl = process.env.REACT_APP_BASE_API;
// const userInfo = JSON.parse(localStorage.getItem("userdata"));

// const Marks = () => {
  
//   const [marksData, setMarksData] = useState(null);
//   const [selectedAttempt, setSelectedAttempt] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMarksData = async () => {
//       try {
//         const response = await axios.get(`${apiBaseUrl}/api/answer/${userInfo._id}/${userInfo.degreeProgress[0].degreeId}`);
//         setMarksData(response.data);
//       } catch (err) {
//         setError("Failed to load marks data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMarksData();
//   }, [userInfo._id, userInfo.degreeProgress[0].degreeId]);

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-center text-danger">{error}</p>;
//   if (!marksData) return <p className="text-center">No data available</p>;

//   return (
//     <div className="container-fluid mt-4">
//       <h2 className="text-center text-primary">Marks Summary</h2>
//       <table className="table table-bordered table-striped shadow-sm">
//         <thead className="table-dark">
//           <tr>
//             <th>Total Marks</th>
//             <th>Total Possible Marks</th>
//             <th>Percentage</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>{marksData.totalMarks ?? "N/A"}</td>
//             <td>{marksData.totalPossibleMarks ?? "N/A"}</td>
//             <td>{marksData.percentage ? `${marksData.percentage}%` : "N/A"}</td>
//           </tr>
//         </tbody>
//       </table>

//       {["chapters", "subLessons"].map((category) => (
//         marksData[category]?.length > 0 && (
//           <div key={category}>
//             <h2 className={`text-center ${category === "chapters" ? "text-success" : "text-info"}`}>{category === "chapters" ? "Chapters" : "Sub-Lessons"}</h2>
//             <table className="table table-hover table-bordered shadow-sm">
//               <thead className={`table-${category === "chapters" ? "info" : "warning"}`}>
//                 <tr>
//                   <th>ID</th>
//                   <th>Best Marks</th>
                  
//                   <th>Attempts</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {marksData[category].map((item) => (
//                   <tr key={item.courseId}>
//                     <td>{item.courseId}</td>
//                     <td>{item.bestMarks ?? "N/A"}</td>
                    
//                     <td>
//                       {item.attempts?.map((attempt, index) => (
//                         <div key={index}>
//                           <button
//                             className="btn btn-outline-primary m-1"
//                             onClick={() => setSelectedAttempt(attempt)}
//                           >
//                             Attempt {index + 1} ({attempt.answers.reduce((sum, ans) => sum + ans.marks, 0)} Marks)
//                           </button>
//                         </div>
//                       )) || "No attempts"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       ))}

//       {selectedAttempt && (
//         <div className="modal fade show d-block" tabIndex="-1">
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">Attempt Details</h5>
//                 <button className="btn-close" onClick={() => setSelectedAttempt(null)}></button>
//               </div>
//               <div className="modal-body">
//                 <table className="table table-bordered shadow-sm">
//                   <thead className="table-primary">
//                     <tr>
//                       <th>Question</th>
//                       <th>Marks</th>
//                       <th>Your Answer</th>
                      
//                       <th>Correct</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedAttempt.answers?.map((answer, index) => (
//                       <tr key={index}>
//                         <td>{answer.question ?? "N/A"}</td>
//                         <td>{answer.marks ?? "N/A"}</td>
//                         <td>{answer.userAnswer ?? "N/A"}</td>
                        
//                         <td>{answer.userAnswer === answer.correctAnswer ? "✔" : "✘"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-danger" onClick={() => setSelectedAttempt(null)}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Marks;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Marks.css";

const apiBaseUrl = process.env.REACT_APP_BASE_API;
const userInfo = JSON.parse(localStorage.getItem("userdata"));

const Marks = () => {
  const [marksData, setMarksData] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarksData = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/answer/${userInfo._id}/${userInfo.degreeProgress[0].degreeId}`
        );
        setMarksData(response.data);
      } catch (err) {
        setError("Failed to load marks data");
      } finally {
        setLoading(false);
      }
    };
    fetchMarksData();
  }, [userInfo._id, userInfo.degreeProgress[0].degreeId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!marksData) return <p className="text-center">No data available</p>;

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center text-primary">Marks Summary</h2>
      <table className="table table-bordered table-striped shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Total Marks</th>
            <th>Total Possible Marks</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{marksData.totalMarks ?? "N/A"}</td>
            <td>{marksData.totalPossibleMarks ?? "N/A"}</td>
            <td>{marksData.percentage ? `${marksData.percentage}%` : "N/A"}</td>
          </tr>
        </tbody>
      </table>

      {["chapters", "subLessons"].map((category) =>
        marksData[category]?.length > 0 ? (
          <div key={category}>
            <h2
              className={`text-center ${
                category === "chapters" ? "text-success" : "text-info"
              }`}
            >
              {category === "chapters" ? "Chapters" : "Sub-Lessons"}
            </h2>
            <table className="table table-hover table-bordered shadow-sm">
              <thead
                className={`table-${
                  category === "chapters" ? "info" : "warning"
                }`}
              >
                <tr>
                  <th>Course Name</th>
                  <th>Best Marks</th>
                  <th>Attempts</th>
                </tr>
              </thead>
              <tbody>
                {marksData[category].map((item) => (
                  <tr key={item.courseName}>
                    <td>{item.courseName ?? "N/A"}</td>
                    <td>{item.bestMarks ?? "N/A"}</td>
                    <td>
                      {item.attempts?.map((attempt, index) => (
                        <div key={index}>
                          <button
                            className="btn btn-outline-primary m-1"
                            onClick={() => setSelectedAttempt(attempt)}
                          >
                            Attempt {index + 1} (
                            {attempt.answers.reduce(
                              (sum, ans) => sum + ans.marks,
                              0
                            )}{" "}
                            Marks)
                          </button>
                        </div>
                      )) || "No attempts"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null
      )}

      {selectedAttempt && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Attempt Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedAttempt(null)}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered shadow-sm">
                  <thead className="table-primary">
                    <tr>
                      <th>Question</th>
                      <th>Marks</th>
                      <th>Your Answer</th>
                      <th>Correct</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAttempt.answers?.map((answer, index) => (
                      <tr key={index}>
                        <td>{answer.question ?? "N/A"}</td>
                        <td>{answer.marks ?? "N/A"}</td>
                        <td>{answer.userAnswer ?? "N/A"}</td>
                        <td>
                          {answer.userAnswer === answer.correctAnswer
                            ? "✔"
                            : "✘"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => setSelectedAttempt(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;
