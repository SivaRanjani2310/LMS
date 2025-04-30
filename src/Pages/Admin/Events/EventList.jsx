import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // No longer needed if you're not updating/deleting remotely

import localEvents from "./events.json"; // Adjust path as needed

const EventList = ({ degreeId, setDegreeId, DegreeList }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    setEvents(localEvents);
  }, []);

  const handleEditClick = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({ ...currentEvent, [name]: value });
  };

  const handleSaveEvent = () => {
    if (
      !currentEvent.title ||
      !currentEvent.startDate ||
      !currentEvent.endDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const updatedEvents = events.map((event) =>
      event._id === currentEvent._id ? currentEvent : event
    );
    setEvents(updatedEvents);
    setShowModal(false);
  };

  const handleDeleteEvent = (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    const updatedEvents = events.filter((event) => event._id !== eventId);
    setEvents(updatedEvents);
    alert("Event deleted locally.");
  };

  return (
    <div className="event-list">
      <h3>Event List</h3>
      <div>
        <label>Select Degree</label>
        <select
          className="form-control"
          onChange={(e) => setDegreeId(e.target.value)}
          value={degreeId}
        >
          <option value="" disabled>
            Select Degree
          </option>
          {DegreeList.map((degree) => (
            <option key={degree._id} value={degree._id}>
              {degree.title}
            </option>
          ))}
        </select>
      </div>

      <div className="eventlist-container">
        {events.length > 0 ? (
          events.map((event) => {
            const formattedStartDate = new Date(event.startDate).toISOString().split("T")[0];
            const formattedEndDate = new Date(event.endDate).toISOString().split("T")[0];

            return (
              <div className="main-event-card" key={event._id}>
                <div className="main-event-card-body">
                  <h3>{event.title || "Untitled Event"}</h3>
                  <p>{event.description || "No description available"}</p>
                  <div className="main-event-card-date">
                    <p>Start: {formattedStartDate}</p>
                    <p>End: {formattedEndDate}</p>
                  </div>
                </div>
                <div className="main-buttons">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditClick(event)}
                  >
                    <Edit />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No events available at the moment.</p>
        )}
      </div>

      {/* Modal for Editing Event */}
      {showModal && (
  <div className="modal show fade d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-xl" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Event</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          {currentEvent && (
            <form>
              <div className="mb-3">
                <label htmlFor="eventTitle" className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventTitle"
                  name="title"
                  value={currentEvent.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="eventDescription" className="form-label">Event Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventDescription"
                  name="description"
                  value={currentEvent.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={currentEvent.startDate.split("T")[0]}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={currentEvent.endDate.split("T")[0]}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveEvent}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show"></div>
  </div>
)}

    </div>
  );
};

export default EventList;
