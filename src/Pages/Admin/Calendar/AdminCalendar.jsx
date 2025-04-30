import { useState } from "react";
import Navbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Modal, Form, Dropdown, Badge } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AdminCalendar.css";

const AdminCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    start: "", 
    end: "", 
    type: "meeting", 
    attendees: [], 
    description: "",
    status: "scheduled"
  });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allUsers, setAllUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Admin User", email: "admin@example.com" }
  ]);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const start = new Date(newEvent.start);
      const end = new Date(newEvent.end);

      if (`isNaN(start.getTime()`) {
        toast.error("Invalid start date/time");
        return;
      }

      if (isNaN(end.getTime())) {
        toast.error("Invalid end date/time");
        return;
      }

      if (start >= end) {
        toast.error("End time must be after start time");
        return;
      }

      const event = {
        id: Date.now(),
        title: newEvent.title,
        start,
        end,
        type: newEvent.type,
        attendees: newEvent.attendees,
        description: newEvent.description,
        status: newEvent.status
      };

      setEvents([...events, event]);
      setNewEvent({ 
        title: "", 
        start: "", 
        end: "", 
        type: "meeting", 
        attendees: [], 
        description: "",
        status: "scheduled"
      });
      setShowModal(false);
      toast.success("Event scheduled successfully!");
    } else {
      toast.error("Please fill all required fields!");
    }
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setShowDeleteConfirmation(false);
    toast.success("Event deleted successfully");
  };

  const toggleAttendee = (user) => {
    setNewEvent(prev => {
      const isSelected = prev.attendees.some(a => a.id === user.id);
      return {
        ...prev,
        attendees: isSelected
          ? prev.attendees.filter(a => a.id !== user.id)
          : [...prev.attendees, user]
      };
    });
  };

  const eventPropGetter = (event) => {
    let backgroundColor = "#007bff"; // Default blue for meetings
    if (event.type === "reminder") backgroundColor = "#28a745"; // Green for reminders
    if (event.type === "deadline") backgroundColor = "#dc3545"; // Red for deadlines
    if (event.status === "cancelled") backgroundColor = "#6c757d"; // Gray for cancelled

    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "8px",
        padding: "6px 8px",
        border: "none",
        opacity: event.status === "cancelled" ? 0.7 : 1
      },
    };
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setSelectedEvent(null);
    toast.success("Event updated successfully!");
  };

  return (
    <Navbar>
      <div className="leaderboard">
        <Header Title={"Admin Calendar"} Address={"Calendar"} />
      </div>

      <div className="leaderboardData">
        <div className="react-Big-calendar">
          <div className="completion main-calendar">
            <div className="Dash_calender d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0">Admin Calendar</h5>
                <small className="text-muted">
                  Manage all events, meetings, and deadlines
                </small>
              </div>
              <div>
                <Button 
                  variant="primary" 
                  onClick={() => setShowModal(true)}
                  className="me-2"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Schedule Event
                </Button>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">
                    <i className="bi bi-filter me-2"></i>
                    Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>All Events</Dropdown.Item>
                    <Dropdown.Item>Meetings</Dropdown.Item>
                    <Dropdown.Item>Reminders</Dropdown.Item>
                    <Dropdown.Item>Deadlines</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventPropGetter}
              style={{ height: "600px", width: "100%" }}
              onSelectEvent={(event) => setSelectedEvent(event)}
              components={{
                event: ({ event }) => (
                  <div>
                    <strong>{event.title}</strong>
                    {event.attendees.length > 0 && (
                      <div className="attendees-badge">
                        <Badge bg="light" text="dark">
                          {event.attendees.length} attendee(s)
                        </Badge>
                      </div>
                    )}
                  </div>
                )
              }}
            />

            {/* Add/Edit Event Modal */}
            <Modal
              show={showModal || selectedEvent}
              onHide={() => {
                setShowModal(false);
                setSelectedEvent(null);
              }}
              centered
              size="lg"
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="bi bi-calendar-plus me-2"></i>
                  {selectedEvent ? "Edit Event" : "Schedule New Event"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Title*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter event title"
                      value={selectedEvent ? selectedEvent.title : newEvent.title}
                      onChange={(e) =>
                        selectedEvent
                          ? setSelectedEvent({...selectedEvent, title: e.target.value})
                          : setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </Form.Group>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date and Time*</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={selectedEvent 
                            ? moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")
                            : newEvent.start}
                          onChange={(e) =>
                            selectedEvent
                              ? setSelectedEvent({...selectedEvent, start: new Date(e.target.value)})
                              : setNewEvent({ ...newEvent, start: e.target.value })
                          }
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>End Date and Time*</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={selectedEvent 
                            ? moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")
                            : newEvent.end}
                          onChange={(e) =>
                            selectedEvent
                              ? setSelectedEvent({...selectedEvent, end: new Date(e.target.value)})
                              : setNewEvent({ ...newEvent, end: e.target.value })
                          }
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Event Type*</Form.Label>
                    <Form.Select
                      value={selectedEvent ? selectedEvent.type : newEvent.type}
                      onChange={(e) =>
                        selectedEvent
                          ? setSelectedEvent({...selectedEvent, type: e.target.value})
                          : setNewEvent({ ...newEvent, type: e.target.value })
                      }
                    >
                      <option value="meeting">Meeting</option>
                      <option value="reminder">Reminder</option>
                      <option value="deadline">Deadline</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Attendees</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" className="w-100">
                        Select Attendees ({selectedEvent 
                          ? selectedEvent.attendees.length 
                          : newEvent.attendees.length} selected)
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="p-3" style={{ width: "100%" }}>
                        {allUsers.map(user => (
                          <Form.Check
                            key={user.id}
                            type="checkbox"
                            label={`${user.name} (${user.email})`}
                            checked={
                              selectedEvent
                                ? selectedEvent.attendees.some(a => a.id === user.id)
                                : newEvent.attendees.some(a => a.id === user.id)
                            }
                            onChange={() => toggleAttendee(user)}
                            className="mb-2"
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter event description"
                      value={selectedEvent ? selectedEvent.description : newEvent.description}
                      onChange={(e) =>
                        selectedEvent
                          ? setSelectedEvent({...selectedEvent, description: e.target.value})
                          : setNewEvent({ ...newEvent, description: e.target.value })
                      }
                    />
                  </Form.Group>

                  {selectedEvent && (
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={selectedEvent.status}
                        onChange={(e) =>
                          setSelectedEvent({...selectedEvent, status: e.target.value})
                        }
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Form.Select>
                    </Form.Group>
                  )}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                {selectedEvent && (
                  <Button 
                    variant="danger" 
                    onClick={() => {
                      setShowDeleteConfirmation(true);
                      setShowModal(false);
                    }}
                    className="me-auto"
                  >
                    <i className="bi bi-trash me-2"></i> Delete
                  </Button>
                )}
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEvent(null);
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i> Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => 
                    selectedEvent 
                      ? handleEventUpdate(selectedEvent)
                      : handleAddEvent()
                  }
                >
                  <i className="bi bi-save2 me-2"></i>
                  {selectedEvent ? "Update Event" : "Schedule Event"}
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
                  <i className="bi bi-trash me-2"></i> Confirm Deletion
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this event?</p>
                <p className="fw-bold">{selectedEvent?.title}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteEvent}
                >
                  Delete Event
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Navbar>
  );
};

export default AdminCalendar;