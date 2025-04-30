import { useEffect, useState } from "react";
import "./Events.css";
import { Calendar } from "lucide-react";
import axios from "axios";
// const apiBaeApi = process.env.REACT_APP_API_BASE_URL;
const apiBaseUrl = process.env.REACT_APP_BASE_API;
const userInfo = JSON.parse(localStorage.getItem('userdata'))
const MainEvents = () => {
      const [events, setEvents] = useState([]);
    useEffect(() => {
      const getEvent = async () => {
        const resEvents = await axios.get(`${apiBaseUrl}/api/admin-event/${userInfo.applyingFor}`);
        const { events } = resEvents.data;
        setEvents(events);
      };
      getEvent();
    }, []);
  return (
    <>
      <div className="Events">
        <h3>Notice</h3>
        <div className="event-container">
          {events.length === 0 ? (
            <p>No events available</p>
          ) : (
            <ul>
              {events.map((event) => {
                const formattedStartDate = new Date(event.startDate)
                  .toISOString()
                  .split("T")[0];
                const formattedEndedDate = new Date(event.endDate)
                  .toISOString()
                  .split("T")[0];
                return (
                  <li className="event-card" key={event._id}>
                    <Calendar />
                    <div className="event-content">
                      <h6 className="event-title">{event.title} </h6>
                      <p className="event-description">{event.description}</p>
                      <div className="event-dates">
                        <p className="event-date">{formattedStartDate}</p>
                        <p className="event-date">{formattedEndedDate}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MainEvents;
