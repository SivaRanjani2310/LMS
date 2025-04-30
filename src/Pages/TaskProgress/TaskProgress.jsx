import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./TaskProgress.css";

const TaskProgress = () => {
  const navigate = useNavigate();
  const { data: { isAuthenticated, role, user } } = useSelector((store) => store.auth);

  // State management
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);

  // Mock data - replace with API calls
  useEffect(() => {
  
      // Simulate API call with only the current user's data
      const mockCourses = [
        {
          id: 1,
          courseName: "Advanced Mathematics",
          instructor: "Dr. Smith",
          startDate: "2023-09-01",
          endDate: "2023-12-15",
          tasks: [
            { 
              id: 1001, 
              name: "Linear Algebra", 
              dueDate: "2023-10-15", 
              completed: true, 
              completionDate: "2023-10-10", 
              grade: "A",
              description: "Complete all problems in chapter 3 and submit PDF",
              resources: ["textbook_ch3.pdf", "lecture_notes_week5.pdf"]
            },
            { 
              id: 1002, 
              name: "Calculus Exam", 
              dueDate: "2023-11-20", 
              completed: false, 
              grade: null,
              description: "Midterm exam covering chapters 1-5",
              resources: ["study_guide.pdf", "practice_exam.pdf"]
            },
            { 
              id: 1003, 
              name: "Statistics Project", 
              dueDate: "2023-12-10", 
              completed: false, 
              grade: null,
              description: "Group project analyzing real-world dataset",
              resources: ["project_guidelines.pdf", "sample_datasets.zip"]
            }
          ]
        },
        {
          id: 2,
          courseName: "Computer Science Fundamentals",
          instructor: "Prof. Johnson",
          startDate: "2023-09-01",
          endDate: "2023-12-15",
          tasks: [
            { 
              id: 2001, 
              name: "Programming Assignment", 
              dueDate: "2023-10-10", 
              completed: true, 
              completionDate: "2023-10-05", 
              grade: "A",
              description: "Implement a linked list in Python",
              resources: ["assignment1.pdf", "starter_code.zip"]
            }
          ]
        }
      ];
      
      setCourses(mockCourses);
      if (mockCourses.length > 0) {
        setSelectedCourse(mockCourses[0].courseName);
      }
    }
  );

  // Calculate course progress
  const calculateCourseProgress = (course) => {
    const totalTasks = course.tasks.length;
    const completedTasks = course.tasks.filter(t => t.completed).length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    
    const overdueTasks = course.tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < new Date()
    ).length;
    
    return { 
      percentage, 
      totalTasks, 
      completedTasks, 
      overdueTasks,
      status: percentage === 100 ? 'completed' : 
              overdueTasks > 0 ? 'behind' : 
              percentage >= 70 ? 'ahead' : 'ontrack'
    };
  };

  // Current course data
  const currentCourse = courses.find(course => course.courseName === selectedCourse);
  const currentProgress = currentCourse ? calculateCourseProgress(currentCourse) : null;

  // Toggle task expansion
  const toggleTaskExpansion = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };


  return (
    <Navbar>
      <div className="leaderboard">
      <Header Title={"My Task Progress"} Address={"Dashboard > Task Progress"} />

        <div className="user-control-panel">
          <div className="course-selection">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <select
                className="form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {currentCourse && (
              <div className="course-meta mt-3">
                <div className="instructor-info">
                  <strong>Instructor:</strong> {currentCourse.instructor}
                </div>
                <div className="course-dates">
                  <strong>Duration:</strong> {currentCourse.startDate} to {currentCourse.endDate}
                </div>
              </div>
            )}
          </div>
        </div>

        {currentCourse && currentProgress && (
          <div className="progress-summary-cards">
            <div className="row">
              <div className="col-md-4">
                <div className="card summary-card overall-progress">
                  <div className="card-body">
                    <h5 className="card-title">Overall Progress</h5>
                    <div className="progress-circle">
                      <div 
                        className="circle-progress"
                        style={{ 
                          background: `conic-gradient(#28a745 ${currentProgress.percentage}%, #e9ecef ${currentProgress.percentage}% 100%)`
                        }}
                      >
                        <span>{currentProgress.percentage}%</span>
                      </div>
                    </div>
                    <div className="progress-stats">
                      {currentProgress.completedTasks} of {currentProgress.totalTasks} tasks completed
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card summary-card completed-tasks">
                  <div className="card-body">
                    <h5 className="card-title">Completed</h5>
                    <h2 className="card-text">
                      {currentProgress.completedTasks}
                    </h2>
                    <div className="subtext">Tasks successfully submitted</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card summary-card pending-tasks">
                  <div className="card-body">
                    <h5 className="card-title">Pending</h5>
                    <h2 className="card-text">
                      {currentProgress.totalTasks - currentProgress.completedTasks}
                    </h2>
                    <div className="subtext">
                      {currentProgress.overdueTasks > 0 && (
                        <span className="overdue-count">
                          ({currentProgress.overdueTasks} overdue)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="task-list-container">
          <h4 className="task-list-header">
            {selectedCourse} Tasks
          </h4>
          
          {currentCourse?.tasks?.length > 0 ? (
            <div className="task-items">
              {currentCourse.tasks.map((task) => {
                const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                const daysRemaining = Math.ceil(
                  (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                
                return (
                  <div 
                    key={task.id} 
                    className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                  >
                    <div 
                      className="task-main-info"
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      <div className="task-status">
                        {task.completed ? (
                          <span className="status-badge completed">
                            <i className="bi bi-check-circle-fill"></i> Completed
                          </span>
                        ) : isOverdue ? (
                          <span className="status-badge overdue">
                            <i className="bi bi-exclamation-circle-fill"></i> Overdue
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            <i className="bi bi-clock-fill"></i> Pending
                          </span>
                        )}
                      </div>
                      <div className="task-name">
                        <h5>{task.name}</h5>
                        {task.completed && task.grade && (
                          <span className="task-grade">
                            Grade: {task.grade}
                          </span>
                        )}
                      </div>
                      <div className="task-due-date">
                        <span className="due-date-label">Due:</span>
                        <span className="due-date-value">{task.dueDate}</span>
                        {!task.completed && !isOverdue && (
                          <span className="days-remaining">
                            ({daysRemaining > 0 ? `${daysRemaining} days left` : 'Due today'})
                          </span>
                        )}
                      </div>
                      <div className="task-toggle">
                        <button className="btn btn-sm btn-outline-primary">
                          {expandedTask === task.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                    
                    {expandedTask === task.id && (
                      <div className="task-details">
                        <div className="task-description">
                          <h6>Description</h6>
                          <p>{task.description}</p>
                        </div>
                        
                        {task.resources && task.resources.length > 0 && (
                          <div className="task-resources">
                            <h6>Resources</h6>
                            <ul>
                              {task.resources.map((resource, index) => (
                                <li key={index}>
                                  <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    alert(`Downloading ${resource}`);
                                  }}>
                                    <i className="bi bi-file-earmark-arrow-down"></i> {resource}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {task.completed ? (
                          <div className="task-completion-info">
                            <div className="completion-date">
                              <strong>Submitted on:</strong> {task.completionDate}
                            </div>
                            {task.grade && (
                              <div className="grade-info">
                                <strong>Grade received:</strong> {task.grade}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="task-actions">
                            <button 
                              className="btn btn-primary"
                              onClick={() => alert(`Submit ${task.name}`)}
                            >
                              <i className="bi bi-upload"></i> Submit Task
                            </button>
                            {isOverdue && (
                              <button 
                                className="btn btn-outline-danger ms-2"
                                onClick={() => alert(`Request extension for ${task.name}`)}
                              >
                                <i className="bi bi-clock-history"></i> Request Extension
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-tasks">
              <div className="alert alert-info">
                No tasks found for this course.
              </div>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default TaskProgress;