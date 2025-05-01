import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStudentData } from "../../Redux/student/action";
import axios from "axios";

import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./MyTask.css";

const MyTask = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newSubmission, setNewSubmission] = useState({
    taskId: "",
    link: "",
  });

  // Get token from localStorage
  const getToken = () => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    return loginData?.token || null;
  };

  const token = getToken();
  const navigate = useNavigate();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/tasks/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
      
      // Extract submissions from tasks
      const taskSubmissions = response.data
        .filter(task => task.mySubmission)
        .map(task => ({
          id: task._id,
          taskId: task._id,
          link: task.mySubmission.driveLink || task.mySubmission.file,
          status: task.mySubmission.status,
          dateSubmitted: task.mySubmission.submittedAt,
        }));
      
      setSubmissions(taskSubmissions);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch tasks");
      if (err.response?.status === 401) {
        // Handle unauthorized (token expired/invalid)
        localStorage.removeItem("loginData");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    const fetchData = async () => {
      await fetchTasks();
      await fetchUsers();
    };
    
    fetchData();
  }, [token, navigate]);

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
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      const taskId = newSubmission.taskId;
      const response = await axios.post(
        `${baseUrl}/api/tasks/${taskId}/submit`,
        {
          driveLink: newSubmission.link,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state with the new submission
      const newSubmissionObj = {
        id: response.data._id,
        taskId: taskId,
        link: newSubmission.link,
        status: "pending",
        dateSubmitted: new Date().toISOString(),
      };

      setSubmissions([...submissions, newSubmissionObj]);
      setNewSubmission({ taskId: "", link: "" });
      
      // Refresh tasks
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit task");
    }
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

  if (loading) {
    return <div className="loading-container">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

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
                  {tasks.find((t) => t._id === newSubmission.taskId)?.title}
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
           
            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">No tasks assigned to you</p>
                </div>
              ) : (
                tasks.map((task) => {
                  const progress = getProgressInfo(task._id);
                  const status = getSubmissionStatus(task._id);

                  return (
                    <div key={task._id} className="task-item">
                      <div className="task-header">
                        <div className="task-info">
                          <h3 className="task-title">
                            {task.title}
                          </h3>
                          <p className="task-meta">
                            Due date: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                          <p className="task-description">
                            {task.description}
                          </p>
                          {task.maxMarks && (
                            <p className="task-meta">
                              Max marks: {task.maxMarks}
                            </p>
                          )}
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
                        {task.file && (
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
                        )}
                        {!status ? (
                          <button
                            onClick={() =>
                              setNewSubmission({
                                ...newSubmission,
                                taskId: task._id,
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