import React, { useEffect, useState } from "react";
import "./Admin_home.css";
import Admin_table from "../Admin_table/Admin_table";
import Header1 from "../../../../Components/Header1/Header1";
import Admin_counter from "../Admin_counter/Admin_counter";
import usersData from "./users.json";
import degreesData from "./degrees.json";

const Admin_home = () => {
  const [users, setUsers] = useState([]);
  const [degrees, setDegrees] = useState([]);

  useEffect(() => {
    // Simulate API fetching by setting imported JSON data
    setUsers(usersData.users);
    setDegrees(degreesData.degrees);
  }, []);

  return (
    <div className="d-flex flex-column gap-2 w-100">
      <div className="admin-header">
        <Header1 />
      </div>
      <Admin_counter users={users} degrees={degrees} />
      <Admin_table />
    </div>
  );
};

export default Admin_home;
