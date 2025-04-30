import React from 'react'
import "./Admin_counter.css"
import { Users } from 'lucide-react'



const Admin_counter = ({ users,degrees }) => {
    console.log(users);
    
  return (
      <div className="admin_counter_list">
          <Admin_counter_card title={'Total Users'} counts={users.length || 0 } />
          <Admin_counter_card title={'Total Courses'} counts={degrees.length || 0 } />
   </div>
  )
}

export default Admin_counter

const Admin_counter_card = ({title,counts}) => {
    return (
        <div className="admin-counter-card">
            <div className="admin-counter-icon">
                <Users/>
            </div>
            <div className="admin-counter-info">
                <div className="admin-counter-title">{title}</div>
                <div className="admin-counter-count">{counts}</div>
            </div>
        </div>
    )
}