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
    uploading: false,
  });

  const [newTask, setNewTask] = useState({
    title: "",
    maxMarks: "",
    description: "",
    dueDate: "",
    fileUrl: "",
    file: null,
    assignedTo: "all",
    selectedUsers: [],
  });

  const [activeTab, setActiveTab] = useState("all");
  const [filePreview, setFilePreview] = useState(null);
  
  // Review modal state
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    taskId: "",
    userId: "",
    username: "",
    maxMarks: 100,
    currentData: {
      status: "approved",
      markGiven: "",
      reviewNote: "",
    }
  });

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

  // Fetch tasks with submissions
  useEffect(() => {
    const fetchTasks = async () => {
      if (!verifyToken()) return;
      
      setIsLoading(prev => ({...prev, tasks: true}));
      try {
        const response = await axios.get(`${baseUrl}/api/tasks/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Transform tasks to include submissions
        const tasksWithSubmissions = await Promise.all(
          response.data.map(async task => {
            try {
              const taskResponse = await axios.get(`${baseUrl}/api/tasks/${task._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              return taskResponse.data;
            } catch (error) {
              return task; // Return basic task if details fetch fails
            }
          })
        );
        setTasks(tasksWithSubmissions);
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

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setNewTask(prev => ({ 
      ...prev, 
      file
    }));
    setFilePreview(file.name);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    
    let assignedUsers = [];
    if (newTask.assignedTo === "all") {
      assignedUsers = users.filter(user => user.isApproved).map(user => user._id);
    } else {
      assignedUsers = newTask.selectedUsers;
    }
  
    if (assignedUsers.length === 0) {
      toast.error("Please select at least one user to assign the task");
      return;
    }
  
    // Updated validation logic for file options
    if (newTask.fileUrl && newTask.file) {
      toast.error("Please provide either a file URL OR upload a file, not both");
      return;
    }
  
    if (!newTask.fileUrl && !newTask.file) {
      toast.error("Please provide either a file URL or upload a file");
      return;
    }
  
    setIsLoading(prev => ({...prev, submitting: true}));
  
    try {
      let fileUrl = newTask.fileUrl;
      
      // Only upload if there's a file and no URL
      if (newTask.file && !newTask.fileUrl) {
        const formData = new FormData();
        formData.append('file', newTask.file);
  
        const uploadResponse = await axios.post(`${baseUrl}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        
        fileUrl = uploadResponse.data.fileUrl;
        toast.success("File uploaded successfully!"); 
      }
  
      const taskData = {
        title: newTask.title,
        maxMarks: newTask.maxMarks,
        description: newTask.description,
        dueDate: newTask.dueDate,
        file: fileUrl,
        assignedTo: assignedUsers,
      };
  
      const createdTask = await createTask(taskData);
      if (createdTask) {
        const taskResponse = await axios.get(`${baseUrl}/api/tasks/${createdTask._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTasks([taskResponse.data, ...tasks]);
        
        setNewTask({
          title: "",
          maxMarks: "",
          description: "",
          dueDate: "",
          fileUrl: "",
          file: null,
          assignedTo: "all",
          selectedUsers: [],
        });
        setFilePreview(null);
        
        const fileInput = document.querySelector('.file-upload-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error("Task assignment failed:", error);
      toast.error("Failed to assign task. Please try again.");
    } finally {
      setIsLoading(prev => ({...prev, submitting: false}));
    }
  };

  // Handle user selection
  const handleUserSelection = (userId) => {
    setNewTask(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  // Handle assignment type change
  const handleAssignmentTypeChange = (type) => {
    setNewTask(prev => ({
      ...prev,
      assignedTo: type,
      selectedUsers: type === "all" ? [] : prev.selectedUsers
    }));
  };

  // Open review modal
  const openReviewModal = (taskId, userId, username, maxMarks, submission) => {
    setReviewModal({
      isOpen: true,
      taskId,
      userId,
      username,
      maxMarks,
      currentData: {
        status: submission?.status || "approved",
        markGiven: submission?.markGiven || "",
        reviewNote: submission?.reviewNote || "",
      },
      submissionData: submission // Add this line to store submission details
    });
  };

  
  // Close review modal
  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      taskId: "",
      userId: "",
      username: "",
      maxMarks: 100,
      currentData: {
        status: "approved",
        markGiven: "",
        reviewNote: ""
      }
    });
  };

  const handleReviewSubmission = async (e) => {
    e.preventDefault();
  
    // Validate inputs more thoroughly
    if (!reviewModal.taskId || !reviewModal.userId) {
      toast.error("Missing task or user information");
      return;
    }
  
    if (!reviewModal.currentData.markGiven || 
        isNaN(reviewModal.currentData.markGiven) ||
        reviewModal.currentData.markGiven === "") {
      toast.error("Please enter valid marks");
      return;
    }
  
    const markGiven = parseInt(reviewModal.currentData.markGiven);
    if (markGiven > reviewModal.maxMarks || markGiven < 0) {
      toast.error(`Marks must be between 0 and ${reviewModal.maxMarks}`);
      return;
    }
  
    setIsLoading(prev => ({...prev, reviewing: true}));
  
    try {
      const response = await axios.put(
        `${baseUrl}/api/tasks/review/${reviewModal.taskId}/${reviewModal.userId}`,
        {
          status: reviewModal.currentData.status,
          markGiven: markGiven,
          reviewNote: reviewModal.currentData.reviewNote || "No feedback provided"
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          } 
        }
      );
  
      // Debugging log
      console.log("Review API Response:", response.data);
  
      // Update the tasks state
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task._id === reviewModal.taskId) {
            const updatedSubmissions = task.submissions.map(sub => 
              sub.user === reviewModal.userId 
                ? { ...sub, ...response.data.submission }
                : sub
            );
            
            return {
              ...task,
              submissions: updatedSubmissions,
              status: updatedSubmissions.every(sub => sub.status === "approved") 
                ? "completed" 
                : task.status
            };
          }
          return task;
        })
      );
  
      toast.success("Submission reviewed successfully!");
      closeReviewModal();
    } catch (error) {
      console.error("Review submission error:", error.response?.data || error.message);
      toast.error(`Failed to review submission: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(prev => ({...prev, reviewing: false}));
    }
  };

  // Handle review form input changes
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewModal(prev => ({
      ...prev,
      currentData: {
        ...prev.currentData,
        [name]: value
      }
    }));
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") {
      return task.submissions?.every(sub => sub.status === "approved");
    }
    return task.status === activeTab;
  });

  // Get username by ID
  const getUserName = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.username : "Unknown User";
  };

  // Add this state to your existing state declarations
const [viewModal, setViewModal] = useState({
  isOpen: false,
  task: null,
  submission: null
});

// Add this function to open the view modal
const openViewModal = (task, submission) => {
  setViewModal({
    isOpen: true,
    task,
    submission
  });
};

// Add this function to close the view modal
const closeViewModal = () => {
  setViewModal({
    isOpen: false,
    task: null,
    submission: null
  });
};

// Add this function to your component
const clearFileSelection = () => {
  setNewTask(prev => ({
    ...prev,
    file: null,  // Clear only the file
    // Don't clear fileUrl here
  }));
  setFilePreview(null);
  
  // Reset the file input value
  const fileInput = document.querySelector('.file-upload-input');
  if (fileInput) fileInput.value = '';
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
                </div>
                
                <div className="form-group">
                  <label className="form-label">File URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={newTask.fileUrl}
                    onChange={(e) => setNewTask(prev => ({
                      ...prev,
                      fileUrl: e.target.value
                    }))}
                    placeholder="https://example.com/file.pdf"
                  />
                </div>


                <div className="form-group">
  <label className="form-label">Upload File</label>
  <div className="file-upload-wrapper">
    <label className="file-upload-label">
      {filePreview || "Choose file..."}
      <input
        type="file"
        className="file-upload-input"
        onChange={handleFileUpload}
        disabled={isLoading.uploading}
      />
    </label>
    {filePreview && (
      <button 
        type="button" 
        className="clear-file-button"
        onClick={clearFileSelection}
        disabled={isLoading.uploading}
      >
        ×
      </button>
    )}
    {isLoading.uploading && (
      <span className="uploading-text">Uploading...</span>
    )}
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
                      <div className="assignment-type-selector">
                        <label>
                          <input
                            type="radio"
                            name="assignmentType"
                            checked={newTask.assignedTo === "all"}
                            onChange={() => handleAssignmentTypeChange("all")}
                          />
                          All Users
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="assignmentType"
                            checked={newTask.assignedTo === "selected"}
                            onChange={() => handleAssignmentTypeChange("selected")}
                          />
                          Select Users
                        </label>
                      </div>

                      {newTask.assignedTo === "selected" && (
                        <div className="user-checkbox-list">
                          {users.filter(user => user.isApproved).map(user => (
                            <div key={user._id} className="user-checkbox-item">
                              <input
                                type="checkbox"
                                id={`user-${user._id}`}
                                checked={newTask.selectedUsers.includes(user._id)}
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
                  )}
                </div>

                <button 
                  type="submit" 
                  className="assign-button"
                  disabled={isLoading.submitting || 
                    (newTask.assignedTo === "selected" && newTask.selectedUsers.length === 0) ||
                    (!newTask.fileUrl && !newTask.file)}
                >
                  {isLoading.submitting ? "Assigning..." : "Assign Task"}
                </button>
              </form>
            </div>

            {/* Task List */}
            <div className="task-management-container">
              <div className="section-header">
                <h2 className="section-title">Assigned Tasks</h2>
                {/* <div className="tabs">
                  {["all", "pending", "in-progress", "completed"].map(tab => (
                    <button
                      key={tab}
                      className={`tab-button ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                    </button>
                  ))}
                </div> */}
              </div>

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
                    <div key={task._id} className="task-card">
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
                            {task.assignedTo.map(userId => getUserName(userId)).join(", ")}
                          </p>
                        )}
                      </div>

                      <p className="task-description">{task.description}</p>

{task.submissions?.map(submission => (
  <div key={submission._id} className="submission-item">
    <div className="submission-header">
      <span className="submission-user">{submission.username}</span>
      <span className={`submission-status submission-${submission.status}`}>
        {submission.status}
      </span>
    </div>
    
    <div className="submission-details">
      <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
      {submission.file && (
        <p>
          <strong>File:</strong>{" "}
          <a
            href={submission.file}
            target="_blank"
            rel="noopener noreferrer"
            className="submission-link"
          >
            View Submission
          </a>
        </p>
      )}
      {submission.markGiven && (
        <p><strong>Marks Awarded:</strong> {submission.markGiven}</p>
      )}
      {submission.reviewNote && (
        <p><strong>Feedback:</strong> {submission.reviewNote}</p>
      )}

      {submission.status === "for_review" && (
        <div className="submission-actions">
          <button
            className="review-button"
            onClick={() => openReviewModal(
              task._id,
              submission.user,
              submission.username,
              task.maxMarks,
              submission // Pass the submission data
            )}
          >
            Review Submission
          </button>
        </div>
      )}

      {submission.status === "approved" && (
        <div className="submission-actions">
          <button
            className="review-button"
            onClick={() => openReviewModal(
              task._id,
              submission.user,
              submission.username,
              task.maxMarks,
              submission // Pass the submission data
            )}
          >
            Review Submission
          </button>

          <button
            className="view-button"
            onClick={() => openViewModal(task, submission)}
          >
            View Details
          </button>
        </div>
      )}
       {submission.status === "rejected" && (
        <div className="submission-actions">
          <button
            className="review-button"
            onClick={() => openReviewModal(
              task._id,
              submission.user,
              submission.username,
              task.maxMarks,
              submission // Pass the submission data
            )}
          >
            Review Submission
          </button>
          
          <button
            className="view-button"
            onClick={() => openViewModal(task, submission)}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  </div>
))}


                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {reviewModal.isOpen && (
  <div className="modal-overlay">
    <div className="modal-container">
      <div className="modal-header">
        <h3>Review Submission from {reviewModal.username}</h3>
        <button 
          className="modal-close-button"
          onClick={closeReviewModal}
        >
          &times;
        </button>
      </div>

      {/* Submission Details Section */}
      {reviewModal.submissionData && (
        <div className="submission-preview">
          <h4>Submission Details</h4>
          <div className="submission-details-grid">
            <div>
              <p><strong>Submitted At:</strong> {new Date(reviewModal.submissionData.submittedAt).toLocaleString()}</p>
              {reviewModal.submissionData.file && (
                <p>
                  <strong>File:</strong>{" "}
                  <a 
                    href={reviewModal.submissionData.file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="submission-link"
                  >
                    Download Submission
                  </a>
                </p>
              )}
            </div>
            <div>
              {reviewModal.submissionData.driveLink && (
                <p>
                  <strong>Drive Link:</strong>{" "}
                  <a 
                    href={reviewModal.submissionData.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="submission-link"
                  >
                    View on Google Drive
                  </a>
                </p>
              )}
              {reviewModal.submissionData.note && (
                <p><strong>Student Note:</strong> {reviewModal.submissionData.note}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleReviewSubmission} className="review-form">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={reviewModal.currentData.status}
            onChange={handleReviewInputChange}
            className="form-select"
          >
            <option value="" selected >-Select Status-</option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Marks (Max: {reviewModal.maxMarks})
          </label>
          <input
            type="number"
            name="markGiven"
            className="form-input"
            value={reviewModal.currentData.markGiven}
            onChange={handleReviewInputChange}
            min="0"
            max={reviewModal.maxMarks}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Feedback</label>
          <textarea
            name="reviewNote"
            className="form-textarea"
            value={reviewModal.currentData.reviewNote}
            onChange={handleReviewInputChange}
            placeholder="Provide detailed feedback..."
            rows="4"
            required
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={closeReviewModal}
            disabled={isLoading.reviewing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading.reviewing}
          >
            {isLoading.reviewing ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{viewModal.isOpen && (
  <div className="modal-overlay">
    <div className="modal-container">
      <div className="modal-header">
        <h3>Submission Details</h3>
        <button 
          className="modal-close-button"
          onClick={closeViewModal}
        >
          &times;
        </button>
      </div>
      
      <div className="view-modal-content">
        {viewModal.task && (
          <>
            <div className="view-modal-section">
              <h4>Task Information</h4>
              <p><strong>Title:</strong> {viewModal.task.title}</p>
              <p><strong>Description:</strong> {viewModal.task.description}</p>
              <p><strong>Max Marks:</strong> {viewModal.task.maxMarks}</p>
              <p><strong>Due Date:</strong> {new Date(viewModal.task.dueDate).toLocaleDateString()}</p>
              {viewModal.task.file && (
                <p>
                  <strong>Task File:</strong>{" "}
                  <a href={viewModal.task.file} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </p>
              )}
            </div>

            {viewModal.submission && (
              <div className="view-modal-section">
                <h4>Submission Details</h4>
                <p><strong>Submitted By:</strong> {viewModal.submission.username}</p>
                <p><strong>Submitted At:</strong> {new Date(viewModal.submission.submittedAt).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className={`status-badge status-${viewModal.submission.status}`}>
                  {viewModal.submission.status}
                </span></p>
                <p><strong>Marks Obtained:</strong> {viewModal.submission.markGiven}/{viewModal.task.maxMarks}</p>
                <p><strong>Feedback:</strong> {viewModal.submission.reviewNote}</p>
                {viewModal.submission.file && (
                  <p>
                    <strong>Submission File:</strong>{" "}
                    <a href={viewModal.submission.file} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </p>
                )}
                {viewModal.submission.driveLink && (
                  <p>
                    <strong>Drive Link:</strong>{" "}
                    <a href={viewModal.submission.driveLink} target="_blank" rel="noopener noreferrer">
                      View on Drive
                    </a>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn-cancel"
          onClick={closeViewModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
        </main>
      </div>
    </AdminNavbar>
  );
};

export default AdminTask;