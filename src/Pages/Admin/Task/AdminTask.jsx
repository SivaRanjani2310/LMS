import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import "./AdminTask.css";

const baseUrl = import.meta.env.VITE_API_URL;

const AdminTask = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState({
    tasks: true,
    users: true,
    submitting: false,
    reviewing: false,
  });

  const [newTask, setNewTask] = useState({
    title: "",
    maxMarks: "",
    description: "",
    dueDate: "",
    file: "",
    assignedTo: [],
  });

  const [activeTab, setActiveTab] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState("");

  // Get token from localStorage
  const getToken = () => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    return loginData?.token || null;
  };

  const token = getToken();

  // Enhanced empty state messages
  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case "pending": return "No pending tasks found";
      case "in-progress": return "No tasks in progress";
      case "completed": return "No completed tasks yet";
      default: return "No tasks have been created yet";
    }
  };

  const getEmptyUsersMessage = () => "No approved users available for assignment";

  // Verify token is valid
  const verifyToken = () => {
    if (!token) {
      toast.error("Authentication required. Please login.");
      return false;
    }
    return true;
  };

  // Handle API errors
  const handleApiError = (error, context) => {
    console.error(`Error ${context}:`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else {
      toast.error(`Failed ${context}. Please try again.`);
    }
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!verifyToken()) return;
      
      setIsLoading(prev => ({...prev, users: true}));
      try {
        const response = await axios.get(`${baseUrl}/api/users/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        handleApiError(error, "fetching users");
      } finally {
        setIsLoading(prev => ({...prev, users: false}));
      }
    };

    fetchUsers();
  }, [token]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!verifyToken()) return;
      
      setIsLoading(prev => ({...prev, tasks: true}));
      try {
        const response = await axios.get(`${baseUrl}/api/tasks/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch (error) {
        handleApiError(error, "fetching tasks");
      } finally {
        setIsLoading(prev => ({...prev, tasks: false}));
      }
    };

    fetchTasks();
  }, [token]);

  // Create task
  const createTask = async (taskData) => {
    if (!verifyToken()) return null;
    
    setIsLoading(prev => ({...prev, submitting: true}));
    try {
      const response = await axios.post(`${baseUrl}/api/tasks/`, taskData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Task created successfully!");
      return response.data.task;
    } catch (error) {
      handleApiError(error, "creating task");
      return null;
    } finally {
      setIsLoading(prev => ({...prev, submitting: false}));
    }
  };

  // Review submission
  const reviewSubmission = async (taskId, userId, reviewData) => {
    if (!verifyToken()) return null;
    
    setIsLoading(prev => ({...prev, reviewing: true}));
    try {
      const response = await axios.put(
        `${baseUrl}/api/tasks/review/${taskId}/${userId}`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Submission reviewed successfully!");
      return response.data.submission;
    } catch (error) {
      handleApiError(error, "reviewing submission");
      return null;
    } finally {
      setIsLoading(prev => ({...prev, reviewing: false}));
    }
  };

  // Handle form submission
  const handleAssignTask = async (e) => {
    e.preventDefault();
    
    if (newTask.assignedTo.length === 0) {
      toast.error("Please select at least one user to assign the task");
      return;
    }

    const taskData = {
      title: newTask.title,
      maxMarks: newTask.maxMarks,
      description: newTask.description,
      dueDate: newTask.dueDate,
      file: newTask.file,
      assignedTo: newTask.assignedTo,
    };

    try {
      const createdTask = await createTask(taskData);
      if (createdTask) {
        setTasks([...tasks, createdTask]);
        setNewTask({
          title: "",
          maxMarks: "",
          description: "",
          dueDate: "",
          file: "",
          assignedTo: [],
        });
      }
    } catch (error) {
      console.error("Task assignment failed:", error);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    setNewTask({ ...newTask, file: e.target.value });
  };

  // Handle user selection
  const handleUserSelection = (userId) => {
    setNewTask(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId]
    }));
  };

  // Handle submission review
  const handleReviewSubmission = async (submission, action) => {
    const reviewData = {
      status: action,
      markGiven: action === "approved" ? parseInt(marks) : 0,
      reviewNote: feedback,
    };

    try {
      const reviewedSubmission = await reviewSubmission(
        submission.taskId,
        submission.user._id,
        reviewData
      );
      
      if (reviewedSubmission) {
        const updatedTasks = tasks.map(task => 
          task._id === submission.taskId ? {
            ...task,
            mySubmission: reviewedSubmission,
            status: action === "approved" ? "completed" : task.status,
          } : task
        );
        
        setTasks(updatedTasks);
        setSelectedSubmission(null);
        setFeedback("");
        setMarks("");
      }
    } catch (error) {
      console.error("Submission review failed:", error);
    }
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => 
    activeTab === "all" || task.status === activeTab
  );

  // Get username by ID
  const getUserName = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.username : "Unknown User";
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
                {/* Form fields */}
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Marks</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newTask.maxMarks}
                    onChange={(e) => setNewTask({...newTask, maxMarks: e.target.value})}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">File Url</label>
                    <input
                      type="url"
                      className="form-input"
                      value={newTask.file}
                      onChange={handleFileChange}
                      placeholder="https://example.com/file.zip"
                    />
                  </div>
                </div>

                {/* User selection */}
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  {isLoading.users ? (
                    <p>Loading users...</p>
                  ) : users.filter(user => user.isApproved).length === 0 ? (
                    <p className="empty-message">{getEmptyUsersMessage()}</p>
                  ) : (
                    <div className="user-selection-container">
                      {users.filter(user => user.isApproved).map(user => (
                        <div key={user._id} className="user-checkbox-item">
                          <input
                            type="checkbox"
                            id={`user-${user._id}`}
                            checked={newTask.assignedTo.includes(user._id)}
                            onChange={() => handleUserSelection(user._id)}
                          />
                          <label htmlFor={`user-${user._id}`}>
                            {user.username} ({user.email}) - {user.role}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="assign-button"
                  disabled={isLoading.submitting || newTask.assignedTo.length === 0}
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
                  {["all", "pending", "in-progress", "completed"].map(tab => (
                    <button
                      key={tab}
                      className={`tab-button ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task List Content */}
              {isLoading.tasks ? (
                <div className="loading-state">
                  <p>Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-message">{getEmptyStateMessage()}</p>
                </div>
              ) : (
                <div className="task-list">
                  {filteredTasks.map(task => (
                    <TaskItem 
                      key={task._id}
                      task={task}
                      getUserName={getUserName}
                      selectedSubmission={selectedSubmission}
                      setSelectedSubmission={setSelectedSubmission}
                      feedback={feedback}
                      setFeedback={setFeedback}
                      marks={marks}
                      setMarks={setMarks}
                      isLoading={isLoading}
                      handleReviewSubmission={handleReviewSubmission}
                    />
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

// Separate component for task item
const TaskItem = ({
  task,
  getUserName,
  selectedSubmission,
  setSelectedSubmission,
  feedback,
  setFeedback,
  marks,
  setMarks,
  isLoading,
  handleReviewSubmission
}) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`status-badge status-${task.status}`}>
          {task.status}
        </span>
      </div>

      <div className="task-meta">
        <p><strong>Max Marks:</strong> {task.maxMarks || "Not specified"}</p>
        <p><strong>Created By:</strong> {getUserName(task.createdBy)}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
        {task.file && (
          <p>
            <strong>File:</strong>{" "}
            <a href={task.file} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </p>
        )}
        {task.assignedTo?.length > 0 && (
          <p>
            <strong>Assigned To:</strong>{" "}
            {task.assignedTo.map(user => getUserName(user.user)).join(", ")}
          </p>
        )}
      </div>

      <p className="task-description">{task.description}</p>

      {/* Submission Section */}
      {task.mySubmission && (
        <div className="submission-section">
          <h4 className="submission-title">Submission</h4>
          <div className="submission-details">
            <p><strong>Submitted By:</strong> {task.mySubmission.username}</p>
            <p><strong>Date Submitted:</strong> {new Date(task.mySubmission.submittedAt).toLocaleString()}</p>
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={task.mySubmission.driveLink || task.mySubmission.file}
                target="_blank"
                rel="noopener noreferrer"
                className="submission-link"
              >
                View Submission
              </a>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`submission-status submission-${task.mySubmission.status}`}>
                {task.mySubmission.status}
              </span>
            </p>
            {task.mySubmission.markGiven && (
              <p><strong>Awarded Marks:</strong> {task.mySubmission.markGiven}</p>
            )}
            {task.mySubmission.reviewNote && (
              <p><strong>Feedback:</strong> {task.mySubmission.reviewNote}</p>
            )}

            {task.mySubmission.status === "submitted" && (
              <div className="submission-actions">
                <button
                  className="approve-button"
                  onClick={() => setSelectedSubmission({
                    taskId: task._id,
                    user: { _id: task.mySubmission.user },
                    ...task.mySubmission
                  })}
                >
                  Review Submission
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedSubmission?.taskId === task._id && (
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
                max={task.maxMarks || "100"}
                placeholder={`Enter marks (max ${task.maxMarks || "100"})`}
              />
            </div>
            <div className="modal-actions">
              <button
                className="reject-button"
                onClick={() => handleReviewSubmission(selectedSubmission, "rejected")}
                disabled={isLoading.reviewing}
              >
                {isLoading.reviewing ? "Processing..." : "Reject"}
              </button>
              <button
                className="approve-button"
                onClick={() => handleReviewSubmission(selectedSubmission, "approved")}
                disabled={isLoading.reviewing}
              >
                {isLoading.reviewing ? "Processing..." : "Approve with Marks"}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setSelectedSubmission(null);
                  setFeedback("");
                  setMarks("");
                }}
                disabled={isLoading.reviewing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTask;