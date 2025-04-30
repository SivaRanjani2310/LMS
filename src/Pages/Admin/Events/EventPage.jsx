import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";
import "./Event.css";
import Event from "./Event";

const EventPage = () => {
  const navigate = useNavigate();

  return (
    <AdminNavbar>
      <div className="admin">
        <Header Title={"Events"} Address={"Events"} />
        <Event />
      </div>
    </AdminNavbar>
  );
};

export default EventPage;
