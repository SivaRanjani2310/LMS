import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import AddEvent from "./AddEvent";
import EventList from "./EventList";


import "./Event.css";
import { Button } from "antd";



const Event = () => {
  const navigate = useNavigate();
  const [ eventlist, setEventlist ] = useState([]);
const [degreeId, setDegreeId] = useState("");
  const [DegreeList, setDegreeList] = useState([]);

  const fetchDegree = async () => {
    const response = await axios.get(`${apiBaeApi}/api/degrees`);
    const { degrees } = await response.data;
    setDegreeList(degrees);
  };
  
  useEffect(() => {
    const getEvent = async () => {
      const resEvents = await axios.get(`${apiBaeApi}/api/admin-event/${degreeId}`);
      const { events } = resEvents.data;
      //   console.log(events);
      setEventlist(events);
    };
    getEvent();
    fetchDegree();
  }, [degreeId]);

  return (
    <>

      <div className="main-event-section">
        <AddEvent />
        <EventList events={eventlist} degreeId={degreeId} setDegreeId={setDegreeId} DegreeList={DegreeList} />
      </div>
   
    </>
  );
};

export default Event;
