import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";

import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./MyTask.css";

const MyTask = () => {
  // Sample data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete Project Documentation",
      description: "Prepare the final project documentation in PDF format",
      file: "project_docs.pdf",
      assignedBy: "Admin",
      dateAssigned: "2023-05-15",
    },
    {
      id: 2,
      title: "Review API Design",
      description: "Review the API design document and provide feedback",
      file: "api_design.pdf",
      assignedBy: "Admin",
      dateAssigned: "2023-05-10",
    },
  ]);

  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      taskId: 2,
      link: "https://docs.google.com/document/d/456",
      status: "approved", // pending, approved, rejected
      dateSubmitted: "2023-05-12",
    },
  ]);

  const [newSubmission, setNewSubmission] = useState({
    taskId: "",
    link: "",
  });

  // Get progress information
  const getProgressInfo = (taskId) => {
    if (!hasSubmission(taskId)) return { percentage: 0, color: "bg-gray-300" };

    const status = getSubmissionStatus(taskId);
    switch (status) {
      case "pending":
        return { percentage: 75, color: "bg-amber-400" };
      case "approved":
        return { percentage: 100, color: "bg-emerald-500" };
      case "rejected":
        return { percentage: 35, color: "bg-rose-500" };
      default:
        return { percentage: 0, color: "bg-gray-300" };
    }
  };

  // Handle submission
  const handleSubmitTask = (e) => {
    e.preventDefault();
    const newSubmissionObj = {
      id: submissions.length + 1,
      taskId: parseInt(newSubmission.taskId),
      link: newSubmission.link,
      status: "pending",
      dateSubmitted: new Date().toISOString().split("T")[0],
    };

    setSubmissions([...submissions, newSubmissionObj]);
    setNewSubmission({ taskId: "", link: "" });
  };

  // Check if task has submission
  const hasSubmission = (taskId) => {
    return submissions.some((sub) => sub.taskId === taskId);
  };

  // Get submission status
  const getSubmissionStatus = (taskId) => {
    const submission = submissions.find((sub) => sub.taskId === taskId);
    return submission ? submission.status : null;
  };

  const navigate = useNavigate();

  // Redux state
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { students } = useSelector((store) => store.student);




  return (
    <Navbar>
      {/* Header */}
      <div className="leaderboard">
        <Header Title={"My Task"} Address={"My Task"} />
      </div>

      <div className="leaderboardData px-4">
        {/* Task List */}
        <div className="task-container">
          {/* Submit Task Form (when active) */}
          {newSubmission.taskId && (
            <div className="submission-form">
              <div className="form-header">
                <h2 className="form-title">
                  Submit Task:{" "}
                  {tasks.find((t) => t.id === parseInt(newSubmission.taskId))?.title}
                </h2>
                <button
                  onClick={() => setNewSubmission({ taskId: "", link: "" })}
                  className="close-button"
                >
                  <svg className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmitTask}>
                <div className="form-group">
                  <label className="form-label">
                    Submission Link
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={newSubmission.link}
                    onChange={(e) =>
                      setNewSubmission({
                        ...newSubmission,
                        link: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="form-hint">
                    Provide a link to your completed work (Google Docs, GitHub, etc.)
                  </p>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setNewSubmission({ taskId: "", link: "" })}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                  >
                    Submit Task
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tasks Section */}
          <div className="tasks-section">
            <div className="section-header">
              <h2 className="section-title">Your Tasks</h2>
            </div>
            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">No tasks assigned to you</p>
                </div>
              ) : (
                tasks.map((task) => {
                  const progress = getProgressInfo(task.id);
                  const status = getSubmissionStatus(task.id);

                  return (
                    <div key={task.id} className="task-item">
                      <div className="task-header">
                        <div className="task-info">
                          <h3 className="task-title">
                            {task.title}
                          </h3>
                          <p className="task-meta">
                            Assigned by {task.assignedBy} on {task.dateAssigned}
                          </p>
                          <p className="task-description">
                            {task.description}
                          </p>
                        </div>
                        {status && (
                          <span
                            className={`status-badge ${status === "pending"
                              ? "status-pending"
                              : status === "approved"
                                ? "status-approved"
                                : "status-rejected"
                              }`}
                          >
                            {status}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="progress-container">
                        <div className="progress-labels">
                          <span className="progress-label">Progress</span>
                          <span className="progress-percentage">
                            {progress.percentage}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${progress.color}`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="task-actions">
                        <a
                          href={task.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-button"
                        >
                          <svg
                            className="download-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </a>
                        {!status ? (
                          <button
                            onClick={() =>
                              setNewSubmission({
                                ...newSubmission,
                                taskId: task.id.toString(),
                              })
                            }
                            className="submit-task-button"
                          >
                            Submit Task
                          </button>
                        ) : (
                          status === "pending" && (
                            <span className="pending-status">
                              Under review
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>


    </Navbar>
  );
};

export default MyTask;
