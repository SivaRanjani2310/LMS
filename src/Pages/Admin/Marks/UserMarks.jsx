import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import "./UserMarks.css";

// import local JSON data
import userMarksData from "./userMarksData.json";

const UserMarks = () => {
  const navigate = useNavigate();

  // main data states
  const [mockData, setMockData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempMarks, setTempMarks] = useState({});

  // set data from json
  useEffect(() => {
    setMockData(userMarksData);
  }, []);

  const handleMarksChange = (index, value) => {
    setTempMarks({ ...tempMarks, [index]: value });
  };

  const saveMarks = (attemptIndex, answerIndex) => {
    const updated = { ...selectedAttempt };
    updated.answers[answerIndex].marks =
      tempMarks[answerIndex] || updated.answers[answerIndex].marks;
    setSelectedAttempt(updated);
    setTempMarks({});
    setEditingIndex(null);
  };

  return (
    <AdminNavbar>
      <div className="admin">
        <Header Title={"Marks Overview"} Address={"userList"} />

        <div className="container-fluid mt-4" style={{ flex: 1 }}>
          {!selectedUser && (
            <button
              className="btn btn-secondary mb-3"
              onClick={() => navigate("/admin")}
            >
              Back
            </button>
          )}

          {!selectedUser ? (
            <>
              <h2 className="text-center text-primary">Marks Overview</h2>
              <table className="table table-bordered table-striped shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>Student Name</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.name}</td>
                      <td>{user.totalMarks}</td>
                      <td>{user.percentage}%</td>
                      <td>
                        <button
                          className="btn btn-outline-info"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary d-flex justify-content-end mb-3"
                onClick={() => setSelectedUser(null)}
              >
                Back to User List
              </button>

              <h3 className="text-center text-success">
                {selectedUser.name}'s Marks
              </h3>
              <table className="table table-hover table-bordered shadow-sm">
                <thead className="table-info">
                  <tr>
                    <th>Course Name</th>
                    <th>Best Marks</th>
                    <th>Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.chapters.map((item, index) => (
                    <tr key={index}>
                      <td>{item.courseName}</td>
                      <td>{item.bestMarks}</td>
                      <td>
                        {item.attempts.map((attempt, idx) => (
                          <button
                            key={idx}
                            className="btn btn-outline-primary m-1"
                            onClick={() => setSelectedAttempt(attempt)}
                          >
                            Attempt {idx + 1} (
                            {attempt.answers.reduce(
                              (sum, ans) => sum + ans.marks,
                              0
                            )}{" "}
                            Marks)
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

{selectedAttempt && (
  <>
    {/* Modal backdrop */}
    <div className="modal-backdrop show"></div>

    {/* Modal box */}
    <div className="modal show" tabIndex="-1">
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
                  <th>User Answer</th>
                  <th>Correct Answer</th>
                  <th>Correct?</th>
                  <th>Marks</th>
                  <th>Max Marks</th>
                  <th>Edit</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttempt.answers.map((answer, index) => (
                  <tr key={index}>
                    <td>{answer.question}</td>
                    <td>{answer.userAnswer}</td>
                    <td>{answer.correctAnswer}</td>
                    <td>
                      {answer.userAnswer === answer.correctAnswer ? "✔" : "✘"}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="number"
                          className="form-control"
                          value={tempMarks[index] ?? answer.marks}
                          onChange={(e) =>
                            handleMarksChange(
                              index,
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                      ) : (
                        answer.marks
                      )}
                    </td>
                    <td>{answer.maxMarks}</td>
                    <td>
                      {editingIndex === index ? (
                        <button
                          className="btn btn-warning"
                          onClick={() => setEditingIndex(null)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          className="btn btn-info"
                          onClick={() => setEditingIndex(index)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => saveMarks(0, index)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedAttempt(null)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}

        </div>
      </div>
    </AdminNavbar>
  );
};

export default UserMarks;
