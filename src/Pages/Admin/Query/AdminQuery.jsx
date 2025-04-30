import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./AdminQuery.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminQuery = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    meetingLink: "",
    adminMessage: ""
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockQueries = [
      {
        id: 1,
        status: "Pending",
        studentName: "John Doe",
        studentEmail: "john@example.com",
        requestedDate: "2023-05-15",
        requestedMessage: "Need help with React concepts",
        scheduledDate: "",
        scheduledTime: "",
        meetingLink: "",
        adminMessage: ""
      },
      {
        id: 2,
        status: "Approved",
        studentName: "Jane Smith",
        studentEmail: "jane@example.com",
        requestedDate: "2023-05-10",
        requestedMessage: "Clarification on assignment submission",
        scheduledDate: "2023-05-12",
        scheduledTime: "14:00",
        meetingLink: "https://meet.example.com/123",
        adminMessage: "Please join on time with your questions prepared"
      }
    ];
    setQueries(mockQueries);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    
    // Update the query in state
    const updatedQueries = queries.map(query => 
      query.id === selectedQuery.id 
        ? { 
            ...query, 
            status: "Approved",
            ...formData
          } 
        : query
    );
    
    setQueries(updatedQueries);
    setShowResponseForm(false);
    toast.success("Response submitted successfully!");
    
    // Reset form
    setFormData({
      scheduledDate: "",
      scheduledTime: "",
      meetingLink: "",
      adminMessage: ""
    });
  };

  const handleRejectQuery = (queryId) => {
    const updatedQueries = queries.map(query => 
      query.id === queryId 
        ? { 
            ...query, 
            status: "Rejected",
            adminMessage: "Your query has been rejected. Please contact support for more information."
          } 
        : query
    );
    
    setQueries(updatedQueries);
    toast.warning("Query rejected");
  };

  return (
    <AdminNavbar>
      <div className="admin-query">
        <Header Title={"Query Management"} Address={"Admin Query"} />
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="query-container px-4">
          <h2 className="title">Student Queries</h2>
          
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Requested Date</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query.id} className={query.status === "Pending" ? "table-warning" : ""}>
                    <td>{query.id}</td>
                    <td>
                      <span className={`status-badge ${query.status.toLowerCase()}`}>
                        {query.status}
                      </span>
                    </td>
                    <td>{query.studentName}</td>
                    <td>{query.studentEmail}</td>
                    <td>{query.requestedDate}</td>
                    <td className="message-cell">
                      <div className="message-preview">
                        {query.requestedMessage}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {query.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => {
                                setSelectedQuery(query);
                                setShowResponseForm(true);
                              }}
                            >
                              Respond
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRejectQuery(query.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {query.status !== "Pending" && (
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => {
                              setSelectedQuery(query);
                              setShowResponseForm(true);
                            }}
                          >
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Response Form Modal */}
          {showResponseForm && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedQuery?.status === "Pending" ? "Respond to Query" : "Query Details"}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => {
                      setShowResponseForm(false);
                      setSelectedQuery(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <h6>Student: {selectedQuery?.studentName}</h6>
                    <p>Message: {selectedQuery?.requestedMessage}</p>
                  </div>
                  
                  {selectedQuery?.status === "Pending" ? (
                    <form onSubmit={handleResponseSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Scheduled Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="scheduledDate"
                          value={formData.scheduledDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Scheduled Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="scheduledTime"
                          value={formData.scheduledTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Meeting Link</label>
                        <input
                          type="url"
                          className="form-control"
                          name="meetingLink"
                          value={formData.meetingLink}
                          onChange={handleInputChange}
                          placeholder="https://meet.example.com/your-meeting"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Admin Message</label>
                        <textarea
                          className="form-control"
                          name="adminMessage"
                          value={formData.adminMessage}
                          onChange={handleInputChange}
                          rows="3"
                          required
                        ></textarea>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowResponseForm(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Approve Query
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="query-details">
                      <p><strong>Scheduled Date:</strong> {selectedQuery?.scheduledDate}</p>
                      <p><strong>Scheduled Time:</strong> {selectedQuery?.scheduledTime}</p>
                      <p><strong>Meeting Link:</strong> 
                        {selectedQuery?.meetingLink ? (
                          <a href={selectedQuery.meetingLink} target="_blank" rel="noopener noreferrer">
                            Join Meeting
                          </a>
                        ) : "N/A"}
                      </p>
                      <p><strong>Admin Message:</strong> {selectedQuery?.adminMessage}</p>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setShowResponseForm(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminNavbar>
  );
};

export default AdminQuery;