import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./MyTask.css";

const MyTask = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Submission state
  const [newSubmission, setNewSubmission] = useState({
    taskId: "",
    driveLink: "",
    file: ""
  });
  
  // Review state
  const [reviewData, setReviewData] = useState({
    taskId: "",
    userId: "",
    status: "approved",
    markGiven: "",
    reviewNote: ""
  });
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

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
          id: task.mySubmission._id,
          taskId: task._id,
          link: task.mySubmission.driveLink || task.mySubmission.file,
          status: task.mySubmission.status,
          dateSubmitted: task.mySubmission.submittedAt,
          markGiven: task.mySubmission.markGiven,
          reviewNote: task.mySubmission.reviewNote,
          userId: task.mySubmission.user?._id,
          reviewedBy: task.mySubmission.reviewedBy
        }));
      
      setSubmissions(taskSubmissions);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch tasks";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("loginData");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [token, navigate]);

  const getProgressInfo = (taskId) => {
    if (!hasSubmission(taskId)) return { percentage: 0, color: "bg-gray-300" };

    const status = getSubmissionStatus(taskId);
    switch (status) {
      case "for_review": return { percentage: 75, color: "bg-amber-400" };
      case "approved": return { percentage: 100, color: "bg-emerald-500" };
      case "rejected": return { percentage: 35, color: "bg-rose-500" };
      default: return { percentage: 0, color: "bg-gray-300" };
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      const taskId = newSubmission.taskId;
      
      if (!newSubmission.driveLink && !newSubmission.file) {
        toast.error("Please provide either a Drive link or file URL");
        return;
      }

      const submissionData = {
        ...(newSubmission.driveLink && { driveLink: newSubmission.driveLink }),
        ...(newSubmission.file && { file: newSubmission.file })
      };

      const response = await axios.post(
        `${baseUrl}/api/tasks/submit/${taskId}`,
        submissionData,
        { 
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      // Handle successful submission
      const newSubmissionObj = {
        id: response.data.submission._id,
        taskId: taskId,
        link: response.data.submission.driveLink || response.data.submission.file,
        status: response.data.submission.status,
        dateSubmitted: response.data.submission.submittedAt,
        userId: response.data.submission.user,
        markGiven: response.data.submission.markGiven,
        reviewNote: response.data.submission.reviewNote
      };

      // Update submissions state
      const existingSubmissionIndex = submissions.findIndex(sub => sub.taskId === taskId);
      if (existingSubmissionIndex >= 0) {
        const updatedSubmissions = [...submissions];
        updatedSubmissions[existingSubmissionIndex] = newSubmissionObj;
        setSubmissions(updatedSubmissions);
      } else {
        setSubmissions([...submissions, newSubmissionObj]);
      }
      
      setNewSubmission({ taskId: "", driveLink: "", file: "" });
      toast.success(response.data.message || "Task submitted successfully!");
      await fetchTasks();
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to submit task";
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem("loginData");
        navigate("/login");
      }
    }
  };

  const handleReviewSubmission = async (e) => {
    e.preventDefault();
    try {
      const { taskId, userId, status, markGiven, reviewNote } = reviewData;

      if (!markGiven || isNaN(markGiven)) {
        toast.error("Please enter valid marks");
        return;
      }

      const response = await axios.put(
        `${baseUrl}/api/tasks/review/${taskId}/${userId}`,
        { 
          status, 
          markGiven: parseInt(markGiven), 
          reviewNote 
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      // Update the submission in state
      const updatedSubmissions = submissions.map(sub => {
        if (sub.taskId === taskId) {
          return {
            ...sub,
            status: response.data.submission.status,
            markGiven: response.data.submission.markGiven,
            reviewNote: response.data.submission.reviewNote,
            reviewedBy: response.data.submission.reviewedBy
          };
        }
        return sub;
      });

      setSubmissions(updatedSubmissions);
      setReviewData({
        taskId: "",
        userId: "",
        status: "approved",
        markGiven: "",
        reviewNote: ""
      });
      setShowReviewForm(false);
      
      toast.success(response.data.message || "Review submitted successfully!");
      await fetchTasks();
    } catch (err) {
      console.error("Review error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to submit review";
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem("loginData");
        navigate("/login");
      }
    }
  };

  const hasSubmission = (taskId) => submissions.some((sub) => sub.taskId === taskId);
  const getSubmissionStatus = (taskId) => {
    const submission = submissions.find((sub) => sub.taskId === taskId);
    return submission ? submission.status : null;
  };

  const openReviewForm = (taskId, userId) => {
    setReviewData({
      ...reviewData,
      taskId,
      userId
    });
    setShowReviewForm(true);
  };

  const openTaskDetails = (task) => {
    setActiveTask(task);
  };

  const closeTaskDetails = () => {
    setActiveTask(null);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Loading tasks...</p>
    </div>
  );

  return (
    <Navbar>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="leaderboard">
        <Header Title={"My Task"} Address={"My Task"} />
      </div>

      <div className="leaderboardData px-4">
        <div className="task-container">
          {/* Submission Form */}
          {newSubmission.taskId && (
            <div className="modal-overlay">
              <div className="submission-form">
                <div className="form-header">
                  <h2 className="form-title">
                    Submit Task: {tasks.find(t => t._id === newSubmission.taskId)?.title}
                  </h2>
                  <button onClick={() => setNewSubmission({ taskId: "", driveLink: "", file: "" })} className="close-button">
                    <svg className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmitTask}>
                  <div className="form-group">
                    <label className="form-label">Google Drive Link</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://drive.google.com/..."
                      value={newSubmission.driveLink}
                      onChange={(e) => setNewSubmission({ ...newSubmission, driveLink: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">OR Direct File URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://example.com/file.zip"
                      value={newSubmission.file}
                      onChange={(e) => setNewSubmission({ ...newSubmission, file: e.target.value })}
                    />
                    <p className="form-hint">Provide either a Drive link or a direct file URL</p>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setNewSubmission({ taskId: "", driveLink: "", file: "" })} className="cancel-button">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={!newSubmission.driveLink && !newSubmission.file}
                    >
                      Submit Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="modal-overlay">
              <div className="submission-form">
                <div className="form-header">
                  <h2 className="form-title">Review Submission</h2>
                  <button onClick={() => setShowReviewForm(false)} className="close-button">
                    <svg className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleReviewSubmission}>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={reviewData.status}
                      onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                      required
                    >
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Marks Given</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter marks"
                      value={reviewData.markGiven}
                      onChange={(e) => setReviewData({ ...reviewData, markGiven: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Review Notes</label>
                    <textarea
                      className="form-input"
                      placeholder="Add your review notes..."
                      value={reviewData.reviewNote}
                      onChange={(e) => setReviewData({ ...reviewData, reviewNote: e.target.value })}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowReviewForm(false)} className="cancel-button">
                      Cancel
                    </button>
                    <button type="submit" className="submit-button">
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Task Details Modal */}
          {activeTask && (
            <div className="modal-overlay">
              <div className="task-details-modal">
                <div className="modal-header">
                  <h2>{activeTask.title}</h2>
                  <button onClick={closeTaskDetails} className="close-button">
                    <svg className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="modal-body">
                  <p><strong>Description:</strong> {activeTask.description}</p>
                  <p><strong>Due Date:</strong> {new Date(activeTask.dueDate).toLocaleDateString()}</p>
                  {activeTask.maxMarks && <p><strong>Max Marks:</strong> {activeTask.maxMarks}</p>}
                  {activeTask.file && (
                    <div className="file-download">
                      <a href={activeTask.file} target="_blank" rel="noopener noreferrer" className="download-link">
                        <svg className="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Task File
                      </a>
                    </div>
                  )}
                  {hasSubmission(activeTask._id) && (
                    <div className="submission-details">
                      <h3>Your Submission</h3>
                      <p><strong>Status:</strong> <span className={`status-badge ${getSubmissionStatus(activeTask._id)}`}>
                        {getSubmissionStatus(activeTask._id) === "for_review" ? "Under Review" : 
                         getSubmissionStatus(activeTask._id)?.charAt(0).toUpperCase() + getSubmissionStatus(activeTask._id)?.slice(1)}
                      </span></p>
                      <p><strong>Submitted On:</strong> {
                        new Date(
                          submissions.find(sub => sub.taskId === activeTask._id)?.dateSubmitted
                        ).toLocaleString()
                      }</p>
                      <p><strong>Submission Link:</strong> 
                        <a href={submissions.find(sub => sub.taskId === activeTask._id)?.link} target="_blank" rel="noopener noreferrer" className="submission-link">
                          {submissions.find(sub => sub.taskId === activeTask._id)?.link}
                        </a>
                      </p>
                      {submissions.find(sub => sub.taskId === activeTask._id)?.markGiven && (
                        <p><strong>Marks Obtained:</strong> {submissions.find(sub => sub.taskId === activeTask._id)?.markGiven}</p>
                      )}
                      {submissions.find(sub => sub.taskId === activeTask._id)?.reviewNote && (
                        <p><strong>Feedback:</strong> {submissions.find(sub => sub.taskId === activeTask._id)?.reviewNote}</p>
                      )}
                      {submissions.find(sub => sub.taskId === activeTask._id)?.reviewedBy && (
                        <p><strong>Reviewed By:</strong> {submissions.find(sub => sub.taskId === activeTask._id)?.reviewedBy}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button onClick={closeTaskDetails} className="close-modal-button">
                    Close
                  </button>
                  {!hasSubmission(activeTask._id) && (
                    <button 
                      onClick={() => {
                        closeTaskDetails();
                        setNewSubmission({ ...newSubmission, taskId: activeTask._id });
                      }}
                      className="submit-modal-button"
                    >
                      Submit Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Task List */}
          <div className="tasks-section">
            <div className="tasks-header">
              <h2>My Tasks</h2>
              {/* <div className="task-filters">
                <button className="filter-button active">All</button>
                <button className="filter-button">Pending</button>
                <button className="filter-button">Completed</button>
              </div> */}
            </div>
            
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="empty-text">No tasks assigned to you yet</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {tasks.map((task) => {
                  const progress = getProgressInfo(task._id);
                  const status = getSubmissionStatus(task._id);
                  const submission = submissions.find(sub => sub.taskId === task._id);
                  const isOverdue = new Date(task.dueDate) < new Date() && !status;

                  return (
                    <div key={task._id} className="task-card" onClick={() => openTaskDetails(task)}>
                      <div className="task-card-header">
                        <h3 className="task-title">{task.title}</h3>
                        <div className="task-meta">
                          <span className={`task-status ${status || 'not-submitted'}`}>
                            {status === "for_review" ? "Under Review" : 
                             status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Not Submitted'}
                          </span>
                          {isOverdue && <span className="task-overdue">Overdue</span>}
                        </div>
                      </div>
                      
                      <div className="task-card-body">
                        <p className="task-description">{task.description.substring(0, 100)}{task.description.length > 100 && '...'}</p>
                        
                        {/* <div className="task-progress">
                          <div className="progress-labels">
                            <span>Progress</span>
                            <span>{progress.percentage}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className={`progress-fill ${progress.color}`} style={{ width: `${progress.percentage}%` }} />
                          </div>
                        </div> */}
                        
                        <div className="task-due-date">
                          <svg className="calendar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="task-card-footer">
                        {task.file && (
                          <a 
                            href={task.file} 
                            onClick={(e) => e.stopPropagation()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="task-action-button download"
                          >
                            <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        )}
                        
                        {!status ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewSubmission({ ...newSubmission, taskId: task._id });
                            }}
                            className="task-action-button submit"
                          >
                            <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit
                          </button>
                        ) : status === "for_review" ? (
                          <span className="task-action-button pending">
                            <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Under Review
                          </span>
                        ) : null}
                        
                        {/* {status === "for_review" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openReviewForm(task._id, submission.userId);
                            }}
                            className="task-action-button review"
                          >
                            <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Review
                          </button>
                        )} */}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default MyTask;