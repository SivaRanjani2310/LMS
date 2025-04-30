import { useState, useEffect } from "react";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import "./AdminAchievements.css";

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    badge: "gold",
    category: "assignments"
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // Fetch achievements from API
    setAchievements(mockAchievements);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing achievement
      setAchievements(prev => 
        prev.map(item => 
          item.id === editingId ? { ...newAchievement, id: editingId } : item
        )
      );
    } else {
      // Add new achievement
      const newId = Math.max(...achievements.map(a => a.id), 0) + 1;
      setAchievements(prev => [...prev, { ...newAchievement, id: newId }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setNewAchievement({
      title: "",
      description: "",
      badge: "gold",
      category: "assignments"
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (achievement) => {
    setNewAchievement(achievement);
    setEditingId(achievement.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setAchievements(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AdminNavbar>
      <div className="admin-achievements-page">
        <Header Title="Manage Achievements" Address="Admin > Achievements" />

        <div className="admin-achievements-container">
          <div className="admin-header">
            <h2>Achievement Management</h2>
            <button 
              className="add-button"
              onClick={() => setIsFormOpen(true)}
            >
              + Add New Achievement
            </button>
          </div>

          {isFormOpen && (
            <div className="achievement-form-modal">
              <div className="achievement-form-container">
                <h3>{editingId ? "Edit Achievement" : "Add New Achievement"}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newAchievement.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={newAchievement.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={newAchievement.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="assignments">Assignments</option>
                      <option value="research">Research</option>
                      <option value="participation">Participation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Badge Type</label>
                    <div className="badge-options">
                      <label>
                        <input
                          type="radio"
                          name="badge"
                          value="gold"
                          checked={newAchievement.badge === "gold"}
                          onChange={handleInputChange}
                        /> Gold 🥇
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="badge"
                          value="silver"
                          checked={newAchievement.badge === "silver"}
                          onChange={handleInputChange}
                        /> Silver 🥈
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="badge"
                          value="bronze"
                          checked={newAchievement.badge === "bronze"}
                          onChange={handleInputChange}
                        /> Bronze 🥉
                      </label>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit">
                      {editingId ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="achievements-list">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Badge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>
                      {item.badge === "gold" ? "🥇" : 
                       item.badge === "silver" ? "🥈" : "🥉"}
                    </td>
                    <td className="actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminNavbar>
  );
};

// Same mock data as user side
const mockAchievements = [
  {
    id: 1,
    title: "Assignment Champion",
    description: "First to complete 10 assignments",
    badge: "gold",
    date: "2025-04-29",
    category: "assignments"
  },
  // ... rest of the mock data
];

export default AdminAchievements;