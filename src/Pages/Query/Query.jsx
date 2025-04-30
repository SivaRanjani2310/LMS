import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Components
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Query.css";

// JSON Data
import queriesData from "./queries.json";

const Query = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);
  const { students } = useSelector((store) => store.student);

  const [queries, setQueries] = useState([]);
  const [showSlotForm, setShowSlotForm] = useState(false); // <- New state


  return (
    <Navbar>
      {/* Header */}
      <div className="leaderboard">
        <Header Title={"Query"} Address={"Query"} />
      </div>

      <div className="leaderboardData px-4">
        <h2 className="title">Query</h2>
        
        <button 
          className="request-button" 
          onClick={() => setShowSlotForm(true)} // <- Show form on click
        >
          Request a Slot
        </button>

        {showSlotForm && (
          <div className="form-container slotContainer">
            <h3 className="form-title">Request a Slot</h3>

            <label className="label">Select Date:</label>
            <input type="date" className="input" />

            <label className="label">Enter Reason:</label>
            <textarea className="input"></textarea>

            <div className="form-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowSlotForm(false)} // <- Hide form
              >
                Cancel
              </button>
              <button className="submit-button">Submit</button>
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Requested Message</th>
                <th>Scheduled Date</th>
                <th>Scheduled Time</th>
                <th>Meeting Link</th>
                <th>Admin Message</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query.id}>
                  <td>{query.id}</td>
                  <td>{query.status}</td>
                  <td>{query.requestedDate}</td>
                  <td>{query.requestedMessage}</td>
                  <td>{query.scheduledDate || "N/A"}</td>
                  <td>{query.scheduledTime || "N/A"}</td>
                  <td>
                    {query.meetingLink ? (
                      <a
                        href={query.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{query.adminMessage || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Navbar>
  );
};

export default Query;
