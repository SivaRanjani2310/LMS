import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./AdminTaskProgress.css";

const AdminTaskProgress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: { isAuthenticated, role } } = useSelector((store) => store.auth);

  // State management
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filter, setFilter] = useState("all"); // all, behind, ontrack, ahead
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);

  // Mock data - replace with API calls
  useEffect(() => {
 
      // Simulate API call
      const mockCourses = [
        {
          id: 1,
          courseName: "Advanced Mathematics",
          instructor: "Dr. Smith",
          startDate: "2023-09-01",
          endDate: "2023-12-15",
          students: [
            {
              id: 101,
              name: "John Doe",
              email: "john@university.edu",
              tasks: [
                { id: 1001, name: "Linear Algebra", dueDate: "2023-10-15", completed: true, completionDate: "2023-10-10", grade: "A" },
                { id: 1002, name: "Calculus Exam", dueDate: "2023-11-20", completed: false, grade: null },
                { id: 1003, name: "Statistics Project", dueDate: "2023-12-10", completed: false, grade: null }
              ]
            },
            {
              id: 102,
              name: "Jane Smith",
              email: "jane@university.edu",
              tasks: [
                { id: 1001, name: "Linear Algebra", dueDate: "2023-10-15", completed: true, completionDate: "2023-10-12", grade: "B+" },
                { id: 1002, name: "Calculus Exam", dueDate: "2023-11-20", completed: true, completionDate: "2023-11-18", grade: "A-" },
                { id: 1003, name: "Statistics Project", dueDate: "2023-12-10", completed: false, grade: null }
              ]
            }
          ]
        },
        {
          id: 2,
          courseName: "Computer Science Fundamentals",
          instructor: "Prof. Johnson",
          startDate: "2023-09-01",
          endDate: "2023-12-15",
          students: [
            {
              id: 201,
              name: "Alex Brown",
              email: "alex@university.edu",
              tasks: [
                { id: 2001, name: "Programming Assignment", dueDate: "2023-10-10", completed: true, completionDate: "2023-10-05", grade: "A" },
                { id: 2002, name: "Database Project", dueDate: "2023-11-15", completed: false, grade: null },
                { id: 2003, name: "Final Exam", dueDate: "2023-12-12", completed: false, grade: null }
              ]
            }
          ]
        }
      ];
      setCourses(mockCourses);
      if (mockCourses.length > 0) {
        setSelectedCourse(mockCourses[0].courseName);
      }
    }
  , [isAuthenticated, role, navigate]);

  // Helper functions
  const calculateStudentProgress = (student) => {
    const totalTasks = student.tasks.length;
    const completedTasks = student.tasks.filter(t => t.completed).length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    
    const overdueTasks = student.tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < new Date()
    ).length;
    
    const upcomingTasks = student.tasks.filter(task => 
      !task.completed && new Date(task.dueDate) >= new Date()
    ).length;
    
    return { 
      percentage, 
      totalTasks, 
      completedTasks, 
      overdueTasks,
      upcomingTasks,
      status: percentage === 100 ? 'completed' : 
              overdueTasks > 0 ? 'behind' : 
              percentage >= 70 ? 'ahead' : 'ontrack'
    };
  };

  // Filter and search functionality
  const currentCourse = courses.find(course => course.courseName === selectedCourse);
  const filteredStudents = currentCourse?.students
    ?.filter(student => {
      const { status } = calculateStudentProgress(student);
      if (filter === "all") return true;
      return status === filter;
    })
    ?.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Action handlers
  const handleSendReminder = (studentEmail) => {
    alert(`Reminder email sent to ${studentEmail}`);
    // In a real app: API call to send reminder
  };

  const handleGradeSubmission = (studentId, taskId, grade) => {
    alert(`Grade ${grade} submitted for task ${taskId}`);
    // In a real app: API call to update grade
  };

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  return (
    <AdminNavbar>
      <div className="admin-task-progress-container">
        <Header Title={"Admin Task Dashboard"} Address={"Admin > Task Progress"} />

        <div className="admin-control-panel">
          <div className="course-selection">
            <h4>Course Overview</h4>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <select
                className="form-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.courseName}>
                    {course.courseName} ({course.students.length} students)
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="behind">Behind Schedule</option>
                <option value="ontrack">On Track</option>
                <option value="ahead">Ahead of Schedule</option>
                <option value="completed">Completed All</option>
              </select>
            </div>

            {currentCourse && (
              <div className="course-meta mt-2">
                <span className="badge bg-info me-2">
                  Instructor: {currentCourse.instructor}
                </span>
                <span className="badge bg-secondary">
                  {currentCourse.startDate} to {currentCourse.endDate}
                </span>
              </div>
            )}
          </div>

          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="progress-summary-cards">
          <div className="row">
            <div className="col-md-3">
              <div className="card summary-card total-students">
                <div className="card-body">
                  <h5 className="card-title">Total Students</h5>
                  <h2 className="card-text">
                    {currentCourse?.students?.length || 0}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card summary-card completed">
                <div className="card-body">
                  <h5 className="card-title">Completed All</h5>
                  <h2 className="card-text">
                    {currentCourse?.students?.filter(student => {
                      const { status } = calculateStudentProgress(student);
                      return status === 'completed';
                    }).length || 0}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card summary-card on-track">
                <div className="card-body">
                  <h5 className="card-title">On Track</h5>
                  <h2 className="card-text">
                    {currentCourse?.students?.filter(student => {
                      const { status } = calculateStudentProgress(student);
                      return status === 'ontrack' || status === 'ahead';
                    }).length || 0}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card summary-card behind">
                <div className="card-body">
                  <h5 className="card-title">Behind Schedule</h5>
                  <h2 className="card-text">
                    {currentCourse?.students?.filter(student => {
                      const { status } = calculateStudentProgress(student);
                      return status === 'behind';
                    }).length || 0}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="student-progress-table">
          {filteredStudents.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Student</th>
                    <th style={{ width: '15%' }}>Progress</th>
                    <th style={{ width: '15%' }}>Status</th>
                    <th style={{ width: '25%' }}>Tasks Overview</th>
                    <th style={{ width: '20%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const { 
                      percentage, 
                      totalTasks, 
                      completedTasks, 
                      overdueTasks,
                      upcomingTasks,
                      status 
                    } = calculateStudentProgress(student);
                    
                    const statusConfig = {
                      completed: { class: 'success', text: 'Completed' },
                      ahead: { class: 'info', text: 'Ahead' },
                      ontrack: { class: 'primary', text: 'On Track' },
                      behind: { class: 'danger', text: 'Behind' }
                    };

                    return (
                      <>
                        <tr key={student.id} className="student-row">
                          <td>
                            <div className="student-info">
                              <strong>{student.name}</strong>
                              <div className="text-muted small">{student.email}</div>
                            </div>
                          </td>
                          <td>
                            <div className="progress-wrapper">
                              <div className="progress" style={{ height: '10px' }}>
                                <div
                                  className={`progress-bar bg-${statusConfig[status].class}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="progress-text">
                                {completedTasks}/{totalTasks} tasks
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${statusConfig[status].class}`}>
                              {statusConfig[status].text}
                              {overdueTasks > 0 && ` (${overdueTasks} overdue)`}
                            </span>
                          </td>
                          <td>
                            <div className="task-overview">
                              <span className="completed-tasks">
                                {completedTasks} completed
                              </span>
                              {upcomingTasks > 0 && (
                                <span className="upcoming-tasks">
                                  {upcomingTasks} upcoming
                                </span>
                              )}
                              {overdueTasks > 0 && (
                                <span className="overdue-tasks">
                                  {overdueTasks} overdue
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => toggleStudentExpansion(student.id)}
                              >
                                {expandedStudent === student.id ? 'Hide' : 'View'} Details
                              </button>
                              {status !== 'completed' && (
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => handleSendReminder(student.email)}
                                >
                                  Remind
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {expandedStudent === student.id && (
                          <tr className="task-details-row">
                            <td colSpan="5">
                              <div className="task-details-container">
                                <h6>Task Details for {student.name}</h6>
                                <div className="task-list">
                                  {student.tasks.map((task) => (
                                    <div 
                                      key={task.id} 
                                      className={`task-item ${task.completed ? 'completed' : ''}`}
                                    >
                                      <div className="task-main-info">
                                        <span className="task-name">
                                          {task.name}
                                          {task.completed && (
                                            <span className="grade-badge">
                                              Grade: {task.grade || 'Pending'}
                                            </span>
                                          )}
                                        </span>
                                        <span className={`due-date ${!task.completed && new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                                          Due: {task.dueDate}
                                          {task.completed && (
                                            <span className="completed-date">
                                              (Completed on {task.completionDate})
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                      {!task.completed && (
                                        <div className="task-actions">
                                          <select
                                            className="form-select form-select-sm grade-select"
                                            defaultValue=""
                                            onChange={(e) => 
                                              e.target.value && 
                                              handleGradeSubmission(student.id, task.id, e.target.value)
                                            }
                                          >
                                            <option value="">Add grade...</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                            <option value="F">F</option>
                                          </select>
                                          <button
                                            className="btn btn-sm btn-success mark-complete"
                                            onClick={() => alert(`Marking ${task.name} as complete`)}
                                          >
                                            Mark Complete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-results">
              <div className="alert alert-info">
                No students match the current filters. Try adjusting your search criteria.
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminNavbar>
  );
};

export default AdminTaskProgress;