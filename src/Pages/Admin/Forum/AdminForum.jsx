import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./AdminForum.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminForum = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThreads, setSelectedThreads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [forumData, setForumData] = useState({
    topics: [
      {
        id: 1,
        title: "General Discussions",
        description: "For questions not tied to a specific course",
        postCount: 24
      },
      {
        id: 2,
        title: "Course Feedback",
        description: "Suggestions and feedback about courses",
        postCount: 15
      },
      {
        id: 3,
        title: "Doubts & Queries",
        description: "Ask your doubts to peers or instructors",
        postCount: 32
      }
    ],
    recentThreads: [
      {
        id: 1,
        title: "How to access the course certificate?",
        author: "Anjali",
        timeAgo: "2 hours ago",
        pinned: false
      },
      {
        id: 2,
        title: "Doubt in Chapter 3 of React Course",
        author: "Ravi",
        timeAgo: "1 day ago",
        pinned: true
      }
    ]
  });

  const handleDeleteThreads = () => {
    const updatedThreads = forumData.recentThreads.filter(
      thread => !selectedThreads.includes(thread.id)
    );
    
    setForumData({
      ...forumData,
      recentThreads: updatedThreads
    });
    
    setSelectedThreads([]);
    setShowDeleteModal(false);
    toast.success("Selected threads deleted successfully!");
  };

  const handlePinThread = (threadId) => {
    setForumData(prev => ({
      ...prev,
      recentThreads: prev.recentThreads.map(thread => 
        thread.id === threadId 
          ? { ...thread, pinned: !thread.pinned } 
          : thread
      )
    }));
  };

  const filteredThreads = forumData.recentThreads.filter(thread => 
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminNavbar>
      <div className="admin-forum">
        <Header Title={"Forum Management"} Address={"Admin Forum"} />
        <ToastContainer position="top-right" autoClose={3000} />

        <div className=" px-4">
          {/* Search and Admin Controls */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="d-flex gap-2">
              {selectedThreads.length > 0 && (
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => navigate("/admin/forum/new-thread")}
              >
                + New Thread
              </button>
            </div>
          </div>

          {/* Forum Topics */}
          <div className="forum-section mb-4">
            <h5 className="mb-3">Forum Topics</h5>
            <div className="list-group">
              {forumData.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => navigate(`/admin/forum/topic/${topic.id}`)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{topic.title}</h6>
                      <small className="text-muted">{topic.description}</small>
                    </div>
                    <div>
                      <span className="badge bg-secondary">
                        {topic.postCount} Posts
                      </span>
                      <button 
                        className="btn btn-sm btn-outline-primary ms-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/forum/topic/${topic.id}/edit`);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Threads */}
          <div className="forum-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Recent Threads</h5>
              {selectedThreads.length > 0 && (
                <span className="badge bg-primary">
                  {selectedThreads.length} selected
                </span>
              )}
            </div>
            
            <ul className="list-group">
              {filteredThreads.map((thread) => (
                <li 
                  key={thread.id}
                  className={`list-group-item ${thread.pinned ? "list-group-item-warning" : ""}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedThreads.includes(thread.id)}
                          onChange={() => 
                            setSelectedThreads(prev => 
                              prev.includes(thread.id) 
                                ? prev.filter(id => id !== thread.id) 
                                : [...prev, thread.id]
                            )
                          }
                        />
                        <strong>{thread.title}</strong>
                        {thread.pinned && (
                          <span className="badge bg-warning">Pinned</span>
                        )}
                      </div>
                      <small className="text-muted">
                        Posted by {thread.author} • {thread.timeAgo}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handlePinThread(thread.id)}
                      >
                        {thread.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/admin/forum/thread/${thread.id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-backdrop">
            <div className="modal-content p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p>Are you sure you want to delete the selected threads?</p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteThreads}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminNavbar>
  );
};

export default AdminForum;