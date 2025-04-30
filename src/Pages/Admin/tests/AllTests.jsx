import React from 'react'
import './test.css'
import TetsList from './TetsList'

import AdminNavbar from "../../../Components/Sidebar/AdminNavbar";
import Header from "../../../Components/Header/Header";

const AllTests = () => {

    return (
        <AdminNavbar>
          <div className="admin">
            {/* header component  */}
            <Header Title={"Tests"} Address={"Test"} />
    
            <TetsList />
</div>
        </AdminNavbar>
      );
}

export default AllTests