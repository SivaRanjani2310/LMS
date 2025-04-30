import "./Dashboard.css";
import Sidebar from "../Components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="sidebarBox">
        <Sidebar />
      </div>
      <div className="outletBox">
        <Outlet />
      </div>
    </div>
    // <div className="d-grid">
    //   <div className="row">
    //     <div className="col-2">
    //       <Sidebar />
    //     </div>
    //     <div className="col-10">
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
  );
}

export default Dashboard;
