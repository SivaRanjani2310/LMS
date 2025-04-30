import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";

// CSS imports
import "./AdminTask.css"
import Marks from "../../Marks/Marks";

const baseUrl = import.meta.env.VITE_API_URL;

const AdminTaskPage = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState({
    tasks: true,
    users: true,
    submitting: false,
  });

  const [newTask, setNewTask] = useState({
    title: "",
    marks: "",
    description: "",
    assignedTo: "",
    deadline: "",
    file: null,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchTasks(), fetchUsers()]);
      } catch (error) {
        toast.error("Failed to load data. Please try again later.");
      }
    };
    
    fetchData();
  }, []);

  // API functions
  const fetchTasks = async () => {
    setIsLoading(prev => ({...prev, tasks: true}));
    try {
      const response = await axios.POST(`${baseUrl}/api/tasks/`);
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks. Please try again.");
      throw error;
    } finally {
      setIsLoading(prev => ({...prev, tasks: false}));
    }
  };

  const fetchUsers = async () => {
    setIsLoading(prev => ({...prev, users: true}));
    try {
      const response = await axios.get(`${baseUrl}/api/users/`);
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users. Please try again.");
      throw error;
    } finally {
      setIsLoading(prev => ({...prev, users: false}));
    }
  };

  const createTask = async (taskData) => {
    setIsLoading(prev => ({...prev, submitting: true}));
    try {
      const response = await axios.post(`${baseUrl}/api/tasks/`, taskData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success("Task created successfully!");
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create task";
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(prev => ({...prev, submitting: false}));
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title: newTask.title,
      marks: newTask.marks,
      description: newTask.description,
      assignedTo: parseInt(newTask.assignedTo),
      deadline: newTask.deadline,
      status: "pending",
    };

    try {
      const createdTask = await createTask(taskData);
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: "",
        marks: "",
        description: "",
        assignedTo: "",
        deadline: "",
        file: null,
      });
    } catch (error) {
      // Error is already handled by createTask
    }
  };

  const handleFileChange = (e) => {
    setNewTask({ ...newTask, file: e.target.files[0] });
  };

  const handleReviewSubmission = (submissionId, action) => {
    const updatedSubmissions = submissions.map((sub) => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: action,
          feedback: action === "rejected" ? feedback : "",
          marks: action === "approved" ? marks : sub.marks,
        };
      }
      return sub;
    });

    if (action === "approved") {
      const submission = submissions.find((sub) => sub.id === submissionId);
      const updatedTasks = tasks.map((task) => {
        if (task.id === submission.taskId) {
          return { ...task, status: "completed" };
        }
        return task;
      });
      setTasks(updatedTasks);
      toast.success("Submission approved and marked!");
    } else if (action === "rejected") {
      toast.warning("Submission rejected.");
    }

    setSubmissions(updatedSubmissions);
    setSelectedSubmission(null);
    setFeedback("");
    setMarks("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    return task.status === activeTab;
  });

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getSubmissionStatus = (taskId) => {
    const submission = submissions.find((sub) => sub.taskId === taskId);
    return submission ? submission.status : null;
  };

  return (
    <AdminNavbar>
      <div className="admin">
        <Header Title={"Add Task"} Address={"Tasks"} />
        <ToastContainer position="top-right" autoClose={5000} />
        
        <main>
          <div className="admin-panel">
            {/* Task Assignment Form */}
            <div className="assignment-form-container">
              <h2 className="section-title">Assign New Task</h2>
              <form onSubmit={handleAssignTask} className="assignment-form">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Marks Input Field */}
                <div className="form-group">
                  <label className="form-label">Marks</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newTask.marks}
                    onChange={(e) =>
                      setNewTask({ ...newTask, marks: e.target.value })
                    }
                    required
                    min="0"
                    max="100"
                    placeholder="Enter marks (0-100)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Assign To</label>
                    <select
                      className="form-select"
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value })
                      }
                      required
                      disabled={isLoading.users}
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    {isLoading.users && <small>Loading users...</small>}
                  </div>
                  

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newTask.deadline}
                      onChange={(e) =>
                        setNewTask({ ...newTask, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Attach File (Optional)</label>
                  <input
                    type="file"
                    className="form-file"
                    onChange={handleFileChange}
                  />
                </div>

                <button 
                  type="submit" 
                  className="assign-button"
                  disabled={isLoading.submitting}
                >
                  {isLoading.submitting ? "Assigning..." : "Assign Task"}
                </button>
              </form>
            </div>

            {/* Task List */}
            <div className="task-management-container">
              <div className="section-header">
                <h2 className="section-title">Assigned Tasks</h2>
                <div className="tabs">
                  <button
                    className={`tab-button ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Tasks
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "pending" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "in-progress" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("in-progress")}
                  >
                    In Progress
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "completed" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("completed")}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {isLoading.tasks ? (
                <div className="loading-state">
                  <p>Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <p>No tasks found for this category</p>
                </div>
              ) : (
                <div className="task-list">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <h3 className="task-title">{task.title}</h3>
                        <span className={`status-badge status-${task.status}`}>
                          {task.status}
                        </span>
                      </div>

                      <div className="task-meta">
                        <p>
                          <strong>Marks:</strong> {task.marks || "Not specified"}
                        </p>
                        <p>
                          <strong>Assigned to:</strong> {getUserName(task.assignedTo)}
                        </p>
                        <p>
                          <strong>Deadline:</strong> {task.deadline}
                        </p>
                        {task.file && (
                          <p>
                            <strong>File:</strong> {task.file}
                          </p>
                        )}
                      </div>

                      <p className="task-description">{task.description}</p>

                      {/* Submission Section */}
                      {getSubmissionStatus(task.id) && (
                        <div className="submission-section">
                          <h4 className="submission-title">Submission</h4>
                          {submissions
                            .filter((sub) => sub.taskId === task.id)
                            .map((submission) => (
                              <div key={submission.id} className="submission-details">
                                <p>
                                  <strong>Date Submitted:</strong>{" "}
                                  {submission.dateSubmitted}
                                </p>
                                <p>
                                  <strong>Link:</strong>{" "}
                                  <a
                                    href={submission.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="submission-link"
                                  >
                                    View Submission
                                  </a>
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  <span className={`submission-status submission-${submission.status}`}>
                                    {submission.status}
                                  </span>
                                </p>
                                {submission.marks && (
                                  <p>
                                    <strong>Awarded Marks:</strong> {submission.marks}
                                  </p>
                                )}

                                {submission.status === "submitted" && (
                                  <div className="submission-actions">
                                    <button
                                      className="approve-button"
                                      onClick={() => {
                                        setSelectedSubmission(submission.id);
                                      }}
                                    >
                                      Review Submission
                                    </button>
                                  </div>
                                )}

                                {submission.feedback && (
                                  <div className="feedback-section">
                                    <p>
                                      <strong>Feedback:</strong> {submission.feedback}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {selectedSubmission && submissions.some(sub => sub.id === selectedSubmission && sub.taskId === task.id) && (
                        <div className="review-modal">
                          <div className="modal-content">
                            <h4>Review Submission</h4>
                            <div className="form-group">
                              <label className="form-label">Feedback</label>
                              <textarea
                                className="feedback-textarea"
                                placeholder="Enter your feedback here..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Award Marks</label>
                              <input
                                type="number"
                                className="form-input"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                min="0"
                                max={task.marks || "100"}
                                placeholder={`Enter marks (max ${task.marks || "100"})`}
                              />
                            </div>
                            <div className="modal-actions">
                              <button
                                className="reject-button"
                                onClick={() =>
                                  handleReviewSubmission(selectedSubmission, "rejected")
                                }
                              >
                                Reject
                              </button>
                              <button
                                className="approve-button"
                                onClick={() =>
                                  handleReviewSubmission(selectedSubmission, "approved")
                                }
                              >
                                Approve with Marks
                              </button>
                              <button
                                className="cancel-button"
                                onClick={() => {
                                  setSelectedSubmission(null);
                                  setFeedback("");
                                  setMarks("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AdminNavbar>
  );
};

export default AdminTaskPage;