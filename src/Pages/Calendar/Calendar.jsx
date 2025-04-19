import { useState } from "react";

// Component imports
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";

// Calendar & Bootstrap
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Modal, Form } from "react-bootstrap";

// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons (Bootstrap Icons)
import "bootstrap-icons/font/bootstrap-icons.css";

// CSS
import "./Calendar.css";

const Calendar = () => {
  const localizer = momentLocalizer(moment);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handle adding event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const start = new Date(newEvent.start);
      const end = new Date(newEvent.end);

      // Check if the dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        toast.error("Invalid date format");
        return;
      }

      setEvents([
        ...events,
        {
          title: newEvent.title,
          start,
          end,
        },
      ]);
      setNewEvent({ title: "", start: "", end: "" });
      setShowModal(false);
      toast.success("Reminder added successfully!");
    } else {
      toast.error("Please fill all fields!");
    }
  };

  // Handle event deletion confirmation
  const handleShowDeleteConfirmation = (event) => {
    setSelectedEvent(event);
    setShowDeleteConfirmation(true);
  };

  // Handle deleting event
  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event !== selectedEvent));
    setShowDeleteConfirmation(false);
    toast.error("Reminder deleted.");
  };

  // Custom styling for events in the calendar
  const eventPropGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: isSelected ? "#dc3545" : "#007bff",
        color: "white",
        borderRadius: "8px",
        padding: "6px 8px",
        border: "none",
      },
    };
  };

  return (
    <Navbar>
      <div className="leaderboard">
        <Header Title={"Calendar"} Address={"Calendar"} />
      </div>

      <div className="leaderboardData">
        <div className="react-Big-calendar">
          <div className="completion main-calendar">
            <div className="Dash_calender d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Calendar</h5>
              <div className="text-end mb-2">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Reminder
                </Button>
              </div>
            </div>

            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventPropGetter}
              style={{ height: "470px", width: "100%" }}
              onSelectEvent={handleShowDeleteConfirmation}
            />

            {/* Add Remainder Modal */}
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              centered
              size="lg"
              aria-labelledby="add-reminder-modal"
              backdrop="static"
              dialogClassName="modal-dialog custom-modal-dialog"
            >
              <Modal.Header closeButton>
                <Modal.Title id="add-reminder-modal">
                  <i className="bi bi-calendar-plus me-2"></i> Add Reminder
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Reminder Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Start Date and Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={newEvent.start}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, start: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Date and Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={newEvent.end}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, end: e.target.value })
                      }
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
  <Button variant="secondary" onClick={() => setShowModal(false)}>
    <i className="bi bi-x-circle me-2"></i> Close
  </Button>
  <Button variant="primary" onClick={handleAddEvent}>
    <i className="bi bi-save2 me-2"></i> Save Reminder
  </Button>
</Modal.Footer>

            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
              show={showDeleteConfirmation}
              onHide={() => setShowDeleteConfirmation(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="bi bi-trash me-2"></i> Delete Reminder
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this Reminder?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteEvent}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </Navbar>
  );
};

export default Calendar;
