import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./AdminAnnouncement.css";

const AdminAnnouncement = () => {
  const navigate = useNavigate();
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);

  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    type: "New",
    description: "",
    postedBy: "Admin",
  });



  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      ...formData,
      date: new Date().toLocaleDateString(),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);

    // Clear form
    setFormData({
      title: "",
      type: "New",
      description: "",
      postedBy: "Admin",
    });
  };

  const handleDelete = (index) => {
    const updated = announcements.filter((_, i) => i !== index);
    setAnnouncements(updated);
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "New":
        return "bg-success";
      case "Alert":
        return "bg-warning text-dark";
      case "Event":
        return "bg-info text-white";
      default:
        return "bg-secondary";
    }
  };

  return (
    <AdminNavbar>
      <div className="leaderboard">
        <Header Title={"Manage Announcements"} Address={"Admin > Announcement"} />
      </div>

      <div className="leaderboardData px-4">
        <h5 className="mb-4 mt-3">Add Announcement</h5>
        <form className="mb-4" onSubmit={handleAddAnnouncement}>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
            />
          </div>
          <div className="mb-2">
            <select
              className="form-select"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="Alert">Alert</option>
              <option value="Event">Event</option>
            </select>
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Post Announcement</button>
        </form>

        <h5 className="mb-3">Existing Announcements</h5>
        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((item, idx) => (
            <div key={idx} className="announcement-card mb-3 p-3 shadow-sm border rounded">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-1">{item.title}</h6>
                <span className={`badge ${getBadgeClass(item.type)}`}>{item.type}</span>
              </div>
              <p className="mb-1 text-muted">{item.description}</p>
              <small className="text-secondary">
                Posted by {item.postedBy} • {item.date}
              </small>
              <div className="text-end mt-2">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(idx)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminNavbar>
  );
};

export default AdminAnnouncement;
